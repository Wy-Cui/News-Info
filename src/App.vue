<template>
  <div id="app">
    <router-view />
    <!--页面返回不刷新-->
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less"></style>
