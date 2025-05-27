interface ICreateUrl {
  baseUrl: string;
  path: string;
}

export function createUrl(ctx: ICreateUrl) {
  return `${ctx.baseUrl}${ctx.path}`;
}
