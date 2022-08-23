/* 请求模块 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net' // 基础路径
})

// 请求拦截器
// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 任何请求发起都会经过这里
    // config: 本次请求的配置对象
    // config 里面有一个属性：headers
    // 在发送请求之前做些什么
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config)
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
  },
  function(error) {
    // 如果请求出错了（还没有发出去）会进入这里
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
