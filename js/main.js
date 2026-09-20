// Zafar & Sinan — portfolio board (layout 1a, ragged masonry)
//
// Video files are hosted on Cloudflare R2 (free tier), not in this repo —
// see assets/videos/README.md for why. Each tile's `file` field is the
// exact object name in the R2 bucket; VIDEO_BASE_URL below is the bucket's
// public URL.
//
// Playback: tile previews are muted and only play on hover, not on page
// load. Sound only plays once a tile is clicked open in the lightbox.

(function () {
  "use strict";

  const VIDEO_BASE_URL = "https://pub-911d10567cc84eb59e6b9354e927ffc2.r2.dev/";
  // Poster stills are tiny (a few KB each) and live in this repo, so they
  // load instantly from GitHub Pages — no waiting on R2 for a thumbnail.
  const POSTER_BASE_URL = "assets/videos/posters/";

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
    { slug: "cinema-city",     file: "1927 1.0.mp4",           num: "01", title: "Cinema City",      meta: "Reel · 0:20", blurb: "" },
    { slug: "andaz",           file: "Andaz 4.0.mp4",          num: "02", title: "Andaz",            meta: "Hospitality · 0:31", blurb: "" },
    { slug: "andazz-2",        file: "Andazz 2.0.mp4",         num: "03", title: "Andaz II",         meta: "Hospitality · 0:30", blurb: "" },
    { slug: "bmw-e30",         file: "bmw e30 4.MP4",          num: "04", title: "BMW E30",          meta: "Automotive · 0:21", blurb: "" },
    { slug: "ciel",            file: "CIEL 1.0.mp4",           num: "05", title: "Ciel",             meta: "Hospitality · 0:32", blurb: "The tallest hotel in the world." },
    { slug: "firepit",         file: "FIREPIT 1.0.mp4",        num: "06", title: "Firepit",          meta: "Reel · 0:20", blurb: "" },
    { slug: "gazebo",          file: "Gazebo 3.1.mp4",         num: "07", title: "Gazebo",           meta: "Reel · 0:27", blurb: "" },
    { slug: "gloria",          file: "Gloria 1.0.mp4",         num: "08", title: "Gloria",           meta: "Reel · 0:17", blurb: "" },
    { slug: "auto-detailing",  file: "haval final vid.MP4",    num: "09", title: "Auto Detailing",   meta: "Automotive · 0:33", blurb: "" },
    { slug: "serves-gourmet",  file: "Karl Kids 1.0.mp4",      num: "10", title: "Serves Gourmet",   meta: "Reel · 0:20", blurb: "" },
    { slug: "lambo-urus",      file: "lambo urus reel.MP4",    num: "11", title: "Lamborghini Urus", meta: "Automotive · 0:16", blurb: "" },
    { slug: "jetour",          file: "LIWA 1.0.mp4",           num: "12", title: "Jetour",           meta: "Reel · 0:35", blurb: "" },
    { slug: "sophia",          file: "Sophia 0.4.mp4",         num: "13", title: "Sophia",           meta: "Reel · 0:30", blurb: "" },
    { slug: "steve-aoki",      file: "Stebe Aoki BASIC.mp4",   num: "14", title: "Steve Aoki",       meta: "Event / music · 0:50", blurb: "" },
    { slug: "toto",            file: "Toto1080p 30fps.mp4",    num: "15", title: "Toto",             meta: "Automotive · 0:34", blurb: "" },
    { slug: "wave",            file: "Wave 1.0.mp4",           num: "16", title: "Wave",             meta: "Reel · 0:14", blurb: "" },
    { slug: "zaza",            file: "zaza 1.0.mp4",           num: "17", title: "Zaza",             meta: "Reel · 0:13", blurb: "" },
    { slug: "auto-detailing-2", file: "copy_31F99689-2E5D-4A31-8C89-6E7685A8C80E.mp4", num: "18", title: "Auto Detailing II", meta: "Automotive · 0:51", blurb: "" },
    { slug: "toto-2",           file: "copy_407A979D-C9A1-4342-BD8D-E9327BCD9D6B.mp4", num: "19", title: "Toto II", meta: "Automotive · 0:17", blurb: "" },
    { slug: "jeep",             file: "copy_447415D8-7BD0-4A88-9D0F-CAC130B3D42B.mp4", num: "20", title: "Jeep", meta: "Automotive · 0:15", blurb: "" },
    { slug: "lambo-urus-2",     file: "copy_5BE24F4D-D758-46AE-BB2D-74BB9229B183.mp4", num: "21", title: "Lamborghini Urus II", meta: "Automotive · 0:16", blurb: "" }
  ];

  const grid = document.getElementById("tile-grid");

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

  function wireVideo(video, file, opts) {
    const src = VIDEO_BASE_URL + encodeURIComponent(file);
    video.muted = !!opts.muted;
    video.loop = true;
    video.playsInline = true;
    // Tiles use preload "none" so the page does not download 21 videos up front;
    // a tile's file is only attached when the visitor hovers or focuses it.
    video.preload = opts.lazy ? "none" : "auto";
    if (opts.poster) video.poster = opts.poster;

    video.addEventListener("loadeddata", function onReady() {
      video.classList.add("is-ready");
      if (opts.autoplay) {
        video.play().catch(function () { /* autoplay blocked */ });
      }
      video.removeEventListener("loadeddata", onReady);
    });
    video.addEventListener("error", function onError() {
      video.classList.remove("is-ready");
      video.removeEventListener("error", onError);
    });

    function attach() {
      if (video.getAttribute("src")) return;
      video.src = src;
      video.load();
    }

    if (!opts.lazy) attach();
    return attach;
  }

  function buildTile(item, index) {
    const tile = el("button", "tile", {
      type: "button",
      "aria-label": "Play " + item.title,
      "aria-haspopup": "dialog"
    });
    tile.appendChild(el("div", "tile-texture"));

    const previewVideo = el("video", "tile-video");
    tile.appendChild(previewVideo);
    const attachPreview = wireVideo(previewVideo, item.file, { muted: true, autoplay: false, lazy: true, poster: POSTER_BASE_URL + item.slug + ".jpg" });

    tile.addEventListener("focus", attachPreview);
    tile.addEventListener("mouseenter", function () {
      attachPreview();
      previewVideo.play().catch(function () { /* not ready yet */ });
    });
    tile.addEventListener("mouseleave", function () {
      previewVideo.pause();
      previewVideo.currentTime = 0;
    });

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

    tile.addEventListener("click", function () { openLightbox(index); });

    return tile;
  }

  function render() {
    grid.innerHTML = "";
    WORK.forEach(function (item, index) {
      const cell = el("div", "cell");
      cell.style.setProperty("--span", SPANS[index]);
      cell.appendChild(buildTile(item, index));
      grid.appendChild(cell);
    });
  }

  // ---------- Lightbox ----------
  // One shared dialog. Opens with sound and controls, steps with the
  // previous/next buttons or the arrow keys, closes with Esc, the close
  // button or a click on the dark backdrop. Focus returns to the tile.
  const lightbox = el("div", "lightbox", { role: "dialog", "aria-modal": "true", "aria-label": "Video player", hidden: "" });
  const lbBackdrop = el("div", "lb-backdrop");
  const lbFrame = el("div", "lb-frame");
  const lbVideo = el("video", "lb-video", { controls: "", playsinline: "" });
  lbVideo.loop = true;
  const lbBar = el("div", "lb-bar");
  const lbInfo = el("div", "lb-info");
  const lbTitle = el("div", "lb-title");
  const lbMeta = el("div", "lb-meta");
  lbInfo.appendChild(lbTitle);
  lbInfo.appendChild(lbMeta);
  const lbPrev = el("button", "lb-btn", { type: "button", "aria-label": "Previous video", text: "Prev" });
  const lbNext = el("button", "lb-btn", { type: "button", "aria-label": "Next video", text: "Next" });
  const lbClose = el("button", "lb-btn lb-close", { type: "button", "aria-label": "Close video", text: "Close" });
  lbBar.appendChild(lbInfo);
  lbBar.appendChild(lbPrev);
  lbBar.appendChild(lbNext);
  lbBar.appendChild(lbClose);
  lbFrame.appendChild(lbVideo);
  lbFrame.appendChild(lbBar);
  lightbox.appendChild(lbBackdrop);
  lightbox.appendChild(lbFrame);
  document.body.appendChild(lightbox);

  let current = null;
  let lastFocus = null;

  function show(index) {
    current = (index + WORK.length) % WORK.length;
    const item = WORK[current];
    lbTitle.textContent = item.title;
    lbMeta.textContent = item.meta;
    lbVideo.poster = POSTER_BASE_URL + item.slug + ".jpg";
    lbVideo.muted = false;
    lbVideo.src = VIDEO_BASE_URL + encodeURIComponent(item.file);
    lbVideo.load();
    lbVideo.play().catch(function () { /* the controls are there if autoplay is blocked */ });
    track("video-" + item.slug, item.title);
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add("lb-open");
    show(index);
    lbClose.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lbVideo.pause();
    lbVideo.removeAttribute("src");
    lbVideo.load();
    lightbox.hidden = true;
    document.body.classList.remove("lb-open");
    current = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  lbPrev.addEventListener("click", function () { show(current - 1); });
  lbNext.addEventListener("click", function () { show(current + 1); });
  lbClose.addEventListener("click", closeLightbox);
  lbBackdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft" && document.activeElement !== lbVideo) {
      show(current - 1);
    } else if (event.key === "ArrowRight" && document.activeElement !== lbVideo) {
      show(current + 1);
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog.
      const items = [lbVideo, lbPrev, lbNext, lbClose];
      const i = items.indexOf(document.activeElement);
      event.preventDefault();
      const next = event.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      items[next].focus();
    }
  });

  // ---------- Analytics (GoatCounter: no cookies, no consent banner) ----------
  // Create a free site at goatcounter.com, then put its code here
  // (for example "zafarsinan" for zafarsinan.goatcounter.com).
  const GOATCOUNTER_CODE = "";

  function track(path, title) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: path, title: title, event: true });
    }
  }

  if (GOATCOUNTER_CODE) {
    const gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count");
    document.head.appendChild(gc);
  }

  document.querySelectorAll("[data-track]").forEach(function (node) {
    node.addEventListener("click", function () { track(node.getAttribute("data-track"), node.textContent.trim()); });
  });

  render();

  // Quote form: sends each request to email through FormSubmit (no server
  // needed). The +971 country code is fixed on the page; visitors type only
  // the local number, and we prepend the code before sending.
  const form = document.querySelector(".contact-form");
  if (form) {
    const status = form.querySelector(".contact-status");
    const button = form.querySelector('button[type="submit"]');
    const phone = form.querySelector('input[name="phone"]');

    if (phone) {
      phone.addEventListener("input", function () {
        phone.value = phone.value.replace(/[^0-9 ]/g, "");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const digits = String(data.get("phone") || "").replace(/\D/g, "").replace(/^0+/, "");
      data.set("phone", digits ? "+971 " + digits : "");

      button.disabled = true;
      status.textContent = "Sending...";

      fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (res) {
          return res.json().then(function (body) {
            if (!res.ok || String(body.success) === "false") throw new Error("send failed");
          });
        })
        .then(function () {
          form.reset();
          status.textContent = "Sent. We will reply the same day.";
        })
        .catch(function () {
          status.textContent = "Could not send. Please try again.";
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  }
})();
