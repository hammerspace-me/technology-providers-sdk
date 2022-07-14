// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RpcRequest = (...args: any[]) => unknown

export type OnlyRpcRequestProperties<T> = {
  [K in keyof T]: T[K] extends T[K] ? RpcRequest : never
}

export class JsonRpcApi implements OnlyRpcRequestProperties<JsonRpcApi> {
  eth_requestAccounts!: (...args: void[]) => string[]
  eth_account!: (...args: void[]) => string[]
  personal_sign!: (...args: [string, string]) => string
  chainId!: (...args: void[]) => string
}

export type Web3Response = {
  method: string
  params: any[]
  format?: (args: any) => any
  type: 'web3'
}

export type Web3ResponseTyped<
  TContext,
  M extends keyof JsonRpcApi,
  P extends Parameters<JsonRpcApi[M]>,
  R = ReturnType<JsonRpcApi[M]>
> = {
  method: M
  params: P
  format: (this: TContext, args: ReturnType<JsonRpcApi[M]>) => R
  type: 'web3'
}

export type Web3Input<
  M extends keyof JsonRpcApi,
  P extends Parameters<JsonRpcApi[M]>,
  R = ReturnType<JsonRpcApi[M]>
> = [method: M, params: P, format?: (args: ReturnType<JsonRpcApi[M]>) => R]

const web3Stage = <
  TContext,
  M extends keyof JsonRpcApi,
  P extends Parameters<JsonRpcApi[M]>,
  R = ReturnType<JsonRpcApi[M]>
>(
  ...args: Web3Input<M, P, R>
): Web3ResponseTyped<TContext, M, P, R> => {
  const [method, params, format] = args
  return {
    method,
    params,
    format: format ? format : (v: ReturnType<JsonRpcApi[M]>): R => v as R,
    type: 'web3',
  }
}

export default web3Stage
