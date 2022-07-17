import axios from 'axios'

import Provider, { Pipeline } from '@/provider'

import { FORMATS } from '@/utils'

import formatMetadata from './formatMetadata'
import icon from './icon.svg'
import {
  FormattedMeebitResponse,
  MeebitsConfig,
  OAuthCallbackQuery,
  MeebitsApiResponse,
} from './types'

export default new Provider(
  'meebits',
  'Meebits',
  'Meebit',
  '20,000 unique 3D voxel characters',
  icon,
  new Pipeline<MeebitsConfig>()
    .oauth<OAuthCallbackQuery, FormattedMeebitResponse[]>(
      callback =>
        `https://meebits.larvalabs.com/meebits/apiAccessRequest?callbackUrl=${callback}`,
      async function (query) {
        const { account, accessToken } = query
        const {
          data: {
            data: { meebits = [] },
          },
        } = await axios.get<MeebitsApiResponse>(
          `https://meebits.larvalabs.com/api/v1/account/${account}?accessToken=${accessToken}`
        )
        return meebits.map(meebit =>
          formatMetadata(meebit, accessToken, this.config.format)
        )
      }
    )
    .select({
      image: ({ imageUrl }) => imageUrl,
      name: ({ index }) => `Meebit ${index}`,
      format: ({ avatar }) => avatar,
    })
    .result(),
  {
    config: {
      format: {
        default: 'vrm',
        type: 'String',
        validate: (type: string) => FORMATS.includes(type),
      },
    },
  }
)
