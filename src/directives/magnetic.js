import { gsap } from '../gsap'
import { animated, finePointer } from '../motion'

// v-magnetic: tombol "ketarik" mengikuti kursor (desktop saja)
export const vMagnetic = {
  mounted(el) {
    if (!animated || !finePointer) return
    el._mm = (e) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.28,
        y: (e.clientY - r.top - r.height / 2) * 0.28,
        duration: 0.4,
      })
    }
    el._ml = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.4)' })
    el.addEventListener('mousemove', el._mm)
    el.addEventListener('mouseleave', el._ml)
  },
  unmounted(el) {
    if (el._mm) el.removeEventListener('mousemove', el._mm)
    if (el._ml) el.removeEventListener('mouseleave', el._ml)
  },
}
