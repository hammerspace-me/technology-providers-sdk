export interface ResultResponseTyped<TContext, TInput, TOutput> {
  format?: (this: TContext, item: TInput) => TOutput
  type: 'result'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultResponse = ResultResponseTyped<any, any, any>

export type ResultInput<TContext, TInput, TOutput> = (
  this: TContext,
  item: TInput
) => TOutput

const resultStage = <TContext, TInput, TOutput = TInput>(
  format?: ResultInput<TContext, TInput, TOutput>
): ResultResponseTyped<TContext, TInput, TOutput> => ({
  format,
  type: 'result',
})

export default resultStage
