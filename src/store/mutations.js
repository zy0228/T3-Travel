import * as types from './mutation-types'

const mutations = {
  [types.SET_CITY] (state, city) {
    state.city = city
  },
  [types.SET_POSITION] (state, position) {
    state.position = position
  }
}

export default mutations
