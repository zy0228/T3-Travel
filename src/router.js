import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('./views/Home.vue')
const Search = () => import('./views/SelectSearch')
const Favorite = () => import('./components/AppFavorites')
const Appsearch = () => import('./components/AppSearch.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':flag?/favorite',
          component: Favorite
        },
        {
          path: ':flag?/select',
          component: Appsearch
        }
      ]
    }
  ]
})
