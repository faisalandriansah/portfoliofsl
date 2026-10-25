<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../gsap'
import preloaderImage from '../assets/images/preloader.webp'

const show = ref(true)
const el = ref(null)
const mark = ref(null)
let timeline

onMounted(() => {
  timeline = gsap.timeline({
    onComplete: () => { show.value = false },
  })
  timeline
    .fromTo(mark.value, { autoAlpha: 0, scale: 0.94, y: 16 }, {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to(el.value, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, 1.05)
})

onBeforeUnmount(() => timeline && timeline.kill())
</script>

<template>
  <div v-if="show" id="pre" ref="el" class="preloader" role="status" aria-label="Memuat portofolio">
    <div ref="mark" class="preloader-mark">
      <img
        :src="preloaderImage"
        alt=""
        width="1484"
        height="1060"
        fetchpriority="high"
        draggable="false"
      />
    </div>
  </div>
</template>
