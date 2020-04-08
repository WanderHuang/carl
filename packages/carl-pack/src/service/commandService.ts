import { CommandsMap } from '../config/commands';
import { CliProps, ICommandService } from '../types';

export default (cmd: string, props: CliProps) => {
  const service: ICommandService = CommandsMap[cmd];

  if (service) {
    service(props);
  }
};
