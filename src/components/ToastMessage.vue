<script setup>
import { toastState } from '../composables/useToast'
</script>

<template>
  <div id="toast" :class="{ on: toastState.on }">{{ toastState.text }}</div>
</template>
