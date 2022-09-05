import { FileFormat } from '@/types'

import Provider from '../provider'

import iframeStage, { IframeInput, IframeResponse } from './iframe'
import oauthStage, { OauthInput, OauthResponse } from './oauth'
import resultStage, { ResultInput, ResultResponse } from './result'
import selectStage, { SelectInput, SelectResponse } from './select'
import transformStage, { TransformInput, TransformResponse } from './transform'
import web3Stage, { Web3Input, Web3Response, JsonRpcApi } from './web3'

export type PipelineStage =
  | Web3Response
  | TransformResponse
  | SelectResponse
  | ResultResponse
  | IframeResponse
  | OauthResponse

export interface PipelineResponse {
  source: string
  type: 'humanoid' | 'humanoid-male' | 'humanoid-female'
  fileFormat: FileFormat
  reference?: string
  bodyType?: 'full-body' | 'half-body'
  boneStructure?: {
    head?: string
  }
}

export interface PipelineFunctionContext<TConfig, TAggregate> {
  aggregate: TAggregate
  config: TConfig
  debug: (...args: unknown[]) => void
  provider: Provider
  store: Record<string, unknown>
}

class Pipeline<
  TConfig,
  TAggregate = unknown,
  TContext = PipelineFunctionContext<TConfig, TAggregate>
> {
  private readonly pipeline: PipelineStage[] = []

  constructor(pipeline?: PipelineStage[]) {
    if (pipeline) this.pipeline = pipeline
  }

  web3 = <
    M extends keyof JsonRpcApi,
    P extends Parameters<JsonRpcApi[M]>,
    R = ReturnType<JsonRpcApi[M]>
  >(
    ...args: Web3Input<M, P, R>
  ) => this.addStage<R>(web3Stage<TContext, M, P, R>(...args))

  transform = <TResponse>(
    ...args: TransformInput<TContext, TAggregate, TResponse>
  ) =>
    this.addStage<TResponse>(
      transformStage<TContext, TAggregate, TResponse>(...args)
    )

  iframe = <TResponse>(...args: IframeInput<TContext, TResponse>) =>
    this.addStage<TResponse>(iframeStage<TContext, TResponse>(...args))

  select = <TResponse = PipelineResponse>(
    args: SelectInput<TContext, TAggregate, TResponse>
  ) =>
    this.addStage<TResponse>(selectStage<TContext, TAggregate, TResponse>(args))

  oauth = <TQuery, TResponse>(
    ...args: OauthInput<TContext, TQuery, TResponse>
  ) =>
    this.addStage<TResponse>(oauthStage<TContext, TQuery, TResponse>(...args))

  result = (
    args?: ResultInput<TContext, TAggregate, PipelineResponse>
  ): PipelineStage[] =>
    this.addStage(resultStage<TContext, TAggregate, PipelineResponse>(args))
      .pipeline

  private readonly addStage = <TNewAggregate>(
    newStage: PipelineStage
  ): Pipeline<TConfig, TNewAggregate> => {
    const pipeline = [...this.pipeline, newStage]
    return new Pipeline<TConfig, TNewAggregate>(pipeline)
  }
}

export default Pipeline
