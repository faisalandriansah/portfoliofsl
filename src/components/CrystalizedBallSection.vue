<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const mount = ref(null)
const loadError = ref(false)
let reactRoot
let visibilityObserver
let themeObserver
let themeMedia
let ReactRuntime
let CrystalizedBallComponent
let disposed = false

function particleCountForDevice() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const pixels = window.innerWidth * window.innerHeight

  if (cores <= 4 || memory <= 4 || pixels > 5_000_000) return 5000
  if (cores >= 8 && memory >= 8 && pixels < 3_000_000) return 9000
  return 7000
}

function getBallProps() {
  return {
    preset: 'plasma',
    color: '#F25BD0',
    size: 0.7,
    crackle: 0.85,
    fill: 0.5,
    interactive: true,
    hoverStrength: 0.7,
    strands: 6,
    flares: 0.65,
    glow: 0.9,
    sparks: 0.6,
    particleCount: particleCountForDevice(),
    motion: 'rise',
    particleShape: 'square',
    depth: 0.6,
    sway: 0.5,
    twinkle: 0.5,
    haze: 0.7,
    dustSpeed: 1,
    speed: 1,
    intro: true,
    paused: false,
    style: { height: '100%' },
  }
}

function currentTheme() {
  return (
    document.documentElement.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

function renderCrystalizedBall() {
  if (disposed || !reactRoot || !ReactRuntime || !CrystalizedBallComponent) return

  reactRoot.render(
    ReactRuntime.createElement(CrystalizedBallComponent, {
      ...getBallProps(),
      theme: currentTheme(),
    }),
  )
}

async function loadCrystalizedBall() {
  try {
    const [{ default: React }, { createRoot }, { default: CrystalizedBall }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./CrystalizedBall.jsx'),
    ])

    if (disposed) return

    ReactRuntime = React
    CrystalizedBallComponent = CrystalizedBall
    reactRoot = createRoot(mount.value)
    renderCrystalizedBall()
    themeObserver = new MutationObserver(renderCrystalizedBall)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    themeMedia.addEventListener('change', renderCrystalizedBall)
  } catch (error) {
    console.error('Unable to load the CrystalizedBall effect:', error)
    loadError.value = true
  }
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    void loadCrystalizedBall()
    return
  }

  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    visibilityObserver.disconnect()
    void loadCrystalizedBall()
  }, { rootMargin: '400px 0px' })
  visibilityObserver.observe(mount.value)
})

onBeforeUnmount(() => {
  disposed = true
  visibilityObserver?.disconnect()
  themeObserver?.disconnect()
  themeMedia?.removeEventListener('change', renderCrystalizedBall)
  reactRoot?.unmount()
})
</script>

<template>
  <section class="crystalized-section">
    <p class="eyebrow">A spark of creativity</p>
    <div
      ref="mount"
      class="crystalized-stage"
      :class="{ 'crystalized-stage--error': loadError }"
      :role="loadError ? 'alert' : 'img'"
      :aria-label="loadError ? undefined : 'Animated crystal sphere'"
    >
      <p v-if="loadError">The crystal effect could not be loaded.</p>
    </div>
  </section>
</template>

<style scoped>
.crystalized-section {
  padding: 48px 0 72px;
  text-align: center;
}

.crystalized-section .eyebrow {
  margin-bottom: 0;
}

.crystalized-stage {
  position: relative;
  width: 100%;
  height: clamp(360px, 50vw, 600px);
  overflow: hidden;
}

.crystalized-stage--error {
  display: grid;
  place-items: center;
  color: var(--muted);
}

.crystalized-stage p {
  margin: 0;
}

@media (max-width: 640px) {
  .crystalized-section {
    padding: 36px 0 52px;
  }

  .crystalized-stage {
    height: clamp(320px, 100vw, 430px);
  }
}
</style>
