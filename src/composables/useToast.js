import { reactive } from 'vue'

export const toastState = reactive({ text: '', on: false })
let timer

export function toast(text) {
  toastState.text = text
  toastState.on = true
  clearTimeout(timer)
  timer = setTimeout(() => { toastState.on = false }, 1900)
}

export function copy(value) {
  try {
    navigator.clipboard.writeText(value).then(
      () => toast('Tersalin: ' + value),
      () => toast(value),
    )
  } catch (e) {
    toast(value)
  }
}
