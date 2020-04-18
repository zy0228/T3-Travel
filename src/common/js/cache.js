const support = 'localStorage' in window
const CENTER_POSITION_KEY = '_AMap_center_position_'
const START_POIS_KEY = '_startPois_'
const END_POIS_KEY = '_endPois_'
const SEARCH_KEY = '_T3search_'
const HOME_TAG_KEY = '_home_'
const COMPANY_TAG_KEY = '_company_'

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

function insertFavorites(arr, compare) {
  let index = arr.findIndex(compare)

  if (index > -1) {
    arr[index].favorite = !arr[index].favorite
  }

  return arr
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

  localStorage.setItem(START_POIS_KEY, JSON.stringify(pois))
  return pois
}

export function saveEndPois(pois) {
  if (!support) return
  localStorage.setItem(END_POIS_KEY, JSON.stringify(pois))
  return pois
}

export function loadSP() {
  let poi = localStorage.getItem(START_POIS_KEY) || '{}'
  return JSON.parse(poi)
}

export function loadEP() {
  let poi = localStorage.getItem(END_POIS_KEY) || '{}'
  return JSON.parse(poi)
}

export function saveHistory(pois) {
  let history = localStorage.getItem(SEARCH_KEY) || '[]'
  history = JSON.parse(history)

  insertArray(history, pois, (item) => {
    return item.id === pois.id
  }, SEARCH_MAX_LENGTH)

  localStorage.setItem(SEARCH_KEY, JSON.stringify(history))

  return history
}

export function loadHistory() {
  let history = localStorage.getItem(SEARCH_KEY) || '[]'

  return JSON.parse(history)
}

export function removeHistory() {
  let history = []
  localStorage.setItem(SEARCH_KEY, JSON.stringify(history))

  return history
}

export function saveHome(home) {
  localStorage.setItem(HOME_TAG_KEY, JSON.stringify(home))

  return home
}

export function loadHome() {
  let home =  localStorage.getItem(HOME_TAG_KEY) || '{}'

  return JSON.parse(home)
}

export function saveCompany(company) {
  localStorage.setItem(COMPANY_TAG_KEY, JSON.stringify(company))

  return company
}

export function loadCompany() {
  let company =  localStorage.getItem(COMPANY_TAG_KEY) || '{}'

  return JSON.parse(company)
}

export function saveFavorites(id) {
  let favList = localStorage.getItem(SEARCH_KEY) || '[]'
  favList = JSON.parse(favList)

  insertFavorites(favList, (item) => {
    return id === item.id
  })

  localStorage.setItem(SEARCH_KEY, JSON.stringify(favList))

  return favList
}