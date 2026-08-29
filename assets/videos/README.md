# Video files

Drop the studio's `.mp4` files in here, one per tile, named to match the
`slug` field in `js/main.js`:

```
assets/videos/roastery-brand-film.mp4
assets/videos/sneaker-drop.mp4
assets/videos/gym-launch.mp4
assets/videos/restaurant-menu-refresh.mp4
assets/videos/founder-interview.mp4
assets/videos/skate-session.mp4
assets/videos/jewellery-product.mp4
assets/videos/wedding-highlight.mp4
assets/videos/barber-shop-series.mp4
assets/videos/music-video.mp4
assets/videos/real-estate-walkthrough.mp4
assets/videos/festival-recap.mp4
```

Nothing else needs to change — `js/main.js` tries to load each file by that
name and falls back to the placeholder frame if it's missing, so tiles pick
up real video the moment a matching file lands here.

## Keeping this cheap on GitHub Pages

- All 9:16, so keep an eye on file size — re-encode to **H.264 MP4, ~1280×2276
  or smaller, CRF ~26–28** before committing. A 15–60s clip at that setting
  is usually a few MB, not tens of MB.
- GitHub blocks any single file over 100 MB, and warns above 50 MB — stay
  well under that per file.
- If the repo's total size starts creeping past a few hundred MB (many
  videos, or longer ones), switch to **Git LFS** for this folder rather than
  committing raw video, or host the files on a free static host (e.g.
  Cloudflare R2's free tier, Bunny Stream, or even a public folder in
  Google Drive/Dropbox with a direct link) and point `VIDEO_DIR` in
  `js/main.js` at that URL instead. Either way the tile code doesn't change.
