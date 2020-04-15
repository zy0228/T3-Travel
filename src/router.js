import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('./views/Home.vue')
const Search = () => import('./views/SelectSearch')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
