export function debounce (fn, delay) {
  let timer

  return function (...arg) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, delay)
  }
}

export function getDate(date) {
  let D = new Date()
  
  if (!date) {
    return format(D)
  }

  if (date) {
    D = D.setDate(D.getDate() + (+date))
    return format(D)
  }

  function format(arg) {
    arg = new Date(arg)
    let y = arg.getFullYear()
    let m = arg.getMonth() + 1
    let d = arg.getDate()

    return  m + '月' + (d < 10 ? '0' + d : d) + '日'
  }
} 
