const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/t3/' : '/',
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
  }
}
