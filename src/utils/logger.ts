export interface IShowLog {
  context: string;
  data: any;
}

export const showLog = (ctx: IShowLog) => {
  console.debug(`Log from ${ctx.context}: ${JSON.stringify(ctx.data)}`);
};
