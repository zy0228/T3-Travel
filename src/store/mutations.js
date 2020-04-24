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
  },
  [types.SET_PRICE] (state, price) {
    state.price = price
  },
  [types.SET_POINWAY] (state, poinway) {
    state.poinWayList = poinway
  },
  [types.SET_ADD_POINWAY] (state, poinway) {
    state.addPoinWay = poinway
  },
  [types.SET_CALL_CAR] (state, callcar) {
    state.callCar = callcar
  }
}

export default mutations
