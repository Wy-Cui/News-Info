const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// module.exports = {
//   devServer: {
//     proxy: {
//       '/app': {
//         target: 'http://toutiao.itheima.net',
//         // ws: true,
//         changeOrigin: true
//         // pathRewrite: {
//         //   '^/v1_0': ''
//         // }
//       }
//     }
//   }
// }
