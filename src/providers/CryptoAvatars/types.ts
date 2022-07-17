export interface CryptoAvatarsConfig {
  address?: string
  apiKey: string
  apiUrl: string
}

export interface CryptoAvatarsApiResponse {
  metadata: {
    asset: string
    image: string
    name: string
  }
}
