# Zafar &amp; Sinan — portfolio site

A single-page video portfolio. Tiles loop silently; click one to expand it in
place with sound, others reflow around it. Plain HTML/CSS/JS, no build step,
free to host on GitHub Pages.

```
index.html          the page
css/style.css        all styling
js/main.js            tile data + open/close behaviour + video wiring
assets/videos/        notes only — the actual video files live on Cloudflare R2 (see assets/videos/README.md)
design/                the original Claude Design handoff (mockups, chat log) — reference only, not shipped
```

## Run it locally

No build step. Either open `index.html` directly, or serve it so the video
`fetch`/`error` handling behaves like it will in production:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add videos

Video files are hosted on Cloudflare R2 (free tier), not in this repo — see
`assets/videos/README.md` for the bucket details and how to add a clip.
Short version: upload the file to the R2 bucket, then set its `file` field
in the `WORK` array in `js/main.js` to the exact object name you uploaded.

## Host it on GitHub Pages (free)

1. Push this repo to GitHub.
2. Repo **Settings → Pages** → under "Build and deployment", set **Source**
   to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a `https://<username>.github.io/<repo>/` URL a minute or
   two later.

That's the whole hosting setup for the page itself — no server, no
framework, no cost. Video files are served separately from Cloudflare R2
(see `assets/videos/README.md`), so repo size never becomes an issue as you
add more clips.

## About `design/`

`design/` is the original handoff from Claude Design: the chat transcript
and the three board mockups the user picked from (1a, "ragged masonry", is
the one built here). Kept for reference; it isn't part of the shipped site.
