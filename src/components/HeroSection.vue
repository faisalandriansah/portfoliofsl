<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "../gsap";
import { animated } from "../motion";
import { runReveal } from "../composables/useReveal";
import { vMagnetic } from "../directives/magnetic";
import { heroMeta } from "../data/portfolio";
import { GITHUB } from "../data/config";

const root = ref(null);
const ditherMount = ref(null);
const wm = ref(null);
const wmWrap = ref(null);
const wmFit = ref(null);
const script = ref(null);
const clock = ref("Lumajang, ID");
const groups = ["port", "folio"].map((word) => word.split(""));
let ctx,
  timer,
  ro,
  refit,
  ditherRoot,
  themeObserver,
  themeMedia,
  renderDither,
  ditherLoading = false,
  disposed = false;

function ditherProps(React, DitherVeil) {
  const theme = getComputedStyle(document.documentElement);
  return React.createElement(DitherVeil, {
    src: "https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=72&w=1000&auto=format&fit=crop",
    pattern: "floyd",
    zoom: 1.15,
    pixelSize: window.innerWidth <= 640 ? 3 : 2,
    inkColor: theme.getPropertyValue("--bg").trim(),
    paperColor: theme.getPropertyValue("--fg").trim(),
    revealRadius: 200,
    softness: 0.6,
    linger: 1,
    fit: "contain",
    rimColor: "#a78bfa",
    palette: "duotone",
    levels: 2,
    contrast: 1.15,
    brightness: 0,
    rim: 0,
    reverse: false,
    wander: false,
    clickBurst: true,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0.65,
      transform: "translateY(-2%)",
    },
  });
}

function mountDither() {
  if (ditherRoot || ditherLoading || disposed) return;
  ditherLoading = true;

  void Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./DitherVeil.jsx"),
  ])
    .then(([{ default: React }, { createRoot }, { default: DitherVeil }]) => {
      if (disposed) return;

      ditherRoot = createRoot(ditherMount.value);
      renderDither = () =>
        ditherRoot?.render(ditherProps(React, DitherVeil));
      renderDither();
      themeObserver = new MutationObserver(renderDither);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
      themeMedia.addEventListener("change", renderDither);
      window.addEventListener("resize", renderDither);

      if (animated) {
        gsap.to(ditherMount.value, {
          opacity: 1,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
        });
      } else {
        gsap.set(ditherMount.value, { opacity: 1 });
      }
    })
    .catch((error) => {
      console.error("Unable to load the hero DitherVeil:", error);
    });
}

function tick() {
  const t = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });
  clock.value = `Lumajang, ID · ${t} WIB`;
}

// Ukur lebar kata lalu skala font agar wordmark selalu full-bleed.
function fitWordmark() {
  const el = wm.value;
  const wrap = wmWrap.value;
  const fit = wmFit.value;
  if (!el || !wrap || !fit) return;

  const size = parseFloat(getComputedStyle(el).fontSize);
  const avail = wrap.clientWidth * 0.76;
  if (!avail || !size) return;

  const stacked = window.matchMedia("(max-width: 640px)").matches;
  let width = 0;

  if (stacked) {
    fit.querySelectorAll(".hero-wm-group").forEach((group) => {
      width = Math.max(width, group.getBoundingClientRect().width);
    });
  } else {
    width = fit.getBoundingClientRect().width;
  }
  if (!width) return;

  const next = (size * avail) / width;
  if (Math.abs(next - size) > 0.5) el.style.fontSize = `${next}px`;
}

onMounted(async () => {
  tick();
  timer = setInterval(tick, 15000);

  await nextTick();
  fitWordmark();

  refit = () => {
    if (!disposed) fitWordmark();
  };
  if (document.fonts) {
    document.fonts.ready.then(refit);
    document.fonts.addEventListener("loadingdone", refit);
  }
  window.addEventListener("load", refit);
  window.addEventListener("resize", refit);
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(refit);
    wmWrap.value && ro.observe(wmWrap.value);
    wmFit.value && ro.observe(wmFit.value);
  }

  if (!animated) {
    mountDither();
    return;
  }

  gsap.set(script.value, {
    clipPath: "inset(-0.2em 100% -0.4em -0.02em)",
    opacity: 0,
    willChange: "clip-path, opacity",
  });

  await Promise.race([
    Promise.all([
      document.fonts?.load('900 1em "Inter"'),
      document.fonts?.load('400 1em "Italianno"'),
    ]),
    new Promise((resolve) => setTimeout(resolve, 1600)),
  ]).catch(() => {});
  if (disposed) return;

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 1.7 });

    tl.from("#hero-wm .w", {
      yPercent: 115,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.045,
    });

    tl.call(mountDither, [], ">");

    tl.to(
      script.value,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.55",
    );

    tl.to(
      script.value,
      {
        clipPath: "inset(-0.2em -0.2em -0.4em -0.02em)",
        duration: 1.15,
        ease: "power2.inOut",
        onComplete: () =>
          gsap.set(script.value, {
            clearProps: "clipPath,willChange,opacity",
          }),
      },
      "<",
    );

    gsap.to(wmWrap.value, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: root.value,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    runReveal(root.value);
  }, root.value);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  disposed = true;
  themeObserver && themeObserver.disconnect();
  themeMedia && themeMedia.removeEventListener("change", renderDither);
  window.removeEventListener("resize", renderDither);
  ditherRoot && ditherRoot.unmount();
  ro && ro.disconnect();
  window.removeEventListener("load", refit);
  window.removeEventListener("resize", refit);
  document.fonts?.removeEventListener("loadingdone", refit);
  ctx && ctx.revert();
});
</script>

<template>
  <header ref="root" class="hero">
    <div class="wrap">
      <div class="hero-top reveal">
        <span>faisalandrsh_</span>
        <a href="#tentang" aria-label="Gulir ke bagian tentang">
          <span>{{ clock }}</span>
          <i aria-hidden="true">→</i>
        </a>
      </div>

      <div ref="wmWrap" class="hero-poster">
        <div ref="ditherMount" class="hero-dither" aria-hidden="true"></div>
        <div class="hero-poster-inner">
          <h1
            id="hero-wm"
            ref="wm"
            class="hero-wordmark"
            aria-label="Achmad Faisal — Portofolio — Full Stack Developer"
          >
            <span ref="wmFit" class="hero-wm-fit" aria-hidden="true">
              <span class="hero-wm-mask">
                <span
                  v-for="(group, gi) in groups"
                  :key="gi"
                  class="hero-wm-group"
                  ><span v-for="(c, i) in group" :key="i" class="w">{{
                    c
                  }}</span></span
                >
              </span>
            </span>
          </h1>

          <span ref="script" class="hero-script" aria-hidden="true">
            Achmad Faisal
            <svg viewBox="0 0 400 30" preserveAspectRatio="none">
              <path
                d="M2 15 C60 5 120 23 190 13 S310 6 372 15 C392 18 388 26 372 24"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="hero-bottom">
        <div class="hero-info reveal">
          <p class="hero-role">{{ heroMeta.role }}</p>
          <p class="hero-note">I turn ideas into things that matter.</p>
        </div>

        <div class="hero-actions reveal">
          <span class="hero-status"
            ><i aria-hidden="true"></i>{{ heroMeta.status }}</span
          >
          <div class="btns">
            <a v-magnetic class="btn pri mag" href="#proyek">Explore My Work</a>
            <a
              v-magnetic
              class="btn mag"
              :href="GITHUB"
              target="_blank"
              rel="noopener"
              >GitHub ↗</a
            >
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
