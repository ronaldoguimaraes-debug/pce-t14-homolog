#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PCE 2.0 — Token swap HOMOLOG <-> PROD sobre a estrutura em arquivos.
Engenharia e fundacao: Ronaldo Ferreira.

Com o index fatiado, as cores de ambiente passaram a viver em mais de um
arquivo (index.html, assets/css/app.css, assets/js/*.js). Este script faz a
mesma troca deterministica de sempre, agora varrendo a arvore inteira.

Uso:
    python3 tools/swap-env.py para-prod       # HOMOLOG -> PROD
    python3 tools/swap-env.py para-homolog    # PROD -> HOMOLOG
    python3 tools/swap-env.py conferir        # so relata, nao escreve

O --amber #f5c542 e preservado nos dois sentidos, como manda o norteador.
"""
import os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALVOS = ("index.html", ".css", ".js")
IGNORAR = ("assets/img", "tools", ".git")

# HOMOLOG -> PROD (o inverso e aplicado automaticamente)
CORES = [
    ("#f5a623",    "#63F858"),
    ("#e09018",    "#4bc943"),
    ("#3d2e0a",    "#243d26"),
    ("245,166,35", "99,248,88"),
]
PRESERVAR = ["#f5c542"]          # --amber nao entra na troca


def arquivos():
    for base, dirs, nomes in os.walk(RAIZ):
        rel = os.path.relpath(base, RAIZ).replace("\\", "/")
        if any(rel == i or rel.startswith(i + "/") for i in IGNORAR):
            continue
        for n in nomes:
            if n == "index.html" or n.endswith(".css") or n.endswith(".js"):
                yield os.path.join(base, n)


def trocar(texto, para_prod):
    n = 0
    guarda = {}
    for i, tok in enumerate(PRESERVAR):
        chave = "\x00GUARDA%d\x00" % i
        guarda[chave] = tok
        texto = texto.replace(tok, chave)
    for h, p in CORES:
        de, para = (h, p) if para_prod else (p, h)
        n += texto.count(de)
        texto = texto.replace(de, para)
    for chave, tok in guarda.items():
        texto = texto.replace(chave, tok)
    return texto, n


def ajustar_index(texto, para_prod):
    notas = []
    m = re.search(r"<title>(.*?)</title>", texto, re.S)
    if m:
        t = m.group(1)
        if para_prod and "[HOMOLOG]" in t:
            texto = texto.replace(m.group(0), "<title>%s</title>" % t.replace("[HOMOLOG]", "").strip())
            notas.append("title: prefixo [HOMOLOG] removido")
        elif not para_prod and "[HOMOLOG]" not in t:
            texto = texto.replace(m.group(0), "<title>[HOMOLOG] %s</title>" % t.strip())
            notas.append("title: prefixo [HOMOLOG] adicionado")
    b = re.search(r"<body[^>]*>", texto)
    if b:
        tag = b.group(0)
        if para_prod and "env-homologation" in tag:
            novo = re.sub(r'\s*class="[^"]*env-homologation[^"]*"', "", tag)
            texto = texto.replace(tag, novo, 1)
            notas.append("body: class env-homologation removida")
        elif not para_prod and "env-homologation" not in tag:
            novo = '<body class="env-homologation">' if tag == "<body>" else tag[:-1] + ' class="env-homologation">'
            texto = texto.replace(tag, novo, 1)
            notas.append("body: class env-homologation adicionada")
    return texto, notas


def main():
    modo = sys.argv[1] if len(sys.argv) > 1 else "conferir"
    if modo not in ("para-prod", "para-homolog", "conferir"):
        print(__doc__)
        return 2
    escrever = modo != "conferir"
    para_prod = modo == "para-prod"
    total = 0
    for caminho in sorted(arquivos()):
        rel = os.path.relpath(caminho, RAIZ)
        texto = open(caminho, encoding="utf-8").read()
        novo, n = trocar(texto, para_prod) if escrever else (texto, sum(
            texto.count(h if modo == "conferir" else h) for h, p in CORES))
        notas = []
        if rel == "index.html" and escrever:
            novo, notas = ajustar_index(novo, para_prod)
        if escrever and (novo != texto):
            open(caminho, "w", encoding="utf-8").write(novo)
        if n or notas:
            print("%-34s %4d cores%s" % (rel, n, ("  |  " + "; ".join(notas)) if notas else ""))
        total += n
    print("\ntotal de tokens de cor trocados: %d" % total)
    if escrever:
        print("lembrete: a div .homolog-banner e markup, nao token. "
              "Conferir a presenca dela no index conforme o ambiente.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
