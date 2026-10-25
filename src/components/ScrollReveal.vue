<script setup>
import { Comment, computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { gsap, ScrollTrigger } from '../gsap'
import { animated } from '../motion'
import './ScrollReveal.css'

const props = defineProps({
  text: { type: String, default: null },
  tag: { type: String, default: 'h2' },
  enableBlur: { type: Boolean, default: true },
  baseOpacity: { type: Number, default: 0.1 },
  baseRotation: { type: Number, default: 3 },
  blurStrength: { type: Number, default: 4 },
  baseOffset: { type: Number, default: 0 },
  stagger: { type: Number, default: 0.05 },
  smoothing: { type: Number, default: 0 },
  splitBy: { type: String, default: 'words' },
  effect: { type: String, default: 'fade' },
  mode: { type: String, default: 'scrub' },
  duration: { type: Number, default: 0.8 },
  highlightColor: { type: String, default: '' },
  containerClassName: { type: String, default: '' },
  textClassName: { type: String, default: '' },
  rotationEnd: { type: String, default: 'bottom bottom' },
  wordAnimationEnd: { type: String, default: 'bottom bottom' },
})

const SCRUB_SPAN = 0.5
const RISE_MASK = 'inset(-1em -1em -0.15em -1em)'

const clampToScroll = (position) =>
  typeof position === 'string' && !position.startsWith('clamp(') ? `clamp(${position})` : position

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)
const smooth = (value) => value * value * (3 - 2 * value)
const easeOut = (value) => 1 - Math.pow(1 - value, 3)
const easeBack = (value, overshoot) => {
  const shifted = value - 1
  return 1 + (overshoot + 1) * shifted * shifted * shifted + overshoot * shifted * shifted
}
const glowAt = (t) =>
  t <= 0 || t >= 1 ? 0 : t < 0.35 ? smooth(t / 0.35) : 1 - smooth((t - 0.35) / 0.65)

function paintPiece(piece, t, look) {
  let reveal = t
  let fadeIn = t
  let motion = ''
  if (look.effect === 'rise') {
    reveal = easeOut(t)
    fadeIn = clamp01(reveal * 1.25)
    if (reveal < 1) {
      motion = look.masked
        ? `translateY(${((1 - reveal) * 100).toFixed(2)}%) translateY(${((1 - reveal) * 0.2).toFixed(3)}em)`
        : `translateY(${((1 - reveal) * 0.8).toFixed(3)}em)`
    }
  } else if (look.effect === 'flip') {
    reveal = easeBack(t, 1.2)
    fadeIn = clamp01(t * 2)
    if (t < 1) motion = `perspective(6em) rotateX(${((1 - reveal) * 90).toFixed(2)}deg)`
  } else if (look.effect === 'scale') {
    reveal = easeBack(t, 1.6)
    fadeIn = clamp01(t * 1.6)
    if (t < 1) motion = `scale(${(0.35 + 0.65 * reveal).toFixed(4)})`
  }
  if (look.highlightColor) fadeIn = Math.max(fadeIn, clamp01(t / 0.35))
  const settle = clamp01(reveal)
  const lift = look.offset * (1 - settle)
  piece.style.opacity = t >= 1 ? '' : (look.baseOpacity + (1 - look.baseOpacity) * fadeIn).toFixed(3)
  piece.style.transform = [lift ? `translateY(${lift.toFixed(2)}px)` : '', motion]
    .filter(Boolean)
    .join(' ')
  piece.style.filter =
    look.blur && settle < 1 ? `blur(${(look.blur * (1 - settle)).toFixed(2)}px)` : ''
  if (look.highlightColor) {
    const glow = glowAt(t)
    piece.style.color =
      glow > 0.002
        ? `color-mix(in srgb, ${look.highlightColor} ${(glow * 100).toFixed(1)}%, currentColor)`
        : ''
  }
}

function slotText(slots) {
  if (!slots.default) return null
  const nodes = slots.default().filter((node) => node.type !== Comment)
  if (!nodes.length) return null
  const out = []
  for (const node of nodes) {
    if (typeof node.children === 'string') out.push(node.children)
    else if (typeof node.children === 'number') out.push(String(node.children))
    else return null
  }
  return out.join('')
}

const slots = useSlots()
const containerRef = ref(null)
const textRef = ref(null)

const rawText = computed(() => props.text ?? slotText(slots))

const chunks = computed(() => {
  const value = rawText.value
  if (value == null) return null
  return value.split(/(\s+)/).map((part, index) => {
    if (part.trim() === '') return { key: index, space: part }
    return { key: index, word: part, chars: Array.from(part) }
  })
})

const initialPieceStyle = animated ? { opacity: String(props.baseOpacity) } : null

let mm = null

function resetStyles(el) {
  if (!el) return
  el.querySelectorAll('.scroll-reveal-piece, .scroll-reveal-text').forEach((node) => {
    node.style.opacity = ''
    node.style.transform = ''
    node.style.transformOrigin = ''
    node.style.filter = ''
    node.style.color = ''
    node.style.willChange = ''
  })
  el.querySelectorAll('.scroll-reveal-word').forEach((node) => {
    node.style.clipPath = ''
  })
}

