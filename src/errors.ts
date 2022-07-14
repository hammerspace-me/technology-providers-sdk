export class ProviderError extends Error {
  constructor(message: string) {
    super(`[ProviderError] ${message}`)
  }
}
