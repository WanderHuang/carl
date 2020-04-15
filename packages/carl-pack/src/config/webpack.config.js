import resolve from '../utils/resolvePath';

// 压缩
const TerserPlugin = require('terser-webpack-plugin');
// css提取
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css normalize
const postcssNormalize = require('postcss-normalize');
// 进度条
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 用户自定义配置
const configService = require('../service/configService').default;

const cwd = process.cwd();

// 生成基本配置
const generate = (env) => {
  const isProd = env === 'production';
  const {
    entry,
    publicPath,
    sourceMap,
    outDir,
    filename,
    chunkFilename,
    resolveAlias,
    imageFilename,
    otherFilename,
    cssFilename,
    cssChunkFilename,
    devServer,
    plugins,
  } = configService(cwd, env);

  return {
    mode: isProd ? 'production' : 'development',
    // 出错后退出
    bail: isProd,
    devtool: isProd ? false : sourceMap,
    entry,
    output: {
      // 开发环境不输出(被webpack dev server代理到内存了)
      path: isProd ? resolve(cwd, outDir) : undefined,
      pathinfo: !isProd,
      filename,
      chunkFilename,
      publicPath,
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: !isProd,
            keep_fnames: !isProd,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: !isProd,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      // runtimeChunk: {
      //   name: (entry) => `runtime-${entry.name}`,
      // },
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: resolveAlias,
    },
    resolveLoader: {},
    module: {
      strictExportPresence: true,
      rules: [
        // 解析器规则，禁用require.ensure
        {
          parser: {
            requireEnsure: false,
          },
        },
        // 预处理
        // eslint检测
        {
          test: /\.(ts|tsx|js|jsx)/,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('eslint-loader'),
              options: {
                cache: true,
                // 消息格式化
                formatter: require.resolve('eslint-friendly-formatter'),
                resolvePluginsRelativeTo: __dirname,
                baseConfig: {
                  // 继承自create-react-app的eslint规则
                  // 也可以自己写
                  extends: [require.resolve('eslint-config-react-app')],
                },
                useEslintrc: true,
              },
            },
          ],
          include: resolve('src'),
        },
        // 选择匹配的module来执行
        {
          oneOf: [
            // tsx/jsx处理
            // ts-loader: ts -> es6
            // babel-loader: ts -> es6 -> es5  &  polyfills  &  esnext
            {
              test: /\.(ts|tsx|js|jsx)/,
              include: resolve('src'),
              loader: require.resolve('babel-loader'),
              options: {
                // babel-loaader继承自create-react-app
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [require.resolve('babel-preset-react-app')],
              },
            },
            // url-loader 处理图片数据
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: imageFilename,
              },
            },
            // postcss: autoprefixer 类添加各个平台的头信息
            // css: css 文件
            // style: 把css转为js模块并注入style标签内
            // 模块化 本地代码
            {
              test: /\.(c|le)ss$/,
              exclude: [/node_modules/, /\.module\.css/, /\.module\.less/],
              use: getStyleLoaders(
                {
                  cssOptions: {
                    importLoaders: 1,
                    sourceMap: !isProd,
                  },
                  lessOptions: {
                    modifyVars: {},
                    javascriptEnabled: true,
                  },
                },
                {
                  isProd,
                  // @need-config
                  publicPath,
                }
              ),
              sideEffects: true,
            },
            // 可以模块化的样式
            {
              test: /\.(c|le)ss$/,
              use: getStyleLoaders(
                {
                  cssOptions: {
                    importLoaders: 1,
                    sourceMap: !isProd,
                    modules: true,
                  },
                  lessOptions: {
                    modifyVars: {},
                    javascriptEnabled: true,
                  },
                },
                {
                  isProd,
                  // @need-config
                  publicPath,
                }
              ),
            },
            // file-loader确保webpackdevserver能够给文件提供服务
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: otherFilename,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...plugins,
      isProd &&
        new MiniCssExtractPlugin({
          filename: cssFilename,
          chunkFilename: cssChunkFilename,
        }),
      new ProgressBarPlugin(),
    ].filter(Boolean),
    devServer
  };
};

/**
 * 获取样式的loader
 * @param {*}  css的options
 * @param {*} param1
 */
const getStyleLoaders = (
  { cssOptions, lessOptions },
  { isProd, publicPath }
) => {
  const loaders = [
    !isProd && require.resolve('style-loader'),
    isProd && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isProd,
        publicPath,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugin: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          postcssNormalize(),
        ],
        sourceMap: true,
      },
    },
    {
      loader: require.resolve('less-loader'),
      options: lessOptions,
    },
  ].filter(Boolean);

  return loaders;
};

module.exports = generate;
