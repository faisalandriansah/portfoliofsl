import { gsap } from '../gsap'
import { animated } from '../motion'

// Elemen ber-class .reveal naik + fade saat masuk viewport.
// Di hero, animasi jalan setelah preloader (delay 2s).
export function runReveal(root) {
  if (!animated) return
  gsap.utils.toArray('.reveal', root).forEach((el) => {
    const hero = el.closest('.hero')
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: hero ? 2.0 : 0,
      scrollTrigger: hero ? null : { trigger: el, start: 'top 88%', once: true },
    })
  })
}
