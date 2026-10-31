<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { paletteOpen, openPalette, closePalette } from '../composables/usePalette'
import { scrollToTarget } from '../composables/useLenis'
import { toggleTheme } from '../composables/useTheme'
import { copy } from '../composables/useToast'
import { CONFIG, GITHUB } from '../data/config'

const q = ref('')
const sel = ref(0)
const input = ref(null)

const wa = CONFIG.wa ? 'https://wa.me/' + CONFIG.wa.replace(/\D/g, '') : ''

const commands = [
  { t: 'Go to About', k: 'Navigation', f: () => scrollToTarget('#tentang') },
  { t: 'Go to Projects', k: 'Navigation', f: () => scrollToTarget('#proyek') },
  { t: 'Go to Journey', k: 'Navigation', f: () => scrollToTarget('#jejak') },
  { t: 'Go to Gallery', k: 'Navigation', f: () => scrollToTarget('#galeri') },
  { t: 'Go to Contact', k: 'Navigation', f: () => scrollToTarget('#kontak') },
  { t: 'Change Theme', k: 'Appearance', f: toggleTheme },
  { t: 'Open GitHub', k: 'Link', f: () => open(GITHUB, '_blank') },
]
if (CONFIG.email) commands.push({ t: 'Copy the email', k: 'Contact', f: () => copy(CONFIG.email) })
if (CONFIG.wa) commands.push({ t: 'Chat WhatsApp', k: 'Contact', f: () => open(wa, '_blank') })
if (CONFIG.linkedin) commands.push({ t: 'Open LinkedIn', k: 'Link', f: () => open(CONFIG.linkedin, '_blank') })
if (CONFIG.cv) commands.push({ t: 'Download CV', k: 'Link', f: () => open(CONFIG.cv, '_blank') })

const filtered = computed(() => {
  const s = q.value.toLowerCase()
  return commands.filter((c) => c.t.toLowerCase().includes(s))
})

watch(q, () => { sel.value = 0 })
watch(paletteOpen, (v) => {
  if (!v) return
  q.value = ''
  sel.value = 0
  nextTick(() => setTimeout(() => input.value && input.value.focus(), 30))
})

function run(c) {
  closePalette()
  c.f()
}

function onKey(e) {
  if (e.key === 'ArrowDown') {
    sel.value = Math.min(sel.value + 1, filtered.value.length - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    sel.value = Math.max(sel.value - 1, 0)
    e.preventDefault()
  } else if (e.key === 'Enter' && filtered.value[sel.value]) {
    run(filtered.value[sel.value])
  }
}

// Ctrl/Cmd+K buka-tutup, Esc tutup
function onGlobalKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value ? closePalette() : openPalette()
  } else if (e.key === 'Escape') {
    closePalette()
  }
}
onMounted(() => addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <div id="pal" :class="{ on: paletteOpen }" @click.self="closePalette">
    <div class="pbox">
      <input
        id="pq"
        ref="input"
        v-model="q"
        placeholder="Type the command…  (Press Esc to close)"
        autocomplete="off"
        @keydown="onKey"
      >
      <div class="pl" data-lenis-prevent>
        <div v-for="(c, i) in filtered" :key="c.t" class="pi" :class="{ on: i === sel }" @click="run(c)">
          <span>{{ c.t }}</span><small>{{ c.k }}</small>
        </div>
      </div>
    </div>
  </div>
</template>
