const KEY = 'theme'

export function initTheme() {
  let theme = 'light'
  try {
    theme = localStorage.getItem(KEY) || theme
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme)
}

export function toggleTheme() {
  const root = document.documentElement
  const attr = root.getAttribute('data-theme')
  const dark = attr === 'dark' || (!attr && matchMedia('(prefers-color-scheme:dark)').matches)
  const next = dark ? 'light' : 'dark'
  root.setAttribute('data-theme', next)
  try { localStorage.setItem(KEY, next) } catch (e) {}
}
