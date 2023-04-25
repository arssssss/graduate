const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 15253,
    // 配置代理
    proxy: {
      '/task': {
        // 以 “/api” 开头的url代理到下边的target属性的值
        target: 'http://localhost:8080',
        changeOrigin: true, // 是否允许跨域：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // ws: true, // 是否启用websockets
        pathRewrite: {

        },
        ws:false
      },
      '/customer': {
        // 以 “/api” 开头的url代理到下边的target属性的值
        target: 'http://localhost:8080',
        changeOrigin: true, // 是否允许跨域：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // ws: true, // 是否启用websockets
        pathRewrite: {

        },
        ws:false
      },
      '/vrp': {
        // 以 “/api” 开头的url代理到下边的target属性的值
        target: 'http://localhost:8080',
        changeOrigin: true, // 是否允许跨域：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // ws: true, // 是否启用websockets
        pathRewrite: {

        },
        ws:false
      },
      '/test': {
        // 以 “/api” 开头的url代理到下边的target属性的值
        target: 'http://localhost:8080',
        changeOrigin: true, // 是否允许跨域：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // ws: true, // 是否启用websockets
        pathRewrite: {

        },
        ws:false
      },
      '/amap': {
        target: 'https://restapi.amap.com/v3/geocode/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/amap': ''
        }
      },
    }
  }
})
