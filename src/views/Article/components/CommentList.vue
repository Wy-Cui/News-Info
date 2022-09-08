<template>
  <!-- 只有 List 在可视范围内才会检查滚动位置触发 onLoad -->
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error="error" error-text="请求失败，点击重新加载" :immediate-check="false" @load="onLoad">
    <comment-item v-for="(item, index) in list" :key="index" :comment="item" @reply-click="$emit('reply-click', $event)" />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './CommentItem.vue'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      require: true
    },
    list: {
      type: Array,
      default: () => [] // vue中的类型验证规则：数组和对象必须定义成函数形式
    },
    type: {
      type: String,
      // 自定义验证函数
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [], // 把 list 定义在 props 中
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  created() {
    // onLoad() 当页面滚动到该位置时自动调用，如果想要一开始就显示总评论数，可以在这里调用
    this.onLoad()
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据

        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        //    type
        //      a 文章的评论
        //      c 评论的回复
        //    source
        //      文章的评论，则传递文章的 ID
        //      评论的回复，则传递评论的 ID
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id  这里的source超出js安全整数范围，传给axios让它自动拼接会多出引号，控制台报错，所以这里我们使用toString()手动拼接
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 2. 将数据添加到列表中
        // console.log(data)
        const { results } = data.data
        this.list.push(...results) // eslint-disable-line

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)

        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('请求失败，请重试')
      }
    }
  }
}
</script>

<style></style>
