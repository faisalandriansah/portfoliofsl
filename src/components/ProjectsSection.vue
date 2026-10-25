<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '../gsap'
import { animated } from '../motion'
import { projects } from '../data/portfolio'
import { CONFIG } from '../data/config'
import ProjectCard from './ProjectCard.vue'
import MockCareerMate from './mocks/MockCareerMate.vue'
import MockDashboard from './mocks/MockDashboard.vue'
import MockGithub from './mocks/MockGithub.vue'

const mocks = {
  careermate: MockCareerMate,
  inspektorat: MockDashboard,
  github: MockGithub,
}
const root = ref(null)
const track = ref(null)
let media

onMounted(() => {
  if (!animated) return

  media = gsap.matchMedia()
  media.add('(min-width: 761px)', () => {
    const distance = () => track.value.scrollWidth - window.innerWidth + 40
    gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="proyek" ref="root" class="hs">
    <div class="hs-in">
      <div ref="track" class="hs-track">
        <div class="pnl intro">
          <p class="eyebrow"><b>02</b>Projects</p>
          <h2 class="d">Karya<br>pilihan →</h2>
        </div>

        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.key"
          :project="project"
          :shot="CONFIG.shots?.[index] || ''"
        >
          <component :is="mocks[project.key]" />
        </ProjectCard>
      </div>
    </div>
  </section>
</template>
