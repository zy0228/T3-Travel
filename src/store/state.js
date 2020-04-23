import { loadCenterPoistion, loadHistory, loadCompany, loadHome, loadSP, loadEP} from 'common/js/cache'

const state = {
  city: '',
  centerPosition: loadCenterPoistion(), // center
  startPois: loadSP(),
  endPois: loadEP(),
  home: loadHome(),
  company: loadCompany(),
  history: loadHistory(),
  price: 0,
  poinWayList: [],
  addPoinWay: false
}

export default state
