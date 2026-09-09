/* PCE 2.0 · 07-tweaks-loader
   Carrega React (build de producao) + Babel + painel Tweaks somente quando o
   modo Tweaks e ativado. Antes disso o dashboard nao baixa nem executa nada
   dessa pilha. Ativacao: ?tweaks=1 na URL, Alt+Shift+T, ou pceTweaksAtivar().
   Engenharia e fundacao: Ronaldo Ferreira. */
(function () {
  'use strict';
  var LOADED = false, LOADING = null;
  var FALTANDO = [];

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

  /* Um fonte JSX ausente nao derruba a ativacao: e apenas avisado e pulado.
     Hoje o tweaks-panel.jsx nao esta publicado em nenhum dos repositorios, entao
     o painel nao monta. Isso ja acontecia antes desta reestruturacao. Basta
     publicar o arquivo na raiz para o painel voltar, sem mexer neste loader. */
  function rodarJSXTolerante(url) {
    // se um fonte anterior faltou, os seguintes dependem dele: nao adianta rodar
    if (FALTANDO.length) { return Promise.resolve(); }
    return rodarJSX(url).catch(function (e) {
      FALTANDO.push(url);
      if (window.console) console.warn('[TWEAKS] fonte ausente, ignorado: ' + e.message);
    });
  }

  function ativar() {
    if (LOADED) return Promise.resolve();
    if (LOADING) return LOADING;
    FALTANDO.length = 0;
    LOADING = emSerie(DEPS, carregarScript)
      .then(function () { return emSerie(JSX, rodarJSXTolerante); })
      .then(function () {
        LOADED = true; LOADING = null;
        if (FALTANDO.length && window.console) {
          console.warn('[TWEAKS] painel nao montado. Fontes ausentes: ' + FALTANDO.join(', '));
        } else {
          try { localStorage.setItem('pce_tweaks', '1'); } catch (e) {}
        }
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
