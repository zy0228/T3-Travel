const support = 'localStorage' in window
const CENTER_POSITION_KEY = '_AMap_center_position_'
const START_POIS_KEY = '_startPois_'
const END_POIS_KEY = '_endPois_'
const SEARCH_KEY = '_T3search_'

const SEARCH_MAX_LENGTH = 10

function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)

  if (index === 0) return

  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveCenterPosition(position) {
  if (!support) return
  localStorage.setItem(CENTER_POSITION_KEY, position)
  return position
}

export function loadCenterPoistion() {
  return localStorage.getItem(CENTER_POSITION_KEY) || []
}

export function saveStartPois(pois) {
  if (!support) return
  localStorage.setItem(START_POIS_KEY, pois)
  return pois
}

export function saveEndPois(pois) {
  if (!support) return
  localStorage.setItem(END_POIS_KEY, pois)
  return pois
}

export function saveHistory(pois) {
  let history = localStorage.getItem(SEARCH_KEY) || []

  insertArray(history, pois, (item) => {
    return item.id === pois.id
  }, SEARCH_MAX_LENGTH)

  localStorage.setItem(SEARCH_KEY, history)

  return history
}