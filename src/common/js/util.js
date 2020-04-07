export function debounce (fn, delay) {
  let timer

  return function (...arg) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      console.log(arg)
      fn.apply(this, arg)
    }, delay)
  }
}
