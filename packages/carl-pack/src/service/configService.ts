import resolve from '../utils/resolvePath';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';

// html
const HtmlWebpackPlugin = require('html-webpack-plugin');

const service = (cwd: string, env: string) => {
  const configFile = '.carlrc.js';
  const isProd = env === 'production';

  const getConfig = require(resolve(cwd, configFile));
  const config = getConfig(env);

  const templates = fs.readdirSync(resolve(cwd, 'src/template'));
  const views = fs.readdirSync(resolve(cwd, 'src/view'));

  // 根据用户定义选择配置
  // 对外暴露的api
  const defaultConfig = {
    // 入口
    entry: views
      .filter((file) => /\.tsx?$/.test(path.extname(file)))
      .map((file) => [path.parse(file).name, resolve(cwd, 'src/view', file)])
      .reduce((entryConfig, [key, value]) => {
        entryConfig[key] = value;
        return entryConfig;
      }, {}),
    // 资源路径
    publicPath: '/',
    // 源码方式配置到devtools
    sourceMap: 'source-map',
    // 输出目录
    outDir: 'dist',
    // 输出文件名
    filename: isProd
      ? '[name]/js/[name].[contenthash:8].js'
      : '[name]/js/bundle.js',
    // 输出模块名
    chunkFilename: isProd
      ? '[name]/js/[name].[contenthash:8].chunk.js'
      : '[name]/js/[name].chunk.js',
    // 模块内路径别名
    resolveAlias: {
      'src/': '@/',
    },
    // 图片路径设置
    imageFilename: '[name]/images/[name].[hash:8].[ext]',
    // 文件路径设置
    otherFilename: '[name]/media/[name].[hash:8].[ext]',
    // css文件路径
    cssFilename: '[name]/css/[name].[contenthash:8].css',
    // css模块路径
    cssChunkFilename: '[name]/css/[name].[contenthash:8].chunk.css',
  };

  let defaultPlugins: any[] = [];

  if (templates.length === 0) {
    console.log(chalk.red('Cannot find templates'));
  } else {
    templates
      .filter((file) => path.extname(file) === '.html')
      .forEach((file) => {
        defaultPlugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            template: resolve('src/template', file),
            filename: file,
            chunks: [path.parse(file).name],
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          })
        );
      });
  }

  return Object.assign({}, { plugins: defaultPlugins }, defaultConfig, config, {
    devServer: {
      compress: config?.devServer?.compress || true,
      open: config?.devServer?.open || true,
      stats: config?.devServer?.stats || {
        colors: true,
      },
      port: config?.devServer?.port || 9700,
      host: config?.devServer?.host || '0.0.0.0',
    },
  });
};

export default service;
