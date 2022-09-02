<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item, index) in searchHistories" :key="index" :title="item" @click="onSearchItemClick(item, index)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    // props 数据
    // props 是受父组件数据影响的
    //   如果是普通数据（数字、字符串、布尔值）绝对不能修改
    //   即便改了也不会传导给父组件
    //
    //   如果是引用类型数据（数组、对象）
    //     可以修改，例如：[].push(xxx)    对象.xxx = xxx
    //     不能重新赋值， xxx = []
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    onSearchItemClick(item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1) // eslint-disable-line
      } else {
        // 否则执行搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
