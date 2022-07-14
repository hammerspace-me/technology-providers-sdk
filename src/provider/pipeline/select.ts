type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export interface SelectInput<TContext, TInput, TOutput> {
  image: (this: TContext, item: ArrayElement<TInput>) => string
  name: (this: TContext, item: ArrayElement<TInput>) => string
  format?: (this: TContext, item: ArrayElement<TInput>) => TOutput
}

export interface SelectResponseTyped<TContext, TInput, TOutput> {
  image: (this: TContext, item: ArrayElement<TInput>) => string
  name: (this: TContext, item: ArrayElement<TInput>) => string
  format?: (this: TContext, item: ArrayElement<TInput>) => TOutput
  type: 'select'
}

export type SelectResponse = SelectResponseTyped<any, any, any>

const selectStage = <TContext, TInput, TOutput = TInput>({
  image,
  name,
  format,
}: SelectInput<TContext, TInput, TOutput>): SelectResponseTyped<
  TContext,
  TInput,
  TOutput
> => ({
  image,
  name,
  format,
  type: 'select',
})

export default selectStage
