<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  bend: { type: Number, default: 3 },
  textColor: { type: String, default: '' },
  borderRadius: { type: Number, default: 0.05 },
  font: { type: String, default: '600 24px Bricolage Grotesque' },
  scrollSpeed: { type: Number, default: 2 },
  scrollEase: { type: Number, default: 0.05 },
  itemSize: { type: Number, default: 1 },
  itemAspect: { type: Number, default: 0.78 },
  gap: { type: Number, default: 0.26 },
  wave: { type: Number, default: 1 },
  fadeEdges: { type: Number, default: 0.12 },
  shadow: { type: Number, default: 0.25 },
  grayscale: { type: Boolean, default: false },
  showTitles: { type: Boolean, default: true },
  snap: { type: Boolean, default: true },
  autoScroll: { type: Number, default: 0 },
  openOnClick: { type: Boolean, default: true },
  intro: { type: Boolean, default: true },
})

const emit = defineEmits(['item-click'])
const mount = ref(null)
const loadError = ref(false)
const galleryReady = ref(false)
let reactRoot
let themeObserver
let visibilityObserver
let GalleryComponent
let disposed = false

function componentProps() {
  return {
    ...props,
    textColor: getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#ffffff',
    onItemClick: (item, index) => emit('item-click', { item, index }),
    style: { height: '100%' },
  }
}

function syncTheme() {
  if (!disposed && reactRoot && GalleryComponent) {
    import('react').then(({ default: React }) => {
      if (!disposed) reactRoot.render(React.createElement(GalleryComponent, componentProps()))
    }).catch((error) => {
      console.error('Unable to update certificate gallery theme:', error)
      loadError.value = true
    })
  }
}

async function loadGallery() {
  try {
    const [{ default: React }, { createRoot }, { default: CircularGallery }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./CircularGallery.jsx'),
    ])

    if (disposed) return

    GalleryComponent = CircularGallery
    reactRoot = createRoot(mount.value)
    reactRoot.render(React.createElement(CircularGallery, componentProps()))
    galleryReady.value = true
    themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  } catch (error) {
    console.error('Unable to load the certificate gallery:', error)
    loadError.value = true
  }
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    void loadGallery()
    return
  }

  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    visibilityObserver.disconnect()
    void loadGallery()
  }, { rootMargin: '400px 0px' })
  visibilityObserver.observe(mount.value)
})

onBeforeUnmount(() => {
  disposed = true
  visibilityObserver?.disconnect()
  themeObserver?.disconnect()
  reactRoot?.unmount()
})
</script>

<template>
  <div
    ref="mount"
    class="circular-gallery-host"
    :class="{ 'circular-gallery-host--error': loadError, 'circular-gallery-host--ready': galleryReady }"
    :role="loadError ? 'alert' : undefined"
  >
    <p v-if="loadError">The certificate gallery could not be loaded.</p>
  </div>
</template>

<style scoped>
.circular-gallery-host {
  position: relative;
  width: 100%;
  height: clamp(390px, 50vw, 600px);
  overflow: hidden;
  contain: inline-size;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.circular-gallery-host--ready,
.circular-gallery-host--error {
  opacity: 1;
}

.circular-gallery-host--error {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  color: var(--muted);
}

.circular-gallery-host p {
  margin: 0;
  padding: 24px;
}

@media (max-width: 640px) {
  .circular-gallery-host {
    height: clamp(340px, 105vw, 430px);
  }
}
</style>
