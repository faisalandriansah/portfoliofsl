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
import CrystalizedBallSection from './components/CrystalizedBallSection.vue'
import GithubContributionsSection from './components/GithubContributionsSection.vue'
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

  <div class="curtain-stage">
    <div class="curtain-hero">
      <HeroSection />
    </div>

    <TechMarquee />

    <main class="curtain-about">
      <div class="wrap">
        <AboutSection />
      </div>
    </main>
  </div>

  <ProjectsSection />

  <div class="wrap">
    <TimelineSection />
    <GallerySection />
    <CrystalizedBallSection />
    <GithubContributionsSection />
    <ContactSection />
  </div>

  <footer class="site-footer">
    <div class="footer-links">
      <div class="footer-connect">
        <h2>Stay connected for<br>new ideas and collaborations.</h2>
        <div class="footer-actions">
          <a href="mailto:faisalrahmad039@gmail.com">Email ↗</a>
          <a href="https://github.com/faisalandriansah" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="#kontak">Contact ↗</a>
        </div>
      </div>
      <div class="footer-nav">
        <div>
          <small>Navigation</small>
          <a href="#tentang">About</a>
          <a href="#proyek">Projects</a>
          <a href="#jejak">Journey</a>
          <a href="#galeri">Gallery</a>
        </div>
        <div>
          <small>Elsewhere</small>
          <a href="https://www.linkedin.com/in/faisal-andriansah/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/faisalandriansah" target="_blank" rel="noopener">GitHub</a>
          <a href="#kontak">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer-wordmark" aria-label="Achmad Faisal">Achmad Faisal<span>.</span></div>
    <div class="footer-meta">
      <span>© 2026 Achmad Faisal</span>
      <span>Full Stack Developer · Lumajang, Indonesia</span>
      <a class="footer-up" href="#" aria-label="Kembali ke atas">Back to top ↑</a>
    </div>
  </footer>

  <ToastMessage />
  <CommandPalette />
</template>
