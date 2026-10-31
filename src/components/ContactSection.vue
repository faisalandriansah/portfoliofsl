<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../gsap'
import { animated } from '../motion'
import { runReveal } from '../composables/useReveal'
import { toast, copy } from '../composables/useToast'
import { vMagnetic } from '../directives/magnetic'
import { CONFIG, GITHUB, SPOTIFY } from '../data/config'

const root = ref(null)
const open = ref(false)
const embedLoaded = ref(false)
const meta = ref({ title: SPOTIFY.title || '', cover: SPOTIFY.cover || '' })
let ctx
let abort

const wa = CONFIG.wa ? 'https://wa.me/' + CONFIG.wa.replace(/\D/g, '') : ''

const spotifyId = computed(() => {
  const m = String(SPOTIFY.url || '').match(/playlist\/([A-Za-z0-9]+)/)
  return m ? m[1] : ''
})

const spotifyEmbed = computed(() =>
  spotifyId.value
    ? `https://open.spotify.com/embed/playlist/${spotifyId.value}?utm_source=generator&theme=0`
    : ''
)

function toggleEmbed() {
  open.value = !open.value
  if (!open.value) embedLoaded.value = false
}

async function loadMeta() {
  abort = new AbortController()
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(SPOTIFY.url)}`,
      { signal: abort.signal }
    )
    if (!res.ok) return
    const data = await res.json()
    meta.value = {
      title: data.title || meta.value.title,
      cover: data.thumbnail_url || meta.value.cover,
    }
  } catch (e) {}
}

// value kosong => tampil redup "belum diisi"; url ada => link; selain itu => tombol salin
const links = computed(() => [
  { label: 'Salin email', value: CONFIG.email, url: '' },
  { label: 'WhatsApp', value: CONFIG.wa, url: wa },
  { label: 'LinkedIn', value: CONFIG.linkedin, url: CONFIG.linkedin },
  { label: 'Unduh CV', value: CONFIG.cv, url: CONFIG.cv },
  { label: 'GitHub', value: GITHUB, url: GITHUB },
])

onMounted(() => {
  if (animated) ctx = gsap.context(() => runReveal(root.value), root.value)
  loadMeta()
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
  if (abort) abort.abort()
})
</script>

<template>
  <section id="kontak" ref="root" class="cta">
    <p class="eyebrow reveal"><b>06</b>Contact</p>
    <a v-magnetic class="big d mag" :href="GITHUB" target="_blank" rel="noopener">Let's build<br><em>something great</em> ↗</a>

    <div class="clinks reveal">
      <template v-for="l in links" :key="l.label">
        <a v-if="l.url" class="cl" :href="l.url" target="_blank" rel="noopener">{{ l.label }} ↗</a>
        <button v-else-if="!l.value" class="cl todo" title="Belum diisi" @click="toast(l.label + ' belum diisi')">{{ l.label }}</button>
        <button v-else class="cl" @click="copy(l.value)">{{ l.label }}</button>
      </template>
    </div>

    <div v-if="spotifyEmbed" class="sound reveal">
      <div
        class="sound-card"
        :class="{ open, loaded: embedLoaded }"
        :style="{ '--sp-h': SPOTIFY.previewHeight + 'px' }"
      >
        <div class="sound-intro">
          <img
            v-if="meta.cover"
            class="sound-cover"
            :src="meta.cover"
            :alt="'Sampul playlist ' + (meta.title || SPOTIFY.label)"
            width="72"
            height="72"
            loading="lazy"
            decoding="async"
            @error="meta.cover = ''"
          />
          <span class="sound-eyebrow">{{ SPOTIFY.label }}</span>
          <b v-if="meta.title" class="sound-title">{{ meta.title }}</b>

          <div class="sound-actions">
            <a class="sound-primary" :href="SPOTIFY.url" target="_blank" rel="noopener">
              Buka playlist ↗
            </a>
            <button
              class="sound-play"
              type="button"
              :aria-expanded="open"
              aria-controls="spotify-player"
              @click="toggleEmbed"
            >
              {{ open ? 'Tutup' : 'Preview' }}
            </button>
          </div>
        </div>

        <div id="spotify-player" class="sound-player">
          <div class="sound-player-in">
            <div class="sound-skel" :class="{ done: embedLoaded }" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <iframe
              v-if="open"
              :src="spotifyEmbed"
              :height="SPOTIFY.previewHeight"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Playlist favorit Achmad Faisal di Spotify"
              @load="embedLoaded = true"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
