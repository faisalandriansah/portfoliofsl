<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animated } from '../motion'

const props = defineProps({
  project: { type: Object, required: true },
  shot: { type: String, default: '' },
})

const card = ref(null)
const visible = ref(!animated)
let observer

function trackPointer(event) {
  const bounds = card.value.getBoundingClientRect()
  card.value.style.setProperty('--mx', `${event.clientX - bounds.left}px`)
  card.value.style.setProperty('--my', `${event.clientY - bounds.top}px`)
}

onMounted(() => {
  if (!animated || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    visible.value = true
    observer.disconnect()
  }, { threshold: 0.15 })
  observer.observe(card.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <article
    ref="card"
    class="pnl"
    :class="{ on: visible }"
    @pointermove="trackPointer"
  >
    <div class="shot">
      <div class="sb">
        <i></i><i></i><i></i>
        <span>{{ props.project.bar }}</span>
      </div>
      <div class="view">
        <div class="scr" :style="{ '--sh': props.project.sh }">
          <img
            v-if="props.shot"
            :src="props.shot"
            :alt="`Preview ${props.project.title}`"
            loading="lazy"
            decoding="async"
          />
          <slot v-else />
        </div>
        <div class="ill">Preview UI</div>
      </div>
    </div>

    <div class="info">
      <span class="n">{{ props.project.n }}</span>
      <div>
        <h3 class="d">{{ props.project.title }}</h3>
        <p>{{ props.project.desc }}</p>
        <div class="tags">
          <span v-for="tag in props.project.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <a
        v-if="props.project.key === 'github'"
        class="arrow"
        href="https://github.com/faisalandriansah"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buka GitHub"
      >↗</a>
      <span v-else class="arrow" aria-hidden="true">↗</span>
    </div>
  </article>
</template>
