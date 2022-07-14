export type IframeInput<TContext, TResponse> = [
  src: string | ((this: TContext, callback: string) => string),
  messageHandler: (this: TContext, message: string) => Promise<TResponse>
]

export type IframeResponse = IframeResponseTyped<any, any>

export type IframeResponseTyped<TContext, TResponse> = {
  src: string | ((this: TContext, callback: string) => string)
  messageHandler: (message: string) => Promise<TResponse>
  type: 'iframe'
}

const iframeStage = function <TContext, TResponse>(
  ...args: IframeInput<TContext, TResponse>
): IframeResponseTyped<TContext, TResponse> {
  const [src, messageHandler] = args
  return {
    src,
    messageHandler,
    type: 'iframe',
  }
}

export default iframeStage
