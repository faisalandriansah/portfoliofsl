<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../gsap'
import { animated } from '../motion'
import { runReveal } from '../composables/useReveal'
import { scrollToTarget } from '../composables/useLenis'
import ScrollReveal from './ScrollReveal.vue'
import ProfileCard from './ProfileCard.vue'
import { aboutText, IPK, stats } from '../data/portfolio'
import { CONFIG, GITHUB } from '../data/config'

const root = ref(null)
const handle = GITHUB.split('/').filter(Boolean).pop()

// angka mulai dari 0 kalau animasi aktif, langsung final kalau tidak
const ipk = ref(animated ? '0.00' : IPK.toFixed(2))
const counts = reactive(stats.map((s) => (animated ? 0 : s.n)))
let ctx

onMounted(() => {
  if (!animated) return
  ctx = gsap.context(() => {
    runReveal(root.value)

    const ip = { v: 0 }
    gsap.to(ip, {
      v: IPK,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#ipk', start: 'top 92%', once: true },
      onUpdate: () => { ipk.value = ip.v.toFixed(2) },
    })

    stats.forEach((s, i) => {
      const o = { v: 0 }
      gsap.to(o, {
        v: s.n,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: `#stat-${i}`, start: 'top 92%', once: true },
        onUpdate: () => { counts[i] = Math.round(o.v) },
      })
    })
  }, root.value)
})

onBeforeUnmount(() => ctx && ctx.revert())
</script>

<template>
  <section id="tentang" ref="root">
    <p class="eyebrow reveal"><b>01</b>About</p>

    <div class="about">
      <div class="about-main">
        <ScrollReveal
          tag="p"
          :text="aboutText"
          mode="scrub"
          split-by="words"
          effect="fade"
          :stagger="0.05"
          :duration="0.8"
          :smoothing="0"
          :base-opacity="0.1"
          :base-rotation="3"
          :base-offset="0"
          :enable-blur="true"
          :blur-strength="4"
        />

        <div class="creds reveal">
          <div class="cred">
            <b><span id="ipk">{{ ipk }}</span> / 4.00</b>
            <small>GPA for the Associate Degree in Information Technology, Polinema 2023–2026</small>
          </div>
          <div class="cred">
            <b>LSP Polinema</b>
            <small>Computer Software Programming Certification</small>
          </div>
        </div>
      </div>

      <div class="facts">
        <ProfileCard
          class="reveal"
          :avatar-url="CONFIG.photo"
          :mini-avatar-url="CONFIG.photo"
          name="Achmad Faisal"
          title="Full Stack Developer"
          :handle="handle"
          status="Building & Learning"
          contact-text="Contact"
          :radius="18"
          :holo="0.6"
          :glare="0.35"
          :tilt-strength="10"
          :parallax="6"
          :enable-mobile-tilt="false"
          enable-tilt
          intro
          @contact-click="scrollToTarget('#kontak')"
        />
      </div>
    </div>

    <div class="stats">
      <div v-for="(s, i) in stats" :id="`stat-${i}`" :key="i" class="stat reveal">
        <b><span>{{ counts[i] }}</span>{{ s.suffix }}</b><small>{{ s.label }}</small>
      </div>
    </div>
  </section>
</template>
