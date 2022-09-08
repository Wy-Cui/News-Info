<template>
  <div class="collect-article">
    <van-icon color="#777" :name="value ? 'star' : 'star-o'" :class="{ collected: value }" @click="onCollect" />
  </div>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    async onCollect() {
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，添加收藏
          await addCollect(this.articleId)
        }

        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)

        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
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
.collect-article {
  .collected {
    color: #ffa500 !important;
  }
}
</style>
