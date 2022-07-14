export type TransformInput<TContext, TInput, TResponse> = [
  transform: (this: TContext, aggregate: TInput) => Promise<TResponse>
]

export type TransformResponse = TransformResponseTyped<any, any>

export type TransformResponseTyped<TInput, TResponse> = {
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
