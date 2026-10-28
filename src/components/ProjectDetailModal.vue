<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
  shot: { type: String, default: '' },
})
const emit = defineEmits(['close'])

function closeOnEscape(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.classList.add('project-drawer-open')
  document.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  document.body.classList.remove('project-drawer-open')
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <Teleport to="body">
    <div class="project-drawer-layer" role="presentation">
      <button class="project-drawer-backdrop" aria-label="Tutup detail project" @click="emit('close')"></button>
      <aside
        class="project-drawer"
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        :aria-label="`Detail ${props.project.title}`"
        @wheel.stop
        @touchmove.stop
      >
        <header class="project-drawer__header">
          <div>
            <p class="project-drawer__eyebrow">{{ props.project.detail.category }}</p>
            <h2 class="d">{{ props.project.title }}</h2>
          </div>
          <button class="project-drawer__close" aria-label="Tutup detail project" @click="emit('close')">×</button>
        </header>

        <div class="project-drawer__content">
          <img
            v-if="props.shot"
            class="project-drawer__image"
            :src="props.shot"
            :alt="`Screenshot ${props.project.title}`"
            loading="eager"
            decoding="async"
          />

          <div class="project-drawer__meta">
            <span><small>Role</small>{{ props.project.detail.role }}</span>
            <span><small>Stack</small>{{ props.project.tags.join(' · ') }}</span>
          </div>

          <section>
            <p class="project-drawer__label">Overview</p>
            <p>{{ props.project.detail.overview }}</p>
          </section>

          <div class="project-drawer__columns">
            <section>
              <p class="project-drawer__label">Challenge</p>
              <p>{{ props.project.detail.challenge }}</p>
            </section>
            <section>
              <p class="project-drawer__label">Solution</p>
              <p>{{ props.project.detail.solution }}</p>
            </section>
          </div>

          <section>
            <p class="project-drawer__label">Key features</p>
            <ul class="project-drawer__features">
              <li v-for="feature in props.project.detail.features" :key="feature">{{ feature }}</li>
            </ul>
          </section>

          <div v-if="props.project.detail.link" class="project-drawer__actions">
            <a
              class="project-drawer__link"
              :href="props.project.detail.link"
              :aria-label="`${props.project.detail.linkLabel} ${props.project.title}`"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >{{ props.project.detail.linkLabel }} <span>↗</span></a>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
