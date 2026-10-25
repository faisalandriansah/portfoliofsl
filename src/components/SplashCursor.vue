<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { animated, finePointer } from '../motion'

const mount = ref(null)

let reactRoot
let themeObserver
let themeMedia
let renderCursor
let disposed = false
let resizeTimer
let quality = 'medium'

function currentTheme() {
  return (
    document.documentElement.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

function currentQuality() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const pixels = window.innerWidth * window.innerHeight

  if (cores <= 4 || memory <= 4 || pixels > 5_000_000) return 'low'
  if (cores >= 8 && memory >= 8 && pixels < 3_000_000) return 'high'
  return 'medium'
}

function currentMaxDpr() {
  if (quality === 'low') return 1
  if (quality === 'medium') return 1.25
  return 1.5
}

function updateQuality() {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const nextQuality = currentQuality()
    if (nextQuality === quality || disposed) return
    quality = nextQuality
    renderCursor?.()
  }, 180)
}

function mountSplashCursor() {
  if (!finePointer || !animated) return

  void Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./SplashCursor.jsx'),
  ])
    .then(([{ default: React }, { createRoot }, { default: SplashCursor }]) => {
      if (disposed) return

      reactRoot = createRoot(mount.value)
      quality = currentQuality()
      renderCursor = () =>
        reactRoot?.render(
          React.createElement(SplashCursor, {
            rainbow: false,
            size: 1,
            force: 1,
            swirl: 3,
            trail: 1,
            clickSplash: true,
            colorSpeed: 1,
            intensity: 1,
            momentum: 1,
            shading: 1,
            glow: 0,
            quality,
            maxDpr: currentMaxDpr(),
            intro: true,
            contained: false,
            theme: currentTheme(),
            zIndex: 40,
          }),
        )

      renderCursor()
      themeObserver = new MutationObserver(renderCursor)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })
      themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
      themeMedia.addEventListener('change', renderCursor)
      window.addEventListener('resize', updateQuality)
    })
    .catch((error) => {
      console.error('Unable to load the SplashCursor effect:', error)
    })
}

function onFirstPointerMove() {
  window.removeEventListener('pointermove', onFirstPointerMove)
  mountSplashCursor()
}

onMounted(() => {
  if (finePointer && animated) window.addEventListener('pointermove', onFirstPointerMove, { once: true, passive: true })
})

onBeforeUnmount(() => {
  disposed = true
  window.removeEventListener('pointermove', onFirstPointerMove)
  themeObserver?.disconnect()
  themeMedia?.removeEventListener('change', renderCursor)
  window.removeEventListener('resize', updateQuality)
  window.clearTimeout(resizeTimer)
  reactRoot?.unmount()
})
</script>

<template>
  <div ref="mount" class="splash-cursor-host" aria-hidden="true"></div>
</template>
