# Video files

Videos are hosted on Cloudflare R2, not in this repo — the raw clips are too
large for GitHub (several are 100–250 MB; GitHub hard-blocks anything over
100 MB and this folder would otherwise blow past the recommended repo size).

`js/main.js` loads each tile's clip from `VIDEO_BASE_URL + file`, where
`VIDEO_BASE_URL` is the R2 bucket's public URL and `file` is the exact
object name in that bucket (set per tile in the `WORK` array). Nothing in
this repo folder is used at runtime; this file is just a note of where the
video's source of truth lives.

## Bucket

- Cloudflare R2 bucket: `zs-portfolio-videos`
- Public access: enabled via the bucket's `r2.dev` subdomain
- Free tier: 10 GB storage, **zero egress/bandwidth cost** no matter how
  much traffic the site gets — this is why R2 was chosen over S3 or a
  regular web host for video this size.

## Adding or replacing a clip

1. Upload the new `.mp4`/`.mov` file to the `zs-portfolio-videos` bucket
   (drag-and-drop in the Cloudflare dashboard, or any S3-compatible tool
   pointed at R2's API).
2. Add or update the matching entry in the `WORK` array in `js/main.js`,
   setting `file` to the exact object name you uploaded (case-sensitive,
   spaces are fine — the code URL-encodes them).
3. Commit and push. No other wiring needed — the tile picks up the new
   clip on next page load.

## Keeping new clips reasonably sized

Not required (R2 doesn't charge for bandwidth), but smaller files load
faster for visitors: re-encode to **H.264/H.265 MP4, ≤1080p, CRF ~26–28**
before uploading if a clip is much larger than a few hundred MB.
