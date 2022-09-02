<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)">
      <template #title>
        <div v-html="highlight(text)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

// 按需加载好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意：handler 函数名称是固定的
      // handler(value) {
      //   console.log(value);
      // },

      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(function(value) {
        this.loadSearchSuggestions(value)
      }, 500),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
        // console.log(this.suggestions)
      } catch (error) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    // highlight(text) {
    //   const highlightStr = `<span style="color: #3296fa">${this.searchText}</span>`
    //   const reg = new RegExp(this.searchText, 'gi')
    //   return text.replace(reg, highlightStr)
    // }
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`

      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 是原生 JavaScript 的内置构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象。注意，这里不要加 //
      //    参数2：匹配模式，要写到字符串中。g 全局匹配，i 忽略大小写
      const reg = new RegExp(this.searchText, 'gi')
      if (text) {
        return text.replace(reg, highlightStr)
      }
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
