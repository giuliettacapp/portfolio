# Portfolio di Giulietta Cappelletti

Istruzioni per Claude (valgono con qualsiasi account).

## Chi è l'utente
Giulietta, UX/UI designer a Milano. Scrive in italiano, rispondi in italiano. Non è una sviluppatrice: i passaggi tecnici (git, script, conversioni) li fai tu. Lei gestisce le interfacce di GitHub, Cloudflare e Claude Design.

## Il progetto
- **Repo**: questa cartella, branch `main`, remote `https://github.com/giuliettacapp/portfolio.git`.
- **Deploy**: push su `main` → Cloudflare pubblica in automatico.
- **Dominio**: `https://giulietta.cappelletti.me` (og:image, og:url e canonical lo usano già).
- **Runtime**: `support.js` carica React e Babel da unpkg e compila i `.dc.html` nel browser. Niente SSR, quindi SEO debole per scelta.

## Da dove arriva il design
Il design vive nel canvas di **Claude Design**. Gli export arrivano come `# UXUI Designer Portfolio (N).zip` in `Downloads`. Quando lei scrive "fatto" (o c'è uno zip nuovo), rilancia tutta la pipeline qui sotto, poi fai commit e push.

Le modifiche fatte a mano in questa cartella si perdono al prossimo export, se non le riapplichi. Prima di sovrascrivere, confronta con `git log` / `git diff` e riapplica le modifiche manuali recenti (es. testi del CV, Booklings), oppure chiedile di riportarle nel canvas.

## Pipeline dopo ogni export
Lavora su una cartella nuova, poi copia qui sopra (lasciando stare `.git`, `CLAUDE.md` e `.assetsignore`).

1. Estrai lo zip **senza** `uploads/`. Elimina `.thumbnail` e il `CLAUDE.md` dell'export (non questo file).
2. Rinomina le pagine come nella tabella "URL puliti" più sotto (`Portfolio.dc.html` diventa `index.html`) e riscrivi i link.
3. Rinomina `.image-slots.state.json` → `image-slots.state.json` e aggiorna `STATE_FILE` in `image-slot.js`: più di 26 immagini esistono solo lì dentro in base64, e un dotfile è fragile sugli host.
4. Correggi `image-slot.js` perché l'`<img>` abbia alt = attributo `alt` || `placeholder`. Sempre in `image-slot.js`: in `.frame img` cambia `touch-action:none` in `touch-action:pan-y pinch-zoom`, altrimenti lo scroll da telefono si blocca quando il dito parte da un'immagine.
5. Converti PNG/JPG/GIF → WebP con l'ffmpeg di Shotcut (`C:\Program Files\Shotcut\ffmpeg.exe`, include libwebp; ffprobe vuole `</dev/null`, non `-nostdin`). Aggiorna i nomi dei file in tutti i `.dc.html`.
6. Ricodifica gli MP4: h264 CRF 26, `-an` (il sito li riproduce muti).
7. Cancella i file che nessun HTML/JS referenzia.
8. Sposta i meta di `<helmet>` nell'`<head>` statico (il runtime clona helmet senza deduplicare e i crawler non eseguono JS).
9. Metti copie JPG delle immagini og in `images/og/`.
10. `lang="en"` su `<html>`.
11. `.assetsignore` deve contenere `.git`, `.git/**`, `CLAUDE.md`.
12. `404.html` presente.
13. Pulsante CV nella pagina Resume + `Giulietta-Cappelletti-CV.pdf` nella root.
14. Verifica che non ci siano riferimenti rotti, poi fai commit e push.

**Cose che lei gestisce già in Claude Design (non rifarle, controlla solo che ci siano):** titoli, descrizioni e og tag per ogni pagina, `favicon.svg`, contrasto tramite `--a1-ink` (testo) e `--a1` (grafica).

Motivo: l'export è un artefatto del tool di design, non un sito pronto da pubblicare. Ogni passaggio corregge un problema visto davvero su Netlify/Cloudflare.

## URL puliti (dal 2026-11-13)
Le pagine pubblicate hanno nomi corti, Cloudflare le serve senza `.html` (`/projects`, `/tagalong`…). Dopo ogni export:

| File dell'export | File pubblicato |
|---|---|
| `Portfolio.dc.html` | `index.html` (niente copia: la home vive solo lì) |
| `Projects.dc.html` | `projects.html` |
| `Playground.dc.html` | `playground.html` |
| `About.dc.html` | `about.html` |
| `Resume.dc.html` | `resume.html` |
| `Case Study Tagalong.dc.html` | `tagalong.html` |
| `Case Study Booklings.dc.html` | `booklings.html` |
| `Case Study.dc.html` (Furbrawl) | `furbrawl.html` |
| `Case Study Gymboo.dc.html` | `gymboo.html` |
| `Case Study So Fur So Good.dc.html` | `so-fur-so-good.html` |

- In tutti gli HTML (anche `Nav.dc.html` e `Footer.dc.html`, che tengono il loro nome perché il runtime li carica così) riscrivi i link: `./Projects.dc.html` → `./projects`, `./Portfolio.dc.html` → `./`, e lo stesso in canonical e og:url.
- I vecchi nomi `.dc.html` delle pagine restano nel repo come **stub di redirect** (meta refresh + `location.replace`, noindex) verso il nuovo indirizzo: servono ai link già condivisi. Non cancellarli e non sovrascriverli con l'export.
- Per provare in locale serve un server che mappi `/projects` su `projects.html` (un server statico semplice non basta).

## Modifiche di contenuto fatte a mano il 2026-11-13 (da riapplicare o riportare nel canvas)
- Dati di Resume e About allineati al CV PDF (ruoli, aziende, date, corsi, skill).
- Home: la scena dell'hero ha larghezza `min(775px,100%,max(300px,calc((100svh - 446px) * 1.2975)))`, così titolo e pulsante stanno nel primo schermo; eyebrow più piccolo.
- Niente numeri nei titoli (scelta di Giulietta: lo trova un pattern da testo generato). Vale anche per i titoli nuovi.
- Furbrawl: frasi generiche riscritte. Gymboo: ruolo esplicito (ricerca, wireframe, UI in un progetto di gruppo).
- Projects: Booklings subito dopo Tagalong, i due progetti universitari in fondo.
- Footer: `font-size:min(clamp(38px,6.6vw,76px),8.4vw)` sul titolo, altrimenti "something beautiful" esce dallo schermo sui telefoni.

## Patch grafiche rifatte a ogni export
- **Contorni soft** (scelta di Giulietta): in `Nav.dc.html` la regola CSS `[style*="border:1px solid var(--line)"]` mette il bordo trasparente e un'ombra morbida su card e riquadri (i filetti border-top/left restano). Rifai la modifica nel helmet del Nav dopo ogni export.
- **Nav mobile**: hamburger sotto 820px, niente toggle dark/light; `html,body{overflow-x:clip}`.
- `reveal.js` ignora i nodi `<i>` della scia del cursore; `hero-scene.js` salta il parallasse quando l'hero e' fuori schermo.
- `image-slot.js`: nella regola `.ring{` aggiungi `display:none!important;` (anello tratteggiato degli slot vuoti: restava visibile sopra le immagini, es. Playground > VR car configurator).
