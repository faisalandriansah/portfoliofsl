<script setup>
import { certificates } from '../data/portfolio'
import CircularGalleryHost from './CircularGalleryHost.vue'
</script>

<template>
  <section id="sertifikat" class="certificate-gallery">
    <div class="gallery-heading">
      <div>
        <p class="eyebrow"><b>04</b>Certificates</p>
        <h2 class="d">Proof of<br>progress.</h2>
      </div>
      <p class="gallery-intro">
        A growing collection of certifications and learning milestones.
      </p>
    </div>

    <CircularGalleryHost
      :items="certificates"
      :bend="3"
      :border-radius="0.05"
      :scroll-ease="0.05"
      :item-size="1"
      :item-aspect="0.78"
      :gap="0.26"
      :wave="1"
      :fade-edges="0.12"
      :shadow="0.25"
      :scroll-speed="2"
      :auto-scroll="0"
      snap
      :grayscale="false"
      show-titles
      open-on-click
      intro
    />
  </section>
</template>

<style scoped>
.certificate-gallery {
  --gallery-line: color-mix(in srgb, var(--fg) 15%, transparent);
  border-top: 1px solid var(--gallery-line);
}

.gallery-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 30px;
}

.gallery-heading h2 {
  margin-bottom: 0;
}

.gallery-intro {
  max-width: 30ch;
  margin: 0 0 8px;
  color: var(--muted);
  font-size: clamp(14px, 1.4vw, 17px);
}

@media (max-width: 640px) {
  .gallery-heading {
    display: block;
  }

  .gallery-intro {
    margin-top: 20px;
  }
}

@media (max-width: 360px) {
  .gallery-heading h2 {
    font-size: clamp(34px, 12vw, 42px);
  }

  .gallery-intro {
    max-width: 26ch;
  }
}
</style>
