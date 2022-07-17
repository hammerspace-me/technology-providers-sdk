export type TransformInput<TContext, TInput, TResponse> = [
  transform: (this: TContext, aggregate: TInput) => Promise<TResponse>
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformResponse = TransformResponseTyped<any, any>

export interface TransformResponseTyped<TInput, TResponse> {
  transform: (aggregate: TInput) => Promise<TResponse>
  type: 'transform'
}

const transformStage = function <TContext, TInput, TResponse>(
  ...args: TransformInput<TContext, TInput, TResponse>
): TransformResponseTyped<TInput, TResponse> {
  const [transform] = args
  return {
    transform,
    type: 'transform',
  }
}

export default transformStage
