import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ohbug from '@ohbug/browser'
import OhbugVue from '@ohbug/vue'

// import fastclick from 'fastclick'
// import VConsole from 'vconsole'

import 'common/stylus/index.styl'

Vue.config.productionTip = false
// const vConsole = new VConsole()

// fastclick.attach(document.body)

const client = Ohbug.init({
  apiKey: '348334ee85820d11d9dbd0c571208475b9d57230e0c34ea6cedfc9506f6454e4'
})

client.use(OhbugVue, Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
