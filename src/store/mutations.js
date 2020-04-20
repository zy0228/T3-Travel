import * as types from './mutation-types'

const mutations = {
  [types.SET_CITY] (state, city) {
    state.city = city
  },
  [types.SET_CENTER_POSITION] (state, position) {
    state.centerPosition = position
  },
  [types.SET_START_POIS] (state, pois) {
    state.startPois = pois
  },
  [types.SET_END_POIS] (state, pois) {
    state.endPois = pois
  },
  [types.SET_HISTORY] (state, val) {
    state.history = val
  },
  [types.SET_HOME] (state, home) {
    state.home = home
  },
  [types.SET_COMPANY] (state, company) {
    state.company = company
  }
}

export default mutations