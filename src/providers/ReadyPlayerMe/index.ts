import axios from 'axios'

import Provider, { Pipeline, PipelineResponse } from '@/provider'
import { getExtension, isUrl, replaceExtension } from '@/utils'

import { ReadyPlayerMeConfig, ReadyPlayerMeMetadata } from './types'
import icon from './icon.svg'
import { FileFormat } from '@/types'

export default new Provider<ReadyPlayerMeConfig>(
  'ready-player-me',
  'ReadyPlayerMe',
  'RPM Avatar',
  'Create your avatar and explore virtual worlds with one identity',
  icon,
  new Pipeline<ReadyPlayerMeConfig, ReadyPlayerMeMetadata>()
    .iframe<PipelineResponse<ReadyPlayerMeMetadata>>(
      function () {
        return `https://${this.config.gateway}.readyplayer.me`
      },
      async function (message) {
        if (!isUrl(message))
          throw new Error('Result provided is not a valid URL')
        const version = Math.floor(Math.random() * 100000) // We use this to cache-bust on the client side
        const avatarUri = `${message}?v=${version}`
        const extension = getExtension(avatarUri) as FileFormat
        const metadataUri = replaceExtension(avatarUri, 'json')

        const { data: metadata } = await axios.get<ReadyPlayerMeMetadata>(
          metadataUri
        )

        return {
          format: extension,
          type: 'humanoid',
          uri: avatarUri,
          metadata,
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

export { ReadyPlayerMeMetadata }