function build() {
  const el = containerRef.value
  const textEl = textRef.value
  if (!el || !textEl) return

  const wrappers = Array.from(el.querySelectorAll('.scroll-reveal-word'))
  const pieces = wrappers.length ? Array.from(el.querySelectorAll('.scroll-reveal-piece')) : [textEl]
  const viewportHeight = () => window.innerHeight
  const scrub = props.smoothing > 0 ? props.smoothing : true
  const span = props.mode === 'enter' ? Math.max(0.05, props.duration) : SCRUB_SPAN
  const gap = Math.max(0, props.stagger)
  const look = {
    effect: props.effect,
    masked: props.effect === 'rise' && wrappers.length > 0,
    baseOpacity: props.baseOpacity,
    blur: props.enableBlur ? props.blurStrength : 0,
    offset: props.baseOffset,
    highlightColor: props.highlightColor,
  }

  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const order = pieces.map((_, index) => index)
    const last = pieces.map(() => -1)
    const state = { p: 0 }
    let count = pieces.length

    const measure = () => {
      if (props.splitBy !== 'lines' || !wrappers.length) return
      let line = -1
      let top = -Infinity
      wrappers.forEach((wrapper, index) => {
        const next = wrapper.offsetTop
        if (Math.abs(next - top) > 2) {
          line += 1
          top = next
        }
        order[index] = line
      })
      count = line + 1
    }

    const total = () => span + Math.max(0, count - 1) * gap

    const render = () => {
      const at = state.p * total()
      pieces.forEach((piece, index) => {
        const t = clamp01((at - order[index] * gap) / span)
        if (t === last[index]) return
        last[index] = t
        paintPiece(piece, t, look)
      })
    }

    measure()
    pieces.forEach((piece) => {
      piece.style.willChange =
        pieces.length > 80 ? '' : props.effect === 'fade' && !props.baseOffset ? 'opacity' : 'opacity, transform'
      piece.style.transformOrigin = props.effect === 'flip' ? '50% 100%' : ''
    })
    if (look.masked) {
      wrappers.forEach((wrapper) => {
        wrapper.style.clipPath = RISE_MASK
      })
    }
    render()

    if (props.mode === 'enter') {
      let played = false
      const play = () => {
        if (played) return
        played = true
        gsap.to(state, { p: 1, duration: total(), ease: 'none', onUpdate: render })
        if (props.baseRotation) {
          gsap.to(el, { rotate: 0, duration: Math.min(total(), 1.4), ease: 'power3.out' })
        }
      }
      const startAt = () => {
        const view = viewportHeight()
        const top = el.getBoundingClientRect().top + window.scrollY
        const raw = top - view + 0.2 * Math.min(el.offsetHeight, view)
        return Math.min(raw, ScrollTrigger.maxScroll(window) - 1)
      }
      if (props.baseRotation) {
        gsap.set(el, { transformOrigin: '0% 50%', rotate: props.baseRotation })
      }
      ScrollTrigger.create({
        trigger: el,
        start: startAt,
        onEnter: play,
        onLeave: play,
        onRefresh: (self) => {
          if (self.progress > 0) play()
        },
      })
    } else {
      if (props.baseRotation) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: props.baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: clampToScroll(props.rotationEnd),
              scrub,
            },
          }
        )
      }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: el,
          start: () => `top bottom-=${0.2 * Math.min(el.offsetHeight, viewportHeight())}`,
          end: clampToScroll(props.wordAnimationEnd),
          scrub,
        },
      })
    }

    const resizeObserver =
      props.splitBy === 'lines' && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            measure()
            last.fill(-1)
            render()
          })
        : null
    resizeObserver?.observe(textEl)

    return () => {
      resizeObserver?.disconnect()
      resetStyles(el)
    }
  })

  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(() => {
      if (containerRef.value) ScrollTrigger.refresh()
    })
  }
}

onMounted(() => {
  build()
})

const watched = () => [
  props.text,
  props.tag,
  props.splitBy,
  props.effect,
  props.mode,
  props.duration,
  props.highlightColor,
  props.enableBlur,
  props.baseOpacity,
  props.baseRotation,
  props.blurStrength,
  props.baseOffset,
  props.stagger,
  props.smoothing,
  props.rotationEnd,
  props.wordAnimationEnd,
]

watch(
  watched,
  async () => {
    if (mm) {
      mm.revert()
      mm = null
    }
    await nextTick()
    build()
  },
  { flush: 'post' }
)

onBeforeUnmount(() => {
  if (mm) {
    mm.revert()
    mm = null
  }
})
</script>

<template>
  <component
    :is="tag"
    ref="containerRef"
    class="scroll-reveal"
    :class="containerClassName"
    :aria-label="rawText ?? undefined"
  >
    <span
      ref="textRef"
      class="scroll-reveal-text"
      :class="textClassName"
      :aria-hidden="rawText == null ? undefined : true"
    >
      <template v-if="chunks">
        <template v-for="chunk in chunks" :key="chunk.key">
          <template v-if="chunk.space !== undefined">{{ chunk.space }}</template>
          <span v-else class="scroll-reveal-word">
            <template v-if="splitBy === 'chars'">
              <span
                v-for="(char, charIndex) in chunk.chars"
                :key="charIndex"
                class="scroll-reveal-piece"
                :style="initialPieceStyle"
                >{{ char }}</span
              >
            </template>
            <span v-else class="scroll-reveal-piece" :style="initialPieceStyle">{{ chunk.word }}</span>
          </span>
        </template>
      </template>
      <slot v-else />
    </span>
  </component>
</template>
