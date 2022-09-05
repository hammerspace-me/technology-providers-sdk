import axios from 'axios'

import Provider, { Pipeline, PipelineResponse } from '@/provider'
import { FileFormat } from '@/types'
import { getExtension, isUrl, replaceExtension } from '@/utils'

import icon from './icon.svg'

export interface ReadyPlayerMeMetadata {
  bodyType: string
  outfitGender: string
  outfitVersion: number
}

export interface ReadyPlayerMeConfig {
  gateway: string
}

export default new Provider<ReadyPlayerMeConfig>(
  'ready-player-me',
  'ReadyPlayerMe',
  'RPM Avatar',
  'Create your avatar and explore virtual worlds with one identity',
  icon,
  new Pipeline<ReadyPlayerMeConfig>()
    .iframe<PipelineResponse>(
      function () {
        return `https://${this.config.gateway}.readyplayer.me`
      },

      async function (message) {
        if (!isUrl(message))
          throw new Error('Result provided is not a valid URL')
        const version = Math.floor(Math.random() * 100000) // We use this to cache-bust on the client side
        const source = `${message}?v=${version}`
        const extension = getExtension(source) as FileFormat
        const metadataUri = replaceExtension(source, 'json')

        const {
          data: { outfitGender },
        } = await axios.get<ReadyPlayerMeMetadata>(metadataUri)

        return {
          source,
          type:
            outfitGender === 'masculine' ? 'humanoid-male' : 'humanoid-female',
          fileFormat: extension,
          bodyType: 'full-body',
        }
      }
    )
    .result(),
  {
    config: {
      /** TODO: Replace this with a Bkpk gateway */
      gateway: { default: 'mona', type: 'String' },
    },
  }
)
