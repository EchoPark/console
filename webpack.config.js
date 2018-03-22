const path = require('path')

module.exports = function (webpackConfig, env) {
  const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, '')
  ]
  webpackConfig.module.loaders.forEach(loader => {
    if (loader.test && typeof loader.test.test === 'function' && loader.test.test('.svg')) {
      loader.exclude = svgDirs
    }
  })
  webpackConfig.module.loaders.unshift({
    test: /\.(svg)$/i,
    loader: 'svg-sprite',
    include: svgDirs
  })
  return webpackConfig
}
