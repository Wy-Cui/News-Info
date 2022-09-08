<template>
  <van-icon color="#777" :name="value === 1 ? 'good-job' : 'good-job-o'" :class="{ liked: value === 1 }" @click="onLike" />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onLike() {
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞，点赞
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('登录后重试')
        } else {
          this.$toast.fail('操作失败，请重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  color: #e5645f !important;
}
</style>
