import { PipelineResponse } from '@/provider/pipeline'
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
  avatar: PipelineResponse
  imageUrl: string
  index: string | number
}
