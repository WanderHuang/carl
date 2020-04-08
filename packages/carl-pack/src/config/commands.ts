import fs from 'fs-extra';
import path from 'path';
import build from '../commands/build';
import start from '../commands/start';

const service = {
  build,
  start
}

const list = fs
  .readdirSync(path.resolve(__dirname, '../commands'))
  .filter(name => name.endsWith('.d.ts'))
  .map(name => path.basename(name, '.d.ts'));

export default list.reduce((cmd, name) => {
  cmd.add(name);
  return cmd;
}, new Set());


export const CommandsMap = list.reduce((obj, name) => {
  obj[name] = service[name];
  return obj;
}, {})
