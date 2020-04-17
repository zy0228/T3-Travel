import * as types from './mutation-types'
import { saveCenterPosition, saveHistory, removeHistory, saveHome, 
saveCompany, saveFavorites} from 'common/js/cache'

export const setCenterPosition = ({commit}, center) => {
  commit(types.SET_CENTER_POSITION, saveCenterPosition(center))
}

export const saveSearch = ({commit}, val) => {
  commit(types.SET_HISTORY, saveHistory(val))
}

export const removeSearch = ({commit}) => {
  commit(types.SET_HISTORY, removeHistory())
}

export const saveHomeTag = ({commit}, home) => {
  commit(types.SET_HOME, saveHome(home))
}

export const saveCompanyTag = ({commit}, company) => {
  commit(types.SET_COMPANY, saveCompany(company))
}

// 好像不需要新建favorites 直接取当前历史里面的收藏了的就行了
export const saveFavoritesTag = ({commit}, id) => {
  commit(types.SET_HISTORY, saveFavorites(id))
}