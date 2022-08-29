import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 插件是一些独立的程序，可以给 Day.js 增加新功能和扩展已有功能
// 默认情况下，Day.js 只包含核心的代码，并没有安装任何插件
// 您可以加载多个插件来满足各类需求。

// 按需加载插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认语言是英文，我们这里配置使用中文语言包
dayjs.locale('zh-cn') // 全局使用

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
