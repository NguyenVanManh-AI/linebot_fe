const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://192.168.1.120:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
