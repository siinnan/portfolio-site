// Zafar & Sinan — portfolio board (layout 1a, ragged masonry)
//
// Video files are hosted on Cloudflare R2 (free tier), not in this repo —
// see assets/videos/README.md for why. Each tile's `file` field is the
// exact object name in the R2 bucket; VIDEO_BASE_URL below is the bucket's
// public URL. Update the titles/blurbs in WORK below with real project
// details whenever you get a chance — they're auto-generated from the
// original clip filenames for now.

(function () {
  "use strict";

  const VIDEO_BASE_URL = "https://pub-911d10567cc84eb59e6b9354e927ffc2.r2.dev/";

  // Column span out of 12, row-uniform bands so the 9:16 tiles interlock
  // with no holes: big / small / big / small / big.
  const SPANS = [
    4, 4, 4,
    2, 2, 2, 2, 2, 2,
    4, 4, 4,
    2, 2, 2, 2, 2, 2,
    4, 4, 4
  ];

  const WORK = [
    { slug: "1927",            file: "1927 1.0.mp4",           num: "01", title: "1927",            meta: "Reel · 0:20", blurb: "Add a line about this project here." },
    { slug: "andaz",           file: "Andaz 4.0.mp4",          num: "02", title: "Andaz",            meta: "Hospitality · 0:31", blurb: "Add a line about this project here." },
    { slug: "andazz-2",        file: "Andazz 2.0.mp4",         num: "03", title: "Andaz II",         meta: "Hospitality · 0:30", blurb: "Add a line about this project here." },
    { slug: "bmw-e30",         file: "bmw e30 4.MP4",          num: "04", title: "BMW E30",          meta: "Automotive · 0:21", blurb: "Add a line about this project here." },
    { slug: "ciel",            file: "CIEL 1.0.mp4",           num: "05", title: "Ciel",             meta: "Hospitality · 0:32", blurb: "Add a line about this project here." },
    { slug: "firepit",         file: "FIREPIT 1.0.mp4",        num: "06", title: "Firepit",          meta: "Reel · 0:20", blurb: "Add a line about this project here." },
    { slug: "gazebo",          file: "Gazebo 3.1.mp4",         num: "07", title: "Gazebo",           meta: "Reel · 0:27", blurb: "Add a line about this project here." },
    { slug: "gloria",          file: "Gloria 1.0.mp4",         num: "08", title: "Gloria",           meta: "Reel · 0:17", blurb: "Add a line about this project here." },
    { slug: "haval",           file: "haval final vid.MP4",    num: "09", title: "Haval",            meta: "Automotive · 0:33", blurb: "Add a line about this project here." },
    { slug: "karl-kids",       file: "Karl Kids 1.0.mp4",      num: "10", title: "Karl Kids",        meta: "Reel · 0:20", blurb: "Add a line about this project here." },
    { slug: "lambo-urus",      file: "lambo urus reel.MP4",    num: "11", title: "Lamborghini Urus", meta: "Automotive · 0:16", blurb: "Add a line about this project here." },
    { slug: "liwa",            file: "LIWA 1.0.mp4",           num: "12", title: "Liwa",             meta: "Reel · 0:35", blurb: "Add a line about this project here." },
    { slug: "sophia",          file: "Sophia 0.4.mp4",         num: "13", title: "Sophia",           meta: "Reel · 0:30", blurb: "Add a line about this project here." },
    { slug: "steve-aoki",      file: "Stebe Aoki BASIC.mp4",   num: "14", title: "Steve Aoki",       meta: "Event / music · 0:50", blurb: "Add a line about this project here." },
    { slug: "toto",            file: "Toto1080p 30fps.mp4",    num: "15", title: "Toto",             meta: "Automotive · 0:34", blurb: "Add a line about this project here." },
    { slug: "wave",            file: "Wave 1.0.mp4",           num: "16", title: "Wave",             meta: "Reel · 0:14", blurb: "Add a line about this project here." },
    { slug: "zaza",            file: "zaza 1.0.mp4",           num: "17", title: "Zaza",             meta: "Reel · 0:13", blurb: "Add a line about this project here." },
    { slug: "untitled-clip-1", file: "copy_31F99689-2E5D-4A31-8C89-6E7685A8C80E.MOV", num: "18", title: "Untitled Clip 1", meta: "Reel · 0:51", blurb: "Rename this tile once you know which project this clip is." },
    { slug: "untitled-clip-2", file: "copy_407A979D-C9A1-4342-BD8D-E9327BCD9D6B.MOV", num: "19", title: "Untitled Clip 2", meta: "Reel · 0:17", blurb: "Rename this tile once you know which project this clip is." },
    { slug: "untitled-clip-3", file: "copy_447415D8-7BD0-4A88-9D0F-CAC130B3D42B.MOV", num: "20", title: "Untitled Clip 3", meta: "Reel · 0:15", blurb: "Rename this tile once you know which project this clip is." },
    { slug: "untitled-clip-4", file: "copy_5BE24F4D-D758-46AE-BB2D-74BB9229B183.MOV", num: "21", title: "Untitled Clip 4", meta: "Reel · 0:16", blurb: "Rename this tile once you know which project this clip is." }
  ];

  const grid = document.getElementById("tile-grid");
  let openIndex = null;

  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      for (const key in attrs) {
        if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  // Wires a <video> to try loading a real file from the R2 bucket. On
  // success it fades the placeholder out and plays; on failure (file
  // missing/renamed) it stays hidden and the placeholder frame keeps
  // showing.
  function wireVideo(video, file, opts) {
    const src = VIDEO_BASE_URL + encodeURIComponent(file);
    video.muted = !!opts.muted;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.addEventListener("loadeddata", function onReady() {
      video.classList.add("is-ready");
      video.play().catch(function () { /* autoplay blocked, tile still readable */ });
      video.removeEventListener("loadeddata", onReady);
    });
    video.addEventListener("error", function onError() {
      video.classList.remove("is-ready");
      video.removeEventListener("error", onError);
    });

    video.src = src;
    video.load();
  }

  function buildTile(item, index) {
    const tile = el("button", "tile", {
      type: "button",
      "aria-label": "Play " + item.title,
      "aria-expanded": "false"
    });
    tile.appendChild(el("div", "tile-texture"));

    const previewVideo = el("video", "tile-video");
    tile.appendChild(previewVideo);
    wireVideo(previewVideo, item.file, { muted: true });

    const overlay = el("div", "tile-overlay");
    const metaRow = el("div", "tile-meta-row");
    metaRow.appendChild(el("span", "tile-num", { text: item.num }));
    const badge = el("span", "tile-badge", { text: "Loop" });
    metaRow.appendChild(badge);
    overlay.appendChild(metaRow);

    const textBlock = el("div");
    textBlock.appendChild(el("div", "tile-title", { text: item.title }));
    textBlock.appendChild(el("div", "tile-sub", { text: item.meta }));
    overlay.appendChild(textBlock);

    tile.appendChild(overlay);

    tile.addEventListener("click", function () { toggle(index); });

    return tile;
  }

  function buildPanel(item, index) {
    const panel = el("div", "panel");

    const screen = el("div", "screen");
    screen.appendChild(el("div", "screen-texture"));
    screen.appendChild(el("div", "screen-wipe"));
    screen.appendChild(el("div", "screen-scan"));

    const screenVideo = el("video", "screen-video", { controls: "" });
    screen.appendChild(screenVideo);
    wireVideo(screenVideo, item.file, { muted: false });

    const placeholder = el("div", "screen-placeholder");
    placeholder.appendChild(el("div", "label", { text: "Native player" }));
    placeholder.appendChild(el("p", null, { text: "Your file plays here, inside the page. Muted loop in the tile, sound when it opens. No branding, no suggested videos." }));
    screen.appendChild(placeholder);

    panel.appendChild(screen);

    const body = el("div", "panel-body");
    body.appendChild(el("div", "panel-title", { text: item.title }));
    body.appendChild(el("div", "panel-meta", { text: item.meta }));
    body.appendChild(el("div", "panel-rule"));
    body.appendChild(el("div", "panel-blurb", { text: item.blurb }));

    const closeBtn = el("button", "panel-close", { type: "button", text: "Close" });
    closeBtn.addEventListener("click", function () { toggle(index); });
    body.appendChild(closeBtn);

    panel.appendChild(body);
    return panel;
  }

  function toggle(index) {
    openIndex = openIndex === index ? null : index;
    render();
    if (openIndex !== null) {
      const openedCell = grid.children[openIndex];
      if (openedCell) openedCell.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function render() {
    grid.innerHTML = "";
    WORK.forEach(function (item, index) {
      const isOpen = openIndex === index;
      const cell = el("div", "cell" + (isOpen ? " is-open" : ""));
      cell.style.setProperty("--span", SPANS[index]);

      if (isOpen) {
        cell.appendChild(buildPanel(item, index));
      } else {
        cell.appendChild(buildTile(item, index));
      }

      grid.appendChild(cell);
    });
  }

  render();
})();
