import webpack from 'webpack';
const generateConfig = require('../config/webpack.config.js');
import chalk from 'chalk';
import { CliProps } from '../types';
import rimraf from 'rimraf';

export default (props: CliProps) => {
  const env = 'production';
  const config = generateConfig(env);
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
  const compiler = webpack(config);

  const dir = config?.output?.path;

  function run() {
    compiler.run((err, _stats) => {
      if (err) {
        console.log(chalk.green(`${props.name} build`), chalk.red('failed'));
        process.exit(1);
      } else {
        console.log(chalk.green(`${props.name} build success`));
      }
    });
  }

  if (dir) {
    rimraf(dir, (err) => {
      if (!err) {
        run();
      }
    });
  } else {
    run();
  }
};
