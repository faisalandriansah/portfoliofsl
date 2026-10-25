import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { animated } from './motion'
import { initTheme } from './composables/useTheme'
import { initLenis } from './composables/useLenis'

initTheme()

if (animated) {
  // CSS punya state awal "tersembunyi" di bawah .js (preloader, reveal, dst)
  document.documentElement.classList.add('js')
  initLenis()
}

createApp(App).mount('#app')
