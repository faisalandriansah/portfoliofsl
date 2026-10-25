<script setup>
import { animated } from './motion'
import ProgressBar from './components/ProgressBar.vue'
import SplashCursor from './components/SplashCursor.vue'
import Preloader from './components/Preloader.vue'
import NavBar from './components/NavBar.vue'
import ThemeFab from './components/ThemeFab.vue'
import HeroSection from './components/HeroSection.vue'
import TechMarquee from './components/TechMarquee.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import GallerySection from './components/GallerySection.vue'
import OrbitSection from './components/OrbitSection.vue'
import ContactSection from './components/ContactSection.vue'
import CommandPalette from './components/CommandPalette.vue'
import ToastMessage from './components/ToastMessage.vue'
</script>

<template>
  <ProgressBar />
  <SplashCursor />
  <Preloader v-if="animated" />
  <NavBar />
  <ThemeFab />

  <HeroSection />
  <TechMarquee />

  <main class="wrap">
    <AboutSection />
  </main>

  <ProjectsSection />

  <div class="wrap">
    <TimelineSection />
    <GallerySection />
    <OrbitSection />
    <ContactSection />
  </div>

  <footer>© 2026 Achmad Faisal · Sukodono, Lumajang</footer>

  <ToastMessage />
  <CommandPalette />
</template>
