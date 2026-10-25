<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "../gsap";
import { animated } from "../motion";
import { runReveal } from "../composables/useReveal";
import RingedPlanet from "./RingedPlanet.vue";

const root = ref(null);
const planetReady = ref(false);
let ctx;
let visibilityObserver;

onMounted(() => {
  if (animated) ctx = gsap.context(() => runReveal(root.value), root.value);

  if (typeof IntersectionObserver === "undefined") {
    planetReady.value = true;
    return;
  }

  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    planetReady.value = true;
    visibilityObserver.disconnect();
  }, { rootMargin: "450px 0px" });
  visibilityObserver.observe(root.value);
});

onBeforeUnmount(() => {
  visibilityObserver?.disconnect();
  ctx && ctx.revert();
});
</script>

<template>
  <div id="orbit" ref="root" class="orbit" aria-hidden="true">
    <div class="orbit-stage reveal">
      <RingedPlanet
        v-if="planetReady"
        height="clamp(400px, 50vh, 540px)"
        :planet-dots="1800"
        :ring-particles="1500"
        :speed="0.85"
        label="faisalandrsh_"
      />
    </div>
  </div>
</template>
