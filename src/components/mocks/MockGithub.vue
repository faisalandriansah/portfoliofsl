<script setup>
let seed = 7
const cells = Array.from({ length: 182 }, () => {
  seed = (seed * 9301 + 49297) % 233280
  const random = seed / 233280
  const level = random > 0.82 ? 1 : random > 0.62 ? 0.6 : random > 0.4 ? 0.3 : 0
  return level
    ? { background: `color-mix(in srgb, var(--accent) ${level * 100}%, transparent)` }
    : null
})
const languages = [['PHP', 130], ['Vue', 96], ['JavaScript', 150], ['Laravel', 110]]
</script>

<template>
  <div class="av">
    <b>AF</b>
    <div>faisalandriansah<small>Full Stack Developer</small></div>
  </div>
  <div class="heat"><i v-for="(cell, index) in cells" :key="index" :style="cell"></i></div>
  <div class="tb">
    <div v-for="[name, width] in languages" :key="name">
      <span class="sk" :style="{ width: `${width}px` }"></span>
      <u>{{ name }}</u>
    </div>
  </div>
</template>
