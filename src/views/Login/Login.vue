<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <van-icon name="arrow-left" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- 登录表单 -->
    <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://vant-contrib.gitee.io/vant/v2/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
          如果验证通过，会触发 submit 事件
          如果验证失败，不会触发 submit
    -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field type="number" maxlength="11" v-model="user.mobile" name="mobile" placeholder="请输入手机号" :rules="userFormRules.mobile">
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field type="number" maxlength="6" v-model="user.code" name="code" placeholder="请输入验证码" :rules="userFormRules.code">
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down :time="1000 * 5" v-if="isCountDownShow" format=" ss 秒" @finish="isCountDownShow = false" />
          <van-button class="send-sms-btn" round size="small" type="default" native-type="button" @click="onSendSms" v-else>发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-button-wrap">
        <van-button class="login-btn" round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginPage',
  data() {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user

      // 2.表单验证
      this.$toast.loading({
        message: '加载中...', // 提示消息
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0则持续展示
      })

      // 3.提交表单请求登录
      try {
        // const res = await login(user)
        // console.log(res)
        const { data } = await login(user)
        // console.log('登录成功', data)
        this.$store.commit('setUser', data.data)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功')
        // back 的方式不严谨，后面将功能优化的时候再说
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms() {
      console.log('onSendSms')
      // 1. 校验手机号
      try {
        // validate() 中不传参数就是验证整个表单，这里只需要验证mobile
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true

      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 20px;
    color: #666;
  }
  .van-button--small {
    padding: 0;
  }
  .login-button-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
