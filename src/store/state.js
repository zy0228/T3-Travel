import { loadCenterPoistion, loadHistory, loadCompany, loadHome, loadSP, loadEP} from 'common/js/cache'
import { currentProcess } from 'common/js/config'

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
  addPoinWay: false,
  callCar: currentProcess.notCall,
  resvernation: null,
  showLayer: true
}

export default state
