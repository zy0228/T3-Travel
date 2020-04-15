import * as types from './mutation-types'
import { saveCenterPosition, saveHistory } from 'common/js/cache'

export const setCenterPosition = ({commit}, center) => {
  commit(types.SET_CENTER_POSITION, saveCenterPosition(center))
}

export const saveSearch = ({commit}, val) => {
  commit(types.SET_HISTORY, saveHistory(val))
}