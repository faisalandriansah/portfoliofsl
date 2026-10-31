<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navLinks } from '../data/portfolio'
import { openPalette } from '../composables/usePalette'

const hidden = ref(true)
const menuOpen = ref(false)
let io

function closeMenu() {
  menuOpen.value = false
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
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

onBeforeUnmount(() => {
  io && io.disconnect()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <nav
    aria-label="Navigasi utama"
    :class="{ 'nav--hidden': hidden, 'nav--open': menuOpen }"
    :inert="hidden ? true : null"
  >
    <button
      class="nav-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      aria-label="Buka menu navigasi"
      @click="menuOpen = !menuOpen"
    >
      <span></span><span></span>
    </button>
    <div id="primary-navigation" class="nav-links">
      <a v-for="l in navLinks" :key="l.href" :href="l.href" @click="closeMenu">{{ l.label }}</a>
      <button id="kb" aria-label="Perintah cepat" @click="openPalette">⌘K</button>
    </div>
  </nav>
</template>
