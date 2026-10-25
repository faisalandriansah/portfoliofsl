<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  ink: { type: String, default: 'auto' },
  planetDots: { type: Number, default: 2600 },
  ringParticles: { type: Number, default: 1300 },
  speed: { type: Number, default: 1 },
  height: { type: String, default: '440px' },
  label: { type: String, default: '' },
})

const canvasRef = ref(null)
let teardown = null

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d', { alpha: true, desynchronized: true })
  if (!ctx) return

  const TAU = Math.PI * 2
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Tier kualitas: layar kecil / perangkat terbatas dapat mode ringan.
  const cores = navigator.hardwareConcurrency || 8
  const memory = navigator.deviceMemory || 8
  const saveData = navigator.connection && navigator.connection.saveData
  const lowPower =
    window.matchMedia('(max-width: 760px)').matches || cores <= 4 || memory <= 4 || !!saveData
  const dprCap = lowPower ? 1 : 1.25
  let maxDpr = dprCap
  const targetFps = lowPower ? 30 : 60
  const frameGap = 1000 / targetFps - 3
  const countScale = lowPower ? 0.3 : 0.55
  const STAR_COUNT = lowPower ? 50 : 90
  let drawShadows = !lowPower
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)

  const resolveInk = () => {
    if (props.ink !== 'auto') return props.ink
    const styles = getComputedStyle(document.documentElement)
    const v =
      styles.getPropertyValue('--planet-ink').trim() ||
      styles.getPropertyValue('--fg').trim()
    return v || '#2a2926'
  }

  const isDarkTheme = () => {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr) return attr === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Palet planet mengikuti tema. Versi terang memakai dasar hangat yang lebih
  // muda agar tidak tampak seperti bola gelap, terutama di layar kecil.
  const THEMES = {
    dark: {
      base: '#4A1B0C',
      levels: [
        ['#4A1B0C', '#854F0B', '#BA7517', '#EF9F27', '#FAC775'],
        ['#4A1B0C', '#712B13', '#993C1D', '#D85A30', '#F0997B'],
        ['#412402', '#633806', '#854F0B', '#EF9F27', '#FAC775'],
      ],
      moonRim: '#444441',
      moonFace: '#D3D1C7',
    },
    light: {
      base: '#C58B4A',
      levels: [
        ['#8A4B1F', '#A9601F', '#C97C29', '#E99C34', '#FAC775'],
        ['#7A3418', '#A64A22', '#C4683A', '#E58B5A', '#F0997B'],
        ['#6E4508', '#91600F', '#B27F25', '#E99C34', '#FAC775'],
      ],
      moonRim: '#9A9387',
      moonFace: '#F7F3E9',
    },
  }

  let ink = resolveInk()
  let palFlat = []
  let planetBase = THEMES.dark.base
  let moonRim = THEMES.dark.moonRim
  let moonFace = THEMES.dark.moonFace

  const applyTheme = () => {
    const t = THEMES[isDarkTheme() ? 'dark' : 'light']
    planetBase = t.base
    palFlat = t.levels.flat()
    moonRim = t.moonRim
    moonFace = t.moonFace
    ink = resolveInk()
  }
  applyTheme()

  let W = 0
  let H = 0
  let rzRaf = 0

  const N = Math.max(360, Math.round(props.planetDots * countScale))
  const M = Math.max(180, Math.round(props.ringParticles * countScale))

  const pts = []
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N
    const r = Math.sqrt(1 - y * y)
    const t = i * 2.399963
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
  }

  const ring = []
  for (let j = 0; j < M; j++) {
    let rr
    do {
      rr = 1.38 + Math.pow(Math.random(), 0.85) * 0.97
    } while (rr > 1.78 && rr < 1.86)
    const inner = rr < 1.78
    ring.push({
      r: rr,
      th: Math.random() * TAU,
      w: 0.0035 / Math.pow(rr, 1.5),
      kind: inner ? (Math.random() < 0.5 ? 0 : 1) : 2,
      s: 0.8 + Math.random() * 1.1,
    })
  }

  const stars = []
  for (let s = 0; s < STAR_COUNT; s++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      l: Math.floor(Math.random() * 3),
      r: 0.6 + Math.random() * 1.2,
    })
  }
  const layerFactor = [8, 18, 34]

  let L = [-0.5, 0.55, 0.67]
  const ll = Math.hypot(L[0], L[1], L[2])
  L = [L[0] / ll, L[1] / ll, L[2] / ll]

  let ang = 0
  let moon = 0
  let boost = 0
  let down = false
  let inside = false
  let tx = null
  let ty = null
  let mx = -999
  let my = -999
  let px = 0
  let py = 0
  let phi = 0.5
  let roll = -0.3
  let time = 0
  let visible = true
  let running = false
  let last = performance.now()

  const batch = Array.from({ length: 15 }, () => [])
  const ringBatch = Array.from({ length: 6 }, () => [])
  const shadowPts = []
  const ringColors = ['#BA7517', '#D85A30']
  let lastDraw = 0
  let prevDraw = 0
  let avgGap = 0
  let drawCount = 0
  let degraded = false

  function render(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
    last = now
    const k = dt * 60
    const spd = props.speed * (reduceMotion ? 0.3 : 1)
    const smooth = (rate) => 1 - Math.pow(1 - rate, k)

    time += dt
    ctx.clearRect(0, 0, W, H)

    const R = Math.min(W * 0.15, H * 0.26)
    if (!R) return
    const cx = W / 2
    const cy = H / 2 - 10

    let phiT = 0.5
    let rollT = -0.3
    let pxT = 0
    let pyT = 0
    if (inside && tx !== null) {
      phiT = 0.28 + (ty / H) * 0.6
      rollT = -0.3 + (tx / W - 0.5) * 0.4
      pxT = tx / W - 0.5
      pyT = ty / H - 0.5
      if (mx < -900) {
        mx = tx
        my = ty
      }
      mx += (tx - mx) * 0.2
      my += (ty - my) * 0.2
    }
    phi += (phiT - phi) * smooth(0.06)
    roll += (rollT - roll) * smooth(0.06)
    px += (pxT - px) * smooth(0.05)
    py += (pyT - py) * smooth(0.05)
    boost += ((down ? 1 : 0) - boost) * smooth(down ? 0.08 : 0.04)
    ang += (0.005 + boost * 0.04) * spd * k
    moon += (0.007 + boost * 0.03) * spd * k

    const cp = Math.cos(phi)
    const sp = Math.sin(phi)
    const cr = Math.cos(roll)
    const sr = Math.sin(roll)
    const Lw = [L[0], L[1] * cp + L[2] * sp, -L[1] * sp + L[2] * cp]

    const proj = (wx, wy, wz) => {
      const up = wy * cp - wz * sp
      const dep = wy * sp + wz * cp
      const x = wx * R
      const y = -up * R
      return [cx + x * cr - y * sr, cy + x * sr + y * cr, dep]
    }

    ctx.fillStyle = ink
    for (let l = 0; l < 3; l++) {
      const tw = 0.5 + 0.5 * Math.sin(time * 1.5 + l * 1.7)
      ctx.globalAlpha = 0.13 + 0.25 * tw + l * 0.07
      ctx.beginPath()
      for (let a = 0; a < stars.length; a++) {
        const st = stars[a]
        if (st.l !== l) continue
        const sx = (((st.x * W - px * layerFactor[st.l] * 2) % W) + W) % W
        const sy = (((st.y * H - py * layerFactor[st.l] * 2) % H) + H) % H
        const sr2 = st.r * (0.8 + st.l * 0.3)
        ctx.moveTo(sx + sr2, sy)
        ctx.arc(sx, sy, sr2, 0, TAU)
      }
      ctx.fill()
    }
    ctx.globalAlpha = 1

    const mr = 2.75
    const inc = 0.42
    const ci = Math.cos(inc)
    const si = Math.sin(inc)

    // Ratakan orbit bulan secara vertikal secukupnya agar bulatan putih
    // tidak terpotong tepi atas/bawah canvas.
    const ok1 = ci * sr - si * cp * cr
    const ok2 = sp * cr
    const orbitAmp = R * mr * Math.sqrt(ok1 * ok1 + ok2 * ok2)
    const orbitLimit = cy - (R * 0.24 + 8)
    const vs =
      orbitAmp > orbitLimit && orbitLimit > 0
        ? Math.max(0.6, orbitLimit / orbitAmp)
        : 1

    ctx.save()
    ctx.strokeStyle = ink
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1
    ctx.setLineDash([5, 6])
    ctx.beginPath()
    for (let q = 0; q <= 96; q++) {
      const an = (q / 96) * TAU
      const ox = mr * Math.cos(an)
      const oz = mr * Math.sin(an)
      const p0 = proj(ox * ci, ox * si, oz)
      const py0 = cy + (p0[1] - cy) * vs
      if (q === 0) ctx.moveTo(p0[0], py0)
      else ctx.lineTo(p0[0], py0)
    }
    ctx.stroke()
    ctx.restore()

    const dotR = Math.max(1.2, R * 0.038)
    const ringScale = Math.max(0.55, R / 114)
    const hitR = Math.max(44, R * 0.7)
    const hitForce = Math.max(14, R * 0.26)
    const stride = degraded ? 2 : 1

    const drawRing = (front) => {
      for (let g = 0; g < 6; g++) ringBatch[g].length = 0
      for (let j = 0; j < M; j += stride) {
        const o = ring[j]
        o.th += o.w * (1 + boost * 9) * spd * k
        const wx = o.r * Math.cos(o.th)
        const wz = o.r * Math.sin(o.th)
        if (wz >= 0 !== front) continue
        const pp = proj(wx, 0, wz)
        const dx = pp[0] - mx
        const dy = pp[1] - my
        const d = Math.sqrt(dx * dx + dy * dy)
        let qx = pp[0]
        let qy = pp[1]
        if (inside && d < hitR && d > 0.01) {
          const f = 1 - d / hitR
          qx += (dx / d) * f * f * hitForce
          qy += (dy / d) * f * f * hitForce
        }
        const b = wx * Lw[0] + wz * Lw[2]
        const cc = o.r * o.r - 1
        const shaded = b < 0 && b * b - cc > 0 ? 1 : 0
        ringBatch[shaded * 3 + o.kind].push(
          qx,
          qy,
          o.s * ringScale * (1 + 0.1 * pp[2])
        )
      }
      for (let g = 0; g < 6; g++) {
        const arr = ringBatch[g]
        if (!arr.length) continue
        const kind = g % 3
        const shaded = g >= 3
        const base = kind === 2 ? (front ? 0.6 : 0.4) : front ? 1 : 0.736
        ctx.globalAlpha = base * (shaded ? 0.3 : 1)
        ctx.fillStyle = kind === 2 ? ink : ringColors[kind]
        ctx.beginPath()
        for (let i = 0; i < arr.length; i += 3) {
          const x = arr[i]
          const y = arr[i + 1]
          const r = arr[i + 2]
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, TAU)
        }
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const drawMoon = (front) => {
      const ox = mr * Math.cos(moon)
      const oz = mr * Math.sin(moon)
      const p = proj(ox * ci, ox * si, oz)
      if (p[2] >= 0 !== front) return
      const mrad = R * 0.2 * (1 + (0.1 * p[2]) / mr)
      const mox = p[0]
      const moy = cy + (p[1] - cy) * vs
      ctx.fillStyle = moonRim
      ctx.beginPath()
      ctx.arc(mox, moy, mrad, 0, TAU)
      ctx.fill()
      ctx.fillStyle = moonFace
      ctx.beginPath()
      ctx.arc(mox + L[0] * mrad * 0.25, moy - L[1] * mrad * 0.25, mrad * 0.78, 0, TAU)
      ctx.fill()
    }

    drawRing(false)
    drawMoon(false)

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, TAU)
    ctx.clip()
    ctx.fillStyle = planetBase
    ctx.fillRect(cx - R - 2, cy - R - 2, R * 2 + 4, R * 2 + 4)

    for (let b = 0; b < batch.length; b++) batch[b].length = 0
    shadowPts.length = 0

    const ca = Math.cos(ang)
    const sa = Math.sin(ang)
    const shScale = dotR / 4.3
    for (let n = 0; n < N; n += stride) {
      const pt = pts[n]
      const x1 = pt[0] * ca + pt[2] * sa
      const z1 = -pt[0] * sa + pt[2] * ca
      const y1 = pt[1]
      const y2 = y1 * cp - z1 * sp
      const z2 = y1 * sp + z1 * cp
      if (z2 <= 0) continue
      let sh = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2])
      if (sh > 0 && Math.abs(Lw[1]) > 0.001) {
        const tt = -y1 / Lw[1]
        if (tt > 0) {
          const hx = x1 + tt * Lw[0]
          const hz = z1 + tt * Lw[2]
          const rho = Math.sqrt(hx * hx + hz * hz)
          if (rho > 1.38 && rho < 2.35 && !(rho > 1.78 && rho < 1.86)) sh *= 0.12
        }
      }
      const lv = Math.min(4, Math.floor(sh * (0.55 + 0.45 * z2) * 5.4))
      const bx = x1 * R
      const by = -y2 * R
      const sx = cx + bx * cr - by * sr
      const sy = cy + bx * sr + by * cr
      const pi = Math.floor((y1 + 1) * 5.5) % 3
      batch[pi * 5 + lv].push(sx, sy)
      if (drawShadows) {
        const dr = 2.6 * shScale * Math.pow(1 - sh, 1.6) * (0.4 + 0.6 * z2)
        if (dr > 0.4) shadowPts.push(sx, sy, dr)
      }
    }

    if (shadowPts.length) {
      ctx.globalAlpha = 0.4
      ctx.fillStyle = '#2C2C2A'
      ctx.beginPath()
      for (let i = 0; i < shadowPts.length; i += 3) {
        const x = shadowPts[i]
        const y = shadowPts[i + 1]
        const r = shadowPts[i + 2]
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, TAU)
      }
      ctx.fill()
      ctx.globalAlpha = 1
    }

    for (let b = 0; b < batch.length; b++) {
      const arr = batch[b]
      if (!arr.length) continue
      ctx.fillStyle = palFlat[b]
      ctx.beginPath()
      for (let i = 0; i < arr.length; i += 2) {
        const x = arr[i]
        const y = arr[i + 1]
        ctx.moveTo(x + dotR, y)
        ctx.arc(x, y, dotR, 0, TAU)
      }
      ctx.fill()
    }
    ctx.restore()

    ctx.strokeStyle = '#FAC775'
    ctx.lineWidth = Math.max(1.2, R * 0.022)
    ctx.globalAlpha = 0.5
    const a0 = Math.atan2(-L[1], L[0])
    ctx.beginPath()
    ctx.arc(cx, cy, R - 1, a0 - 1.1, a0 + 1.1)
    ctx.stroke()
    ctx.globalAlpha = 1

    drawRing(true)
    drawMoon(true)

    if (inside) {
      ctx.save()
      ctx.strokeStyle = '#D85A30'
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.arc(mx, my, hitR, 0, TAU)
      ctx.stroke()
      ctx.restore()
    }
  }

  function frame(now) {
    if (!visible) {
      running = false
      return
    }
    raf = requestAnimationFrame(frame)
    const gap = degraded ? 1000 / 30 - 3 : frameGap
    if (now - lastDraw < gap) return
    lastDraw = now
    if (prevDraw) {
      const delta = now - prevDraw
      avgGap = avgGap ? avgGap + (delta - avgGap) * 0.05 : delta
    }
    prevDraw = now
    drawCount++
    if (!lowPower && !degraded && drawCount > 90 && avgGap > 26) {
      degraded = true
      drawShadows = false
      maxDpr = 1
      doResize()
    }
    render(now)
  }

  function start() {
    if (reduceMotion || running) return
    running = true
    last = performance.now()
    lastDraw = 0
    prevDraw = 0
    avgGap = 0
    drawCount = 0
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  let raf = 0

  const doResize = () => {
    rzRaf = 0
    const nd = Math.min(window.devicePixelRatio || 1, maxDpr)
    const nw = c.clientWidth
    const nh = c.clientHeight
    if (nw === W && nh === H && nd === dpr) return
    dpr = nd
    W = nw
    H = nh
    c.width = Math.round(W * dpr)
    c.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (reduceMotion) render(performance.now())
  }

  const ro = new ResizeObserver(() => {
    if (!rzRaf) rzRaf = requestAnimationFrame(doResize)
  })
  ro.observe(c)

  const mo = new MutationObserver(() => {
    applyTheme()
    if (reduceMotion) render(performance.now())
  })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  const darkMq = window.matchMedia('(prefers-color-scheme: dark)')
  const onScheme = () => {
    applyTheme()
    if (reduceMotion) render(performance.now())
  }
  if (darkMq.addEventListener) darkMq.addEventListener('change', onScheme)
  else if (darkMq.addListener) darkMq.addListener(onScheme)

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting
      if (visible) start()
      else stop()
    },
    { threshold: 0 }
  )
  io.observe(c)

  const setPointer = (e) => {
    const b = c.getBoundingClientRect()
    tx = e.clientX - b.left
    ty = e.clientY - b.top
  }
  const onMove = (e) => {
    if (e.pointerType === 'touch' && !down) return
    setPointer(e)
    inside = true
  }
  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    setPointer(e)
    down = true
    inside = true
    try {
      c.setPointerCapture(e.pointerId)
    } catch (err) {}
  }
  const onUp = (e) => {
    down = false
    if (!e || e.pointerType !== 'mouse') inside = false
  }
  const onLeave = () => {
    down = false
    inside = false
  }
  c.addEventListener('pointermove', onMove)
  c.addEventListener('pointerdown', onDown)
  c.addEventListener('pointercancel', onUp)
  c.addEventListener('pointerleave', onLeave)
  window.addEventListener('pointerup', onUp)

  doResize()
  if (!reduceMotion) start()

  teardown = () => {
    stop()
    cancelAnimationFrame(rzRaf)
    ro.disconnect()
    io.disconnect()
    mo.disconnect()
    if (darkMq.removeEventListener) darkMq.removeEventListener('change', onScheme)
    else if (darkMq.removeListener) darkMq.removeListener(onScheme)
    c.removeEventListener('pointermove', onMove)
    c.removeEventListener('pointerdown', onDown)
    c.removeEventListener('pointercancel', onUp)
    c.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('pointerup', onUp)
  }
})

onBeforeUnmount(() => {
  if (teardown) teardown()
})
</script>

<template>
  <div class="ringed-planet" :style="{ height }">
    <canvas ref="canvasRef" class="ringed-planet__canvas" aria-hidden="true"></canvas>
    <div v-if="label" class="ringed-planet__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.ringed-planet {
  position: relative;
  width: 100%;
  overflow: hidden;
  contain: layout paint;
}
.ringed-planet__canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: pan-y;
}
.ringed-planet__label {
  position: absolute;
  left: 16px;
  bottom: 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  pointer-events: none;
  user-select: none;
  opacity: 0.7;
}
</style>
