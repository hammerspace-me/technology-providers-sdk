export type IframeInput<TContext, TResponse> = [
  src: string | ((this: TContext, callback: string) => string),
  messageHandler: (this: TContext, message: string) => Promise<TResponse>
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IframeResponse = IframeResponseTyped<any, any>

export interface IframeResponseTyped<TContext, TResponse> {
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
