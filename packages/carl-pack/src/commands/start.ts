import { CliProps } from '../types';
import webpack from 'webpack';
import resolve from '../utils/resolvePath';
import chalk from 'chalk';
const WebpackDevServer = require('webpack-dev-server');
const generateConfig = require('../config/webpack.config.js');

export default (props: CliProps) => {
  const env = 'development';
  const { devServer: devConfig, ...config } = generateConfig(env);
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
  const compiler = webpack(config);

  const { host, port, ...devCompiler } = devConfig;

  const devServer = new WebpackDevServer(compiler, {
    contentBase: resolve(process.cwd(), 'src'),
    ...devCompiler,
  });

  devServer.listen(port, host, () => {
    console.log(`${chalk.green(props.name, `is on http://${host}:${port}`)}`);
  });
};
