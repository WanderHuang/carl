const path = require('path');
module.exports = (env) => {
  const isProd = env === 'production';
  return {
    publicPath: '/',
    filename: '[name]/js/[name].[contenthash:8].js',
    chunkFilename: '[name]/js/[name].[contenthash:8].chunk.js',
    imageFilename: '[name]/images/[name].[hash:8].[ext]',
    otherFilename: '[name]/media/[name].[hash:8].[ext]',
    cssFilename: '[name]/css/[name].[contenthash:8].css',
    cssChunkFilename: '[name]/css/[name].[contenthash:8].chunk.css',
    // resolveAlias: {
    //   '@': path.resolve(__dirname, 'src'),
    // },
    // default dist
    outDir: 'dist',
    devServer: {
      index: 'user.html',
      port: 9600,
    }
  }
}