import { CliProps } from '../types';
import webpack from 'webpack';
import path from 'path';
import chalk from 'chalk';
const WebpackDevServer = require('webpack-dev-server');
const generateConfig = require('../config/webpack.config.js');


export default (props: CliProps) => {
  const env = 'development';
  const config = generateConfig(env);
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, {
    contentBase: path.resolve(process.cwd(), 'dist'),
    compress: true,
    open: true,
    stats: {
      colors: true
    }
  });

  devServer.listen(9700, 'localhost', () => {
    console.log(`${chalk.green(props.name, 'is on http://localhost:9700')}`)
  })
};
