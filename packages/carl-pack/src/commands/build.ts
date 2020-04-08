import webpack from 'webpack';
const generateConfig = require('../config/webpack.config.js')
import chalk from 'chalk';
import { CliProps } from '../types';

export default (props: CliProps) => {
  const env = 'production';
  const config = generateConfig(env);
  process.env.NODE_ENV = env
  process.env.BABEL_ENV = env
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    if (err) {
      console.log(chalk.green(`${props.name} build`), chalk.red('failed'))
      process.exit(1);
    } else {
      console.log(stats);
      console.log(chalk.green(`${props.name} build success`))
    }
  })
}