<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../gsap'
import { animated } from '../motion'
import { runReveal } from '../composables/useReveal'
import { timeline } from '../data/portfolio'

const root = ref(null)
let ctx

onMounted(() => {
  if (!animated) return
  ctx = gsap.context(() => {
    runReveal(root.value)
    gsap.to('#tli', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: true },
    })
  }, root.value)
})
onBeforeUnmount(() => ctx && ctx.revert())
</script>

<template>
  <section id="jejak" ref="root">
    <p class="eyebrow reveal"><b>03</b>Journey</p>
    <h2 class="d reveal">The Journey.</h2>
    <div class="tl">
      <i id="tli"></i>
      <div v-for="t in timeline" :key="t.title" class="item reveal">
        <small>{{ t.date }}</small>
        <h3 class="d">{{ t.title }}</h3>
        <strong class="item-org">{{ t.organization }}</strong>
        <p>{{ t.desc }}</p>
      </div>
    </div>
  </section>
</template>
