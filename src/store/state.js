import { loadCenterPoistion } from 'common/js/cache'

const state = {
  city: '',
  centerPosition: loadCenterPoistion(), // center
  startPois: {},
  endPois: {},
  history: {}
}

export default state
