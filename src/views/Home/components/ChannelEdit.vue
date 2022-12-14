<template>
  <div class="channel-edit">
    <van-cell>
      <template #title>
        <div class="title-text">我的频道</div>
      </template>
      <van-button class="edit-btn" plain type="danger" round size="mini" @click="isEdit = !isEdit">
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMyChannelClick(channel, index)">
        <template #icon>
          <!-- includes()方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false -->
          <van-icon name="clear" v-show="isEdit && !fixChannels.includes(channel.id)"> </van-icon>
        </template>
        <template #text>
          <!--
            class 样式绑定语法
            一个对象：
              属性名key ：CSS Class 类名
              属性值value ：布尔值，true 作用类名，false 不作用类名
          -->
          <span class="text" :class="{ active: index === active }"> {{ channel.name }} </span>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell>
      <template #title>
        <div class="title-text">频道推荐</div>
      </template>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" icon="plus" @click="onAddChannel(channel)">
        <template #text>
          <span class="text"> {{ channel.name }} </span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fixChannels: [0] // 固定频道，不允许删除，数组中的是 channel.id
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel(channel) {
      // console.log(channel)
      this.$emit('pushChannel', channel)
      // 关闭这一行的 Eslit 校验，就可以修改props中的数据且不报错，那么上面这行代码就可以用下面这行代码替换
      // this.myChannels.push(channel) // eslint-disable-line

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
        } catch (error) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('NEWSINFO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不能删除
        if (this.fixChannels.includes(channel.id)) {
          return false
        }

        // 2. 删除频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        this.myChannels.splice(index, 1) // eslint-disable-line

        // 3. 如果删除的是激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          // 让激活频道的索引减一
          this.$emit('update-active', this.active - 1, true)
        }

        // 4. 处理持久化（单独抽取到外面的方法中，在这里调用）
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('NEWSINFO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__content {
      background-color: #f4f5f6;
      padding: 0;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .text {
          font-size: 28px;
        }
      }
    }
  }
}
</style>
