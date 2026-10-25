import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../gsap'

let lenis = null

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.14 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  // klik link anchor (#tentang, dst) -> scroll halus lewat Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a) return
    const el = document.querySelector(a.getAttribute('href'))
    if (el) {
      e.preventDefault()
      lenis.scrollTo(el)
    }
  })
  return lenis
}

export function scrollToTarget(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'smooth' })
}
