import commander from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import commandSet from './config/commands';
import commandService from './service/commandService';

let cmd;

const cli = new commander.Command(pkg.name)
  .version(pkg.version)
  .arguments('<command>')
  .usage(`${chalk.green('<command>')} [options]`)
  .action((command) => (cmd = command))
  .option('--verbose', 'print details')
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`exp:      ${chalk.green(pkg.name)} build`);
    console.log(`exp:      ${chalk.green(pkg.name)} start`);
  })
  .parse(process.argv);

if (!cmd || !commandSet.has(cmd)) {
  console.log(`Commands needed, current \`${cmd}\` is not support`);
  console.log(`${chalk.green(pkg.name)} --help`);
  console.log(`      - to get more infomations`);
  process.exit(1);
}

commandService(cmd, {
  verbose: cli.verbose,
  name: pkg.name,
  version: pkg.version
});
