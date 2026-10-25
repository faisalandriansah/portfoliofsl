
export const animated =
  typeof matchMedia === 'function' &&
  !matchMedia('(prefers-reduced-motion:reduce)').matches

export const finePointer =
  typeof matchMedia === 'function' &&
  matchMedia('(hover:hover) and (pointer:fine)').matches
