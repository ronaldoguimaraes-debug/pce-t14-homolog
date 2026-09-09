#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PCE 2.0 — Fase 1 (carga sob demanda do painel Tweaks) e Fase 2 (higiene de runtime).
Engenharia e fundacao: Ronaldo Ferreira.
"""
import re, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/build/dist"
idx_path = os.path.join(OUT, "index.html")
idx = open(idx_path, encoding="utf-8").read()

# ─────────────────────────────────────────────────────────────
# FASE 1 — React dev + Babel deixam de carregar em toda visita
# ─────────────────────────────────────────────────────────────
LOADER = r'''/* PCE 2.0 · 07-tweaks-loader
   Carrega React (build de producao) + Babel + painel Tweaks somente quando o
   modo Tweaks e ativado. Antes disso o dashboard nao baixa nem executa nada
   dessa pilha. Ativacao: ?tweaks=1 na URL, Alt+Shift+T, ou pceTweaksAtivar().
   Engenharia e fundacao: Ronaldo Ferreira. */
(function () {
  'use strict';
  var LOADED = false, LOADING = null;

  var DEPS = [
    { src: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
      integrity: 'sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z' },
    { src: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
      integrity: 'sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1' },
    { src: 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
      integrity: 'sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y' }
  ];

  var JSX = ['tweaks-panel.jsx', 'assets/js/tweaks-panel-app.jsx'];

  function carregarScript(d) {
    return new Promise(function (ok, falha) {
      var s = document.createElement('script');
      s.src = d.src;
      if (d.integrity) { s.integrity = d.integrity; s.crossOrigin = 'anonymous'; }
      s.onload = function () { ok(); };
      s.onerror = function () { falha(new Error('Falha ao carregar ' + d.src)); };
      document.head.appendChild(s);
    });
  }

  function rodarJSX(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' em ' + url);
      return r.text();
    }).then(function (codigo) {
      var compilado = window.Babel.transform(codigo, { presets: ['react'], filename: url }).code;
      var s = document.createElement('script');
      s.textContent = compilado;
      s.setAttribute('data-origem', url);
      document.body.appendChild(s);
    });
  }

  function emSerie(lista, fn) {
    return lista.reduce(function (p, item) {
      return p.then(function () { return fn(item); });
    }, Promise.resolve());
  }

  function ativar() {
    if (LOADED) return Promise.resolve();
    if (LOADING) return LOADING;
    LOADING = emSerie(DEPS, carregarScript)
      .then(function () { return emSerie(JSX, rodarJSX); })
      .then(function () {
        LOADED = true; LOADING = null;
        try { localStorage.setItem('pce_tweaks', '1'); } catch (e) {}
      })
      .catch(function (e) {
        LOADING = null;
        if (window.console) console.warn('[TWEAKS] ' + e.message);
      });
    return LOADING;
  }

  function desativar() {
    try { localStorage.removeItem('pce_tweaks'); } catch (e) {}
    location.reload();
  }

  window.pceTweaksAtivar = ativar;
  window.pceTweaksDesativar = desativar;

  var alvo = (location.search + location.hash).toLowerCase();
  var pedidoNaUrl = alvo.indexOf('tweaks') > -1;
  var salvo = false;
  try { salvo = localStorage.getItem('pce_tweaks') === '1'; } catch (e) {}

  if (pedidoNaUrl || salvo) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ativar);
    } else { ativar(); }
  }

  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
      e.preventDefault();
      ativar();
    }
  });
})();
'''
open(os.path.join(OUT, "assets/js/07-tweaks-loader.js"), "w", encoding="utf-8").write(LOADER)

bloco_antigo = re.search(
    r'<script src="https://unpkg\.com/react@.*?<!-- painel Tweaks:[^>]*-->',
    idx, re.S)
assert bloco_antigo, "bloco React/Babel nao encontrado"
idx = idx.replace(bloco_antigo.group(0),
    '<!-- Painel Tweaks: React (producao) + Babel carregados sob demanda.\n'
    '     Ativacao: ?tweaks=1, Alt+Shift+T ou pceTweaksAtivar() no console. -->\n'
    '<script src="assets/js/07-tweaks-loader.js"></script>')
open(idx_path, "w", encoding="utf-8").write(idx)
print("FASE 1 ok — React dev e Babel saem da carga inicial")

# ─────────────────────────────────────────────────────────────
# FASE 2 — auto-refresh nao roda com a aba em segundo plano
# ─────────────────────────────────────────────────────────────
core = os.path.join(OUT, "assets/js/05-core-dashboard.js")
js = open(core, encoding="utf-8").read()

alvo = ("setInterval(()=>fetchAllData(true).catch(e=>Logger.warn('BOOT','Auto-refresh',"
        "{message:e.message})),15*60*1000);")
assert js.count(alvo) == 1, "alvo do auto-refresh nao encontrado (ou ambiguo)"

novo = """(function(){
  var _autoPendente=false;
  function _autoRefresh(){
    if(document.hidden){_autoPendente=true;return;}   // aba em segundo plano: adia
    _autoPendente=false;
    fetchAllData(true).catch(e=>Logger.warn('BOOT','Auto-refresh',{message:e.message}));
  }
  setInterval(_autoRefresh,15*60*1000);
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&_autoPendente)_autoRefresh();  // voltou pra frente: atualiza na hora
  });
})();"""
js = js.replace(alvo, novo)
open(core, "w", encoding="utf-8").write(js)
print("FASE 2 ok — auto-refresh de 15 min pausa com a aba oculta e recupera ao voltar")
