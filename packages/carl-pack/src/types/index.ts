export type CliProps = {
  verbose?: string;
  name?: string;
  version?: string;
}

export type ICommandService = (props: CliProps) => void