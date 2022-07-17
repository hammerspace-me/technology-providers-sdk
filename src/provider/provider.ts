import { ProviderError } from '@/errors'

import { PipelineStage } from './pipeline'

export interface ConfigOption<T> {
  type: 'String' | 'Boolean' | 'Number'
  required?: boolean
  validate?: (value: T) => boolean
  default?: T | (() => T)
}

export type ProviderConfig<ConfigT> = {
  [K in keyof ConfigT]: ConfigOption<ConfigT[K]>
}

export interface StageFunctionContext<ProviderT, ConfigT> {
  aggregate: unknown
  config: ConfigT
  debug: (...args: unknown[]) => void
  provider: ProviderT
  store: Record<string, unknown>
}

class Provider<ConfigT = undefined> {
  public id: string
  public title: string
  public name: string
  public description: string
  public icon: File
  public purchaseLink: string | null
  public configurationRequirements: ProviderConfig<ConfigT> | null = null
  public pipeline: PipelineStage[]

  private _config: ConfigT | null = null

  constructor(
    id: string,
    title: string,
    name: string,
    description: string,
    icon: File,
    pipeline: PipelineStage[],
    {
      config,
      purchaseLink,
    }: {
      config?: ProviderConfig<ConfigT> &
        (ConfigT extends undefined
          ? 'You must pass in a configuration generic'
          : ProviderConfig<ConfigT>)
      purchaseLink?: string
    } = {}
  ) {
    this.id = id
    this.title = title
    this.name = name
    this.description = description
    this.icon = icon
    this.pipeline = pipeline
    this.configurationRequirements = config ?? null
    this.purchaseLink = purchaseLink ?? null
  }

  public configure(
    config: ConfigT &
      (ConfigT extends undefined
        ? 'You must pass in a configuration generic'
        : ConfigT)
  ): void {
    if (!this.configurationRequirements || !config) return
    const requirements = Object.entries(
      this.configurationRequirements
    ) as Array<[string, ConfigOption<unknown>]>

    // @ts-expect-error This is properly typed
    this._config = requirements.reduce<ConfigT>(
      (acc, [key, { default: defaultValue, required, validate }]) => {
        const value = config[key as keyof ConfigT]

        if (validate && value && !validate(value))
          throw new ProviderError(`${this.id}${key} is invalid`)

        const valueIsSet = value !== undefined && value !== null

        if (required && !valueIsSet)
          throw new ProviderError(`${this.id}${key} is required in your config`)

        acc[key as keyof ConfigT] = valueIsSet
          ? value
          : typeof defaultValue === 'function'
          ? defaultValue()
          : defaultValue

        return acc
      },
      // @ts-expect-error This is properly typed
      {}
    )
  }

  protected get config(): ConfigT {
    if (!this._config)
      throw new ProviderError('The provider must be configured first')
    return this._config
  }
}

export default Provider
