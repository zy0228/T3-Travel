export function debounce (fn, delay) {
  let timer

  return function (...arg) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, delay)
  }
}
