<template>
  <van-button v-if="isFollowed" class="follow-btn" round size="small" :loading="isLoading" @click="onFollow">已关注</van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="isLoading" @click="onFollow">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed', // 默认是 isFollowed
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async onFollow() {
      this.isLoading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (error) {
        let message = '操作失败，请重试！'
        if (error.response && error.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.isLoading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style></style>
