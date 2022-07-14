import { FileFormat } from '@/types'

export interface MeebitsConfig {
  format: FileFormat
}

export interface OAuthCallbackQuery {
  account: string
  accessToken: string
}

export interface OwnerFiles {
  ownerDownloadFBX: string
  ownerDownloadGLB: string
  ownerDownloadVOX: string
  ownerDownloadVRM: string
}

export interface MeebitsApiEntry extends OwnerFiles {
  imageUrl: string
  index: number | string
  type: 'HUMAN'
}

export interface MeebitsApiResponse {
  data: {
    meebits: MeebitsApiEntry[]
  }
}

export interface FormattedMeebitResponse {
  avatar: {
    format: FileFormat
    type: 'humanoid' | null
    uri: string
  }
  imageUrl: string
  index: string | number
}
