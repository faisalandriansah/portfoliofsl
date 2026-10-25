<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navLinks } from '../data/portfolio'
import { openPalette } from '../composables/usePalette'

const hidden = ref(true)
let io

onMounted(() => {
  const hero = document.querySelector('.hero')
  if (!hero || typeof IntersectionObserver === 'undefined') {
    hidden.value = false
    return
  }

  io = new IntersectionObserver(
    ([entry]) => { hidden.value = entry.isIntersecting },
    { threshold: 0 },
  )
  io.observe(hero)
})

onBeforeUnmount(() => io && io.disconnect())
</script>

<template>
  <nav aria-label="Navigasi utama" :class="{ 'nav--hidden': hidden }" :inert="hidden ? true : null">
    <a v-for="l in navLinks" :key="l.href" :href="l.href">{{ l.label }}</a>
    <button id="kb" aria-label="Perintah cepat" @click="openPalette">⌘K</button>
  </nav>
</template>
