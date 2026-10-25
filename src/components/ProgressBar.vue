<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../gsap'
import { animated } from '../motion'

const bar = ref(null)
let ctx

onMounted(() => {
  if (!animated) return
  ctx = gsap.context(() => {
    gsap.to(bar.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { scrub: 0.3, start: 0, end: 'max' },
    })
  })
})
onBeforeUnmount(() => ctx && ctx.revert())
</script>

<template>
  <div id="bar" ref="bar"></div>
</template>
