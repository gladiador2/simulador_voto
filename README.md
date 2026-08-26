# Simuladores de votación

Simuladores de demostración de la Boleta Única Electrónica, sin vínculo con la Justicia Electoral. Publicados con GitHub Pages, cada uno en su propia carpeta:

- [`/erico`](erico/) — Simulador Erico.
- [`/cabrera`](cabrera/) — Simulador Cabrera.

La página raíz (`index.html`) es solo un índice con links a cada uno.

## Publicar en GitHub Pages

1. Settings → Pages → Build and deployment → Source: **Deploy from a branch**.
2. Branch: `main`, carpeta `/ (root)`.
3. Guardar. La URL queda `https://<usuario>.github.io/<repo>/`, con cada simulador en `.../erico/` y `.../cabrera/`.

## Estructura

Cada carpeta de simulador es autocontenida (HTML/CSS/JS estático, sin build). `index.html` dentro de cada una es la guía rápida de uso; de ahí se pasa a `app.html`, que es la simulación en sí.
