<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->

      <!-- 评论的回复列表 -->
      <!-- 文章的评论和评论的回复是同一接口，所以可以复用comment-list组件，还需要定制两个参数 -->
      <van-cell title="所有回复" />
      <comment-list :source="comment.com_id" type="c" :list="commentList" />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部 -->
    <div class="reply-bottom">
      <van-button class="write-btn" size="small" round @click="isPostShow = true">写评论</van-button>
    </div>
    <!-- /底部 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue'
import CommentList from './CommentList.vue'
import CommentPost from './CommentPost.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: [] // 评论列表
    }
  },
  methods: {
    onPostSuccess(data) {
      // console.log(data)
      // 更新回复的数量
      // eslint-disable-next-line
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
