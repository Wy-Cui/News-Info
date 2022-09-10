<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- <van-button class="search-btn" slot="title" type="info" size="small" round icon="search">搜索</van-button> -->
      <!-- 更推荐下面这种插槽的写法 -->
      <template #title>
        <van-button class="search-btn" type="info" size="small" round icon="search" to="/search">搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- Tab 标签页 -->
    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页
    -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated>
      <!-- 文章列表频道 -->
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" />
        <!-- /频道的文章列表 -->
      </van-tab>
      <!-- /文章列表频道 -->
      <template #nav-right>
        <div class="placeholder"></div>
        <div class="hamburger-btn" @click="isChannelEditShow = true">
          <div class="iconfont icon-gengduo"></div>
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑 -->
    <van-popup v-model="isChannelEditShow" closeable close-icon-position="top-left" position="bottom" :style="{ height: '100%' }">
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive" @pushChannel="onPushChannel" />
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  created() {
    this.loadUserChannels()
  },
  methods: {
    async loadUserChannels() {
      try {
        // const { data: res } = await getUserChannels()
        // this.channels = res.data.channels
        let tempChannels = []
        if (this.$store.state.user) {
          // 已登录，请求获取用户频道列表
          const { data: res } = await getUserChannels()
          tempChannels = res.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const loaclChannels = getItem('NEWSINFO_CHANNELS')
          // 有，拿来使用
          if (loaclChannels) {
            tempChannels = loaclChannels
          } else {
            const { data: res } = await getUserChannels()
            tempChannels = res.data.channels
          }
          // 没有，请求获取默认频道列表
        }
        this.channels = tempChannels
      } catch (error) {
        this.$toast('获取用户列表失败')
      }
    },
    onPushChannel(channel) {
      this.channels.push(channel)
    },
    onUpdateActive(index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
  // 在页面离开时记录滚动位置
  // beforeRouteLeave(to, from, next) {
  //   this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  //   next()
  // },
  // 进入该页面时，用之前保存的滚动位置赋值
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     document.body.scrollTop = vm.scrollTop
  //   })
  // }
}
</script>

<style scoped lang="less">
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      .iconfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
      z-index: 1;
    }
  }
}
</style>
