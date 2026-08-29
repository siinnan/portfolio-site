# Zafar &amp; Sinan — portfolio site

A single-page video portfolio. Tiles loop silently; click one to expand it in
place with sound, others reflow around it. Plain HTML/CSS/JS, no build step,
free to host on GitHub Pages.

```
index.html          the page
css/style.css        all styling
js/main.js            tile data + open/close behaviour + video wiring
assets/videos/        drop .mp4 files here (see assets/videos/README.md)
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

See `assets/videos/README.md`. Short version: name each `.mp4` after the
tile's `slug` in `js/main.js` and drop it in `assets/videos/` — nothing else
to wire up.

## Host it on GitHub Pages (free)

1. Push this repo to GitHub.
2. Repo **Settings → Pages** → under "Build and deployment", set **Source**
   to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a `https://<username>.github.io/<repo>/` URL a minute or
   two later.

That's the whole hosting setup — no server, no framework, no cost. The one
thing to watch as you add videos is repo size (see the note in
`assets/videos/README.md` on keeping files small and when to move to Git LFS
or an external host instead).

## About `design/`

`design/` is the original handoff from Claude Design: the chat transcript
and the three board mockups the user picked from (1a, "ragged masonry", is
the one built here). Kept for reference; it isn't part of the shipped site.
