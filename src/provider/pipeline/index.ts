import { FileFormat } from '@/types'

import iframeStage, { IframeInput, IframeResponse } from './iframe'
import oauthStage, { OauthInput, OauthResponse } from './oauth'
import web3Stage, {
  Web3Input,
  Web3Response,
  JsonRpcApi,
  Web3ResponseTyped,
} from './web3'
import transformStage, { TransformInput, TransformResponse } from './transform'
import selectStage, { SelectInput, SelectResponse } from './select'
import resultStage, { ResultInput, ResultResponse } from './result'

import Provider from '../provider'

export type PipelineStage =
  | Web3Response
  | TransformResponse
  | SelectResponse
  | ResultResponse
  | IframeResponse
  | OauthResponse

export interface PipelineResponse<TMetadata> {
  uri: string
  format: FileFormat
  type: 'humanoid'
  metadata: TMetadata extends TMetadata ? TMetadata : never
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
  TMetadata = unknown,
  TAggregate = unknown,
  TContext = PipelineFunctionContext<TConfig, TAggregate>
> {
  private pipeline: PipelineStage[] = []

  constructor(pipeline?: PipelineStage[]) {
    if (pipeline) this.pipeline = pipeline
  }

  web3 = <
    M extends keyof JsonRpcApi,
    P extends Parameters<JsonRpcApi[M]>,
    R = ReturnType<JsonRpcApi[M]>
  >(
    ...args: Web3Input<M, P, R>
  ) =>
    this.addStage<Web3ResponseTyped<TContext, M, P, R>>(
      web3Stage<TContext, M, P, R>(...args)
    )

  transform = <TResponse>(
    ...args: TransformInput<TContext, TAggregate, TResponse>
  ) =>
    this.addStage<TResponse>(
      transformStage<TContext, TAggregate, TResponse>(...args)
    )

  iframe = <TResponse>(...args: IframeInput<TContext, TResponse>) =>
    this.addStage<TResponse>(iframeStage<TContext, TResponse>(...args))

  select = <TResponse = PipelineResponse<TMetadata>>(
    args: SelectInput<TContext, TAggregate, TResponse>
  ) =>
    this.addStage<TResponse>(selectStage<TContext, TAggregate, TResponse>(args))

  oauth = <TQuery, TResponse>(
    ...args: OauthInput<TContext, TQuery, TResponse>
  ) =>
    this.addStage<TResponse>(oauthStage<TContext, TQuery, TResponse>(...args))

  result = (
    args?: ResultInput<TContext, TAggregate, PipelineResponse<TMetadata>>
  ): PipelineStage[] =>
    this.addStage(
      resultStage<TContext, TAggregate, PipelineResponse<TMetadata>>(args)
    ).pipeline

  private addStage = <TNewAggregate>(
    newStage: PipelineStage
  ): Pipeline<TConfig, TMetadata, TNewAggregate> => {
    const pipeline = [...this.pipeline, newStage]
    return new Pipeline<TConfig, TMetadata, TNewAggregate>(pipeline)
  }
}

export default Pipeline
