import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/Login/Login.vue')
const Layout = () => import('@/views/Layout/Layout.vue')
const Home = () => import('@/views/Home/Home.vue')
const Qa = () => import('@/views/Qa/Qa.vue')
const Video = () => import('@/views/Video/Video.vue')
const My = () => import('@/views/My/My.vue')
const Search = () => import('@/views/Search/Search.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home', // （未知错误，重定向可以，默认子路由无效）
        name: 'home',
        component: Home
      },
      {
        path: '/qa',
        name: 'qa',
        component: Qa
      },
      {
        path: '/video',
        name: 'video',
        component: Video
      },
      {
        path: '/my',
        name: 'my',
        component: My
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  }
]

const router = new VueRouter({
  routes
})

export default router
