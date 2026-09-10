#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confere que o dist e equivalente ao index original."""
import re, os, sys, hashlib

import sys
SRC = sys.argv[1] if len(sys.argv)>1 else "/mnt/user-data/uploads/index_-_2026-09-09T161809_233.html"
OUT = sys.argv[2] if len(sys.argv)>2 else "/home/claude/build/dist"
orig = open(SRC, encoding="utf-8").read()
novo = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()
falhas = []

def norm(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    return re.sub(r'\s+', '', t)

# 1. CSS: todas as regras preservadas
css_orig = "".join(m.group(1) for m in re.finditer(r'<style\b[^>]*>(.*?)</style>', orig, re.S))
css_novo = open(os.path.join(OUT, "assets/css/app.css"), encoding="utf-8").read()
css_novo = re.sub(r'/\* ===== \d+ · .*? ===== \*/', '', css_novo)
css_novo = re.sub(r'/\* PCE 2\.0 — folha unica.*?\*/', '', css_novo, flags=re.S)
IMGRE = r'data:image/[a-z]+;base64,[A-Za-z0-9+/=]{200,}'
PATHRE = r'(?:assets/img|\.\./img)/[A-Za-z0-9\-]+\.(?:png|webp)'
css_orig = re.sub(IMGRE, '@IMG@', css_orig)
css_novo = re.sub(PATHRE, '@IMG@', css_novo)
if norm(css_orig) != norm(css_novo):
    falhas.append("CSS divergente (%d vs %d chars normalizados)" % (len(norm(css_orig)), len(norm(css_novo))))

# 2. JS: todo bloco inline existe em algum arquivo, byte a byte (fora os 2 patches)
inline = [m.group(2) for m in re.finditer(r'<script\b([^>]*)>(.*?)</script>', orig, re.S)
          if 'src=' not in m.group(1) and m.group(2).strip()]
arquivos = {}
for f in sorted(os.listdir(os.path.join(OUT, "assets/js"))):
    arquivos[f] = open(os.path.join(OUT, "assets/js", f), encoding="utf-8").read()
todos = "\n".join(arquivos.values())
PATCHES = ["setInterval(()=>fetchAllData(true)"]        # trecho reescrito de proposito
for i, code in enumerate(inline, 1):
    cn = norm(re.sub(IMGRE, '@IMG@', code))
    if any(p.replace(" ", "") in norm(code) for p in PATCHES):
        continue                                        # bloco alterado nas Fases 1/2
    achou = any(cn == norm(re.sub(PATHRE, '@IMG@', v)) for v in arquivos.values())
    if not achou:
        falhas.append("bloco JS inline #%d nao encontrado integro no dist (%d chars)" % (i, len(cn)))

# 3. Referencias de arquivo resolvem
for m in re.finditer(r'(?:src|href)="((?:assets|tools)/[^"?]+)', novo):
    if not os.path.exists(os.path.join(OUT, m.group(1))):
        falhas.append("referencia quebrada: " + m.group(1))
for m in re.finditer(r'assets/img/[A-Za-z0-9\-]+\.(?:png|webp)', novo + todos):
    if not os.path.exists(os.path.join(OUT, m.group(0))):
        falhas.append("imagem inexistente: " + m.group(0))

# 4. Markup preservado (fora style/script)
def markup(t):
    t = re.sub(r'<script\b.*?</script>', '', t, flags=re.S)
    t = re.sub(r'<style\b[^>]*>.*?</style>', '', t, flags=re.S)
    t = re.sub(r'<link rel="stylesheet" href="assets/css/app\.css[^"]*">', '', t)
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    t = re.sub(r'data:image/[a-z]+;base64,[A-Za-z0-9+/=]{200,}', '@IMG@', t)
    t = re.sub(r'assets/img/[A-Za-z0-9\-]+\.(?:png|webp)', '@IMG@', t)
    return re.sub(r'\s+', ' ', t).strip()
if markup(orig) != markup(novo):
    a, b = markup(orig), markup(novo)
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    falhas.append("markup divergente perto de: ...%s|||%s..." % (a[max(0,i-90):i], b[i:i+90]))

# 5. Ordem dos scripts preservada
ordem = re.findall(r'<script[^>]*src="assets/js/([^"]+)"', novo)
print("ordem de execucao:", " -> ".join(ordem))

print("\n" + ("FALHAS:\n- " + "\n- ".join(falhas) if falhas else "VERIFICACAO OK: dist equivalente ao original"))
sys.exit(1 if falhas else 0)
