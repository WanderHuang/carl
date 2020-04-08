const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (...pathname) => path.resolve(...pathname);
const cwd = process.cwd();

const generate = (env) => {
  const isProd = env === 'production';
  console.log(isProd, resolve(cwd, 'dist'), resolve(cwd, 'src/index.ts'))
  return {
    mode: isProd ? 'production' : 'development',
    bail: isProd,
    // @need-config
    devtool: isProd ? false : 'source-map',
    // @need-config
    entry: [
      resolve(cwd, 'src/index.ts')
    ],
    output: {
      path: isProd ? resolve(cwd, 'dist') : undefined,
      pathinfo: !isProd,
      filename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
      chunkFilename: isProd ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      // @need-config
      publicPath: '/',

    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            keep_classnames: !isProd,
            keep_fnames: !isProd,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            }
          },
          sourceMap: !isProd
        })
      ],
      splitChunks: {
        chunks: 'all',
        name: false
      },
      runtimeChunk: {
        name: entry => `runtime-${entry.name}`
      }
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        'src/': '@/'
      },
    },
    resolveLoader: {},
    module: {
      strictExportPresence: true,
      rules: [
        {
          parser: {
            requireEnsure: false
          }
        },
        {
          test: /\.(ts|tsx|js|jsx)/,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('eslint-loader'),
              options: {
                cache: true,
                formatter: require.resolve('eslint-friendly-formatter'),
                resolvePluginsRelativeTo: __dirname,
                baseConfig: {
                  extends: [
                    require.resolve('eslint-config-react-app')
                  ]
                },
                useEslintrc: true
              }
            }
          ],
          include: resolve('src')
        },
        {
          oneOf: [
            {
              test: /\.(ts|tsx|js|jsx)/,
              include: resolve('src'),
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  require.resolve('babel-preset-react-app')
                ]
              },
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: resolve('src/template/index.html'),
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
        }
      })
    ]
  };

}
module.exports =  generate;