#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PCE 2.0 — Reestruturacao do index (Fases 1, 2 e 3)
Engenharia e fundacao: Ronaldo Ferreira.

Entrada : index monolitico (1 arquivo)
Saida   : index.html + assets/css + assets/js + assets/img
Regra   : transformacao deterministica, sem reescrever logica de negocio.
"""
import re, os, base64, hashlib, json, shutil, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/uploads/index_-_2026-09-09T161809_233.html"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/home/claude/build/dist"

for sub in ("assets/css", "assets/js", "assets/img", "tools"):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)

src = open(SRC, encoding="utf-8").read()
orig_len = len(src)
report = {"origem_bytes": orig_len}

# ─────────────────────────────────────────────────────────────
# FASE 3a — Imagens base64 viram arquivos (com deduplicacao)
# ─────────────────────────────────────────────────────────────
IMG_NAMES = {}          # hash -> nome de arquivo
img_seq = {"png": 0, "webp": 0}
NAME_HINTS = {}

def img_name(mime, b64, ctx):
    h = hashlib.md5(b64.encode()).hexdigest()[:8]
    if h in IMG_NAMES:
        return IMG_NAMES[h]
    ext = "png" if "png" in mime else ("webp" if "webp" in mime else "bin")
    low = ctx.lower()
    if "env-homologation" in low:
        base = "logo-mark-homolog"
    elif "pce-logo-center" in low:
        base = "logo-pce-center"
    elif "logo-mark" in low:
        base = "logo-mark"
    elif "skeleton" in low:
        base = "logo-skeleton"
    else:
        img_seq[ext] = img_seq.get(ext, 0) + 1
        base = "coffeebreak-%02d" % img_seq[ext]
    name = "%s-%s.%s" % (base, h, ext)
    IMG_NAMES[h] = name
    with open(os.path.join(OUT, "assets/img", name), "wb") as f:
        f.write(base64.b64decode(b64 + "=" * (-len(b64) % 4)))
    return name

def repl_img(m):
    ctx = src[max(0, m.start() - 140):m.start()]
    return "assets/img/" + img_name(m.group(1), m.group(2), ctx)

src = re.sub(r'data:(image/[a-z]+);base64,([A-Za-z0-9+/=]{200,})', repl_img, src)
report["imagens_unicas"] = len(IMG_NAMES)
report["imagens_bytes"] = sum(
    os.path.getsize(os.path.join(OUT, "assets/img", n)) for n in IMG_NAMES.values())

# ─────────────────────────────────────────────────────────────
# FASE 3b — CSS: 11 blocos <style> concatenados em ordem
# ─────────────────────────────────────────────────────────────
style_blocks = list(re.finditer(r'<style\b([^>]*)>(.*?)</style>', src, re.S))
css_parts = []
for i, m in enumerate(style_blocks, 1):
    ident = re.search(r'id="([^"]+)"', m.group(1))
    label = ident.group(1) if ident else "bloco-%02d" % i
    css_parts.append("/* ===== %02d · %s ===== */\n%s\n" % (i, label, m.group(2).strip()))

# url() no CSS resolve em relacao ao proprio arquivo .css, nao a raiz do site:
# assets/img/x.png viraria assets/css/assets/img/x.png. Reescreve para ../img/.
css_body = "\n".join(css_parts).replace("url('assets/img/", "url('../img/")\
                                .replace('url("assets/img/', 'url("../img/')\
                                .replace("url(assets/img/", "url(../img/")
css_parts = [css_body]

css = ("/* PCE 2.0 — folha unica, blocos na ordem original do documento.\n"
       "   Engenharia e fundacao: Ronaldo Ferreira. */\n\n" + "\n".join(css_parts))
open(os.path.join(OUT, "assets/css/app.css"), "w", encoding="utf-8").write(css)

# substitui o 1o bloco pelo <link> e remove os demais
def strip_styles(text):
    out, first = [], True
    pos = 0
    for m in re.finditer(r'<style\b[^>]*>.*?</style>', text, re.S):
        out.append(text[pos:m.start()])
        if first:
            out.append('<link rel="stylesheet" href="assets/css/app.css">')
            first = False
        pos = m.end()
    out.append(text[pos:])
    return "".join(out)

src = strip_styles(src)
report["css_bytes"] = len(css)

# ─────────────────────────────────────────────────────────────
# FASE 3c — JS: cada <script> inline vira arquivo, ordem preservada
# ─────────────────────────────────────────────────────────────
JS_LABELS = [
    (r'PCE_TW_DEFAULTS',            "__TWEAKS_APP__"),
    (r"PCE_VERSION\s*=\s*'3\.0\.0'", "core-dashboard"),
    (r'MANUAL PCE DINAMICO',        "manual-pce"),
    (r'__npsVivoBooted',            "nps-vivo"),
    (r'__perfilPristineHTML',       "perfil-pristine"),
    (r'Template Credenciamento',    "credenciamento-xlsx"),
    (r"C=\{arch:",                  "fb-board"),
    (r'ESTOQUE PCE',                "estoque-pce"),
    (r'Reorganiza',                 "reorganizacao"),
    (r'AUDITORIA DE PERSONALIZADOS', "auditoria-personalizados"),
    (r'window\.__loadManualDeps\s*=', "manual-deps"),
]

def label_for(code, idx):
    for pat, name in JS_LABELS:
        if re.search(pat, code):
            return name if name.startswith("__") else "%02d-%s" % (idx, name)
    return "%02d-bloco" % idx

script_re = re.compile(r'<script\b([^>]*)>(.*?)</script>', re.S)
pieces, pos, idx = [], 0, 0
written = []
for m in script_re.finditer(src):
    attrs, code = m.group(1), m.group(2)
    pieces.append(src[pos:m.start()])
    pos = m.end()
    idx += 1
    has_src = 'src=' in attrs
    if has_src or not code.strip():
        pieces.append(m.group(0))          # scripts externos ficam como estao (tratados na Fase 1)
        continue
    name = label_for(code, idx)
    if name == "__TWEAKS_APP__":
        # bloco JSX do painel: vira arquivo .jsx carregado sob demanda
        open(os.path.join(OUT, "assets/js/tweaks-panel-app.jsx"), "w",
             encoding="utf-8").write(code.strip() + "\n")
        pieces.append("<!-- painel Tweaks: assets/js/tweaks-panel-app.jsx, carregado sob demanda -->")
        written.append(("assets/js/tweaks-panel-app.jsx", len(code)))
        continue
    fname = "assets/js/%s.js" % name
    header = ("/* PCE 2.0 · %s\n   Extraido do index monolitico sem alteracao de logica.\n"
              "   Engenharia e fundacao: Ronaldo Ferreira. */\n" % name)
    open(os.path.join(OUT, fname), "w", encoding="utf-8").write(header + code.strip() + "\n")
    written.append((fname, len(code)))
    keep = re.sub(r'\ssrc="[^"]*"', '', attrs).strip()
    keep = (" " + keep) if keep else ""
    pieces.append('<script%s src="%s"></script>' % (keep, fname))
pieces.append(src[pos:])
src = "".join(pieces)
report["js_arquivos"] = written

open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(src)
report["index_bytes"] = len(src)
print(json.dumps(report, ensure_ascii=False, indent=1)[:2000])
