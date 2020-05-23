import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import fastclick from 'fastclick'
// import VConsole from 'vconsole'

import 'common/stylus/index.styl'

Vue.config.productionTip = false
// const vConsole = new VConsole()

// fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
