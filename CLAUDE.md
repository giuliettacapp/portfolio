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
2. `cp Portfolio.dc.html index.html`.
3. Rinomina `.image-slots.state.json` → `image-slots.state.json` e aggiorna `STATE_FILE` in `image-slot.js`: più di 26 immagini esistono solo lì dentro in base64, e un dotfile è fragile sugli host.
4. Correggi `image-slot.js` perché l'`<img>` abbia alt = attributo `alt` || `placeholder`.
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
