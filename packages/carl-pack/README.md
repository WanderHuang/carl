# carl打包管理

- 底层技术
  - webpack 4
  - less
  - commander
  - typescript

通过封装一个基于webpack的打包工具，同时提供给用户自定义配置的能力，完成一个较完整的`ts + react + less`项目打包方案的整合。

## 使用方式

只需要很少的配置就可以完成一个项目的打包

- `.carlrc.js`

```js
const path = require('path');

module.exports = (env) => {
  const isProd = env === 'production';
  // 除了这些配置外，其他配置支持扩展plugins等
  return {
    publicPath: '/',
    // 自定义文件名
    filename: `[name]/js/[name].[${isProd ? 'contenthash': 'hash'}:8].js`,
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
      index: 'index.html',
      port: 9600,
      hot: true,
      historyApiFallback: {
        rewrites: [
          {
            from: /.*/g,
            to: '/'
          }
        ]
      },
    },
  }
}
```

- 其他

推荐采用的目录结构，可以在`carl-invoker`内获取到
