<script setup>
import { toggleTheme } from '../composables/useTheme'
</script>

<template>
  <button
    class="theme-fab"
    type="button"
    aria-label="Ganti tema"
    title="Ganti tema"
    @click="toggleTheme"
  >
    ◐
  </button>
</template>
