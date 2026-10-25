<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { techLogos } from '../data/techLogos'

const root = ref(null)
const viewport = ref(null)
const track = ref(null)
const list = ref(null)
const reducedMotion = ref(false)
const dragging = ref(false)
const hovering = ref(false)
const names = techLogos.map((logo) => logo.name)

let resizeObserver
let intersectionObserver
let motionQuery
let frameId = 0
let lastFrame = 0
let offset = 0
let period = 0
let velocity = 0
let pointerId = null
let lastPointerX = 0
let dragStartX = 0
let lastPointerTime = 0
let dragMoved = false
let suppressClickUntil = 0
let inViewport = false

function wrapOffset(value) {
  if (!period) return value
  return ((value % period) + period) % period - period
}

function render() {
  if (track.value) {
    track.value.style.transform = `translate3d(${offset}px, 0, 0)`
  }
}

function updatePeriod() {
  const firstList = Array.isArray(list.value) ? list.value[0] : list.value
  if (!firstList) return
  const nextPeriod = firstList.getBoundingClientRect().width
  if (!nextPeriod) return
  period = nextPeriod
  offset = wrapOffset(offset)
  render()
}

function animate(now) {
  frameId = 0
  const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
  lastFrame = now

  if (!dragging.value && dt > 0) {
    const targetVelocity =
      reducedMotion.value || hovering.value ? 0 : -75
    const response = 1 - Math.exp(-dt / 0.55)
    velocity += (targetVelocity - velocity) * response
    offset = wrapOffset(offset + velocity * dt)
    render()
  }

  if (
    !dragging.value &&
    (reducedMotion.value || hovering.value) &&
    Math.abs(velocity) < 0.1
  ) {
    velocity = 0
    return
  }
  frameId = requestAnimationFrame(animate)
}

function startAnimation() {
  if (frameId || reducedMotion.value || dragging.value || !inViewport) return
  lastFrame = 0
  frameId = requestAnimationFrame(animate)
}

function stopAnimation() {
  if (!frameId) return
  cancelAnimationFrame(frameId)
  frameId = 0
  lastFrame = 0
}

function updateMotionPreference(event) {
  reducedMotion.value = event.matches
  if (event.matches && !dragging.value) stopAnimation()
  else startAnimation()
}

function onPointerDown(event) {
  if (event.button !== 0 || !period) return
  dragging.value = true
  dragMoved = false
  pointerId = event.pointerId
  lastPointerX = event.clientX
  dragStartX = event.clientX
  lastPointerTime = performance.now()
  velocity = 0
  stopAnimation()
  viewport.value?.setPointerCapture(event.pointerId)
}

function onPointerEnter() {
  hovering.value = true
  startAnimation()
}

function onPointerLeave() {
  hovering.value = false
  startAnimation()
}

function onPointerMove(event) {
  if (!dragging.value || event.pointerId !== pointerId) return
  const now = performance.now()
  const delta = event.clientX - lastPointerX
  const elapsed = Math.max((now - lastPointerTime) / 1000, 0.001)

  if (Math.abs(delta) > 0) {
    offset = wrapOffset(offset + delta)
    velocity = Math.max(-1800, Math.min(1800, delta / elapsed))
    dragMoved = Math.abs(event.clientX - dragStartX) > 6
    lastPointerX = event.clientX
    lastPointerTime = now
    render()
  }
}

function onPointerUp(event) {
  if (!dragging.value || event.pointerId !== pointerId) return
  dragging.value = false
  pointerId = null
  if (viewport.value?.hasPointerCapture(event.pointerId)) {
    viewport.value.releasePointerCapture(event.pointerId)
  }
  if (dragMoved) suppressClickUntil = performance.now() + 250
  startAnimation()
}

function onClickCapture(event) {
  if (performance.now() >= suppressClickUntil) return
  event.preventDefault()
  event.stopPropagation()
  suppressClickUntil = 0
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', updateMotionPreference)

  updatePeriod()
  resizeObserver = new ResizeObserver(updatePeriod)
  if (root.value) resizeObserver.observe(root.value)
  const firstList = Array.isArray(list.value) ? list.value[0] : list.value
  if (firstList) resizeObserver.observe(firstList)
  if (typeof IntersectionObserver === 'undefined') {
    inViewport = true
    startAnimation()
  } else {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      if (inViewport) startAnimation()
      else stopAnimation()
    })
    if (root.value) intersectionObserver.observe(root.value)
  }
})

onBeforeUnmount(() => {
  stopAnimation()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', updateMotionPreference)
})
</script>

<template>
  <div
    ref="root"
    class="mq"
    :class="{ 'mq--dragging': dragging }"
    @click.capture="onClickCapture"
  >
    <p class="mq-sr">Teknologi yang saya gunakan: {{ names.join(', ') }}</p>

    <div
      ref="viewport"
      class="mq-viewport"
      aria-hidden="true"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <div ref="track" class="mq-track">
        <ul
          v-for="copy in 2"
          :key="copy"
          ref="list"
          class="mq-list"
          :class="{ 'mq-list--duplicate': copy > 1 }"
        >
          <li
            v-for="logo in techLogos"
            :key="`${copy}-${logo.name}`"
            class="mq-item"
            :style="{ '--logo-color': logo.color }"
          >
            <span class="mq-content">
              <span class="mq-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" role="presentation">
                  <path :d="logo.d" />
                </svg>
              </span>
              <span class="mq-label">{{ logo.name }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
