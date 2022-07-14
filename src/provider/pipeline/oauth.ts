export type OauthInput<TContext, TQuery, TResponse> = [
  redirect: (this: TContext, callback: string) => string,
  callbackQueryHandler: (this: TContext, query: TQuery) => Promise<TResponse>
]

export type OauthResponse = OauthResponseTyped<any, any, any>

export type OauthResponseTyped<TContext, TQuery, TResponse> = {
  redirect: (this: TContext, callback: string) => string
  callbackQueryHandler: (query: TQuery) => Promise<TResponse>
  type: 'oauth'
}

const oauthStage = function <TContext, TQuery, TResponse>(
  ...args: OauthInput<TContext, TQuery, TResponse>
): OauthResponseTyped<TContext, TQuery, TResponse> {
  const [redirect, callbackQueryHandler] = args
  return {
    redirect,
    callbackQueryHandler,
    type: 'oauth',
  }
}

export default oauthStage
