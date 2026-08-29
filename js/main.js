// Zafar & Sinan — portfolio board (layout 1a, ragged masonry)
//
// Video files: drop an .mp4 named after a tile's `slug` into assets/videos/
// (e.g. assets/videos/roastery-brand-film.mp4) and it plays automatically —
// nothing else to wire up. Until a file exists for a tile, that tile falls
// back to the placeholder frame below (this is expected, not a bug).

(function () {
  "use strict";

  const VIDEO_DIR = "assets/videos/";

  // Column span out of 12, row-uniform bands so the 9:16 tiles interlock
  // with no holes: big / small / big.
  const SPANS = [4, 4, 4, 2, 2, 2, 2, 2, 2, 4, 4, 4];

  const WORK = [
    { slug: "roastery-brand-film", num: "01", title: "Roastery / Brand Film", meta: "Brand film · 2:10", blurb: "One shoot day. A two-minute origin film, plus nine vertical lifts that ran for a month." },
    { slug: "sneaker-drop", num: "02", title: "Sneaker Drop", meta: "Ads / paid · 0:15", blurb: "Fifteen-second paid cut. Three hooks tested against one body, the winner scaled." },
    { slug: "gym-launch", num: "03", title: "Gym Launch", meta: "Reels · 0:28", blurb: "Opening week filmed in a day, then posted daily for a fortnight." },
    { slug: "restaurant-menu-refresh", num: "04", title: "Restaurant Menu Refresh", meta: "Food / social · 0:45", blurb: "Twelve dishes in an afternoon. One reel per plate, enough for six weeks of posts." },
    { slug: "founder-interview", num: "05", title: "Founder Interview", meta: "Talking head · 4:02", blurb: "Two-camera interview, captioned, sliced into six short-form pulls." },
    { slug: "skate-session", num: "06", title: "Skate Session", meta: "Documentary · 3:18", blurb: "Handheld all day, graded warm, cut to the sound of the session." },
    { slug: "jewellery-product", num: "07", title: "Jewellery Product", meta: "Product · 0:22", blurb: "Macro turntable on a black sweep. Real light, no CGI." },
    { slug: "wedding-highlight", num: "08", title: "Wedding Highlight", meta: "Event · 5:40", blurb: "Full day, two shooters. A highlight film and a one-minute social edit." },
    { slug: "barber-shop-series", num: "09", title: "Barber Shop Series", meta: "Social management · Ongoing", blurb: "One shoot day a month feeds a calendar we write and schedule for them." },
    { slug: "music-video", num: "10", title: "Music Video", meta: "Music · 3:05", blurb: "One location, one lens, shot between eight and ten at night." },
    { slug: "real-estate-walkthrough", num: "11", title: "Real Estate Walkthrough", meta: "Property · 1:35", blurb: "Gimbal walkthrough plus stills, in their hands the next morning." },
    { slug: "festival-recap", num: "12", title: "Festival Recap", meta: "Event · 1:12", blurb: "Two days of coverage, recap posted the same night." }
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

  // Wires a <video> to try loading a real file. On success it fades the
  // placeholder out and plays; on failure (no file yet) it stays hidden and
  // the placeholder frame underneath keeps showing.
  function wireVideo(video, slug, opts) {
    const src = VIDEO_DIR + slug + ".mp4";
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
    wireVideo(previewVideo, item.slug, { muted: true });

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
    wireVideo(screenVideo, item.slug, { muted: false });

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
