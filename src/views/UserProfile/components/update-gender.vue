<template>
  <div class="update-gender">
    <van-picker title="性别" show-toolbar :columns="columns" :default-index="value" @confirm="onConfirm" @cancel="$emit('close')" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      localGender: this.value,
      columns: ['男', '女']
    }
  },
  methods: {
    // 这里 value 即使用不到也要加，因为 index 必须是第二个参数
    async onConfirm(value, index) {
      // console.log(index)
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 0是男，女是1，所以要传索引
        const localGender = index

        await updateUserProfile({
          gender: localGender
        })

        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
