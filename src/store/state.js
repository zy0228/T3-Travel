import { loadCenterPoistion, loadHistory, loadCompany, loadHome} from 'common/js/cache'

const state = {
  city: '',
  centerPosition: loadCenterPoistion(), // center
  startPois: {},
  endPois: {},
  home: loadHome(),
  company: loadCompany(),
  history: loadHistory()
}

export default state
