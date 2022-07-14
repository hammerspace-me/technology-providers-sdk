import axios from 'axios'

import Provider, { Pipeline } from '@/provider'

import icon from './icon.png'
import { CryptoAvatarsApiResponse, CryptoAvatarsConfig } from './types'

export default new Provider<CryptoAvatarsConfig>(
  'crypto-avatars',
  'CryptoAvatars',
  'CryptoAvatar',
  '3D avatars as NFTs for use across multiple virtual worlds',
  icon,
  new Pipeline<CryptoAvatarsConfig>()
    .web3('eth_requestAccounts', [], (result: string[]) => result[0])
    .transform<CryptoAvatarsApiResponse[]>(async function () {
      // @ts-ignore
      const { data } = await axios.get<CryptoAvatarsApiResponse[]>(
        `${this.config.apiUrl}/nfts/avatars/${
          this.config.address || this.aggregate
        }?skip=0&limit=20`,
        {
          headers: {
            'API-KEY': this.config.apiKey,
            accept: 'application/json',
          },
        }
      )
      return data
    })
    .select({
      format({ metadata: { asset } }) {
        return { avatar: { format: 'vrm', type: 'humanoid', uri: asset } }
      },
      image({ metadata: { image } }) {
        return image
      },
      name({ metadata: { name } }) {
        return name
      },
    })
    .result(),
  {
    config: {
      address: { type: 'String' },
      apiKey: { required: true, type: 'String' },
      apiUrl: { default: 'https://api.cryptoavatars.io/v1', type: 'String' },
    },
    purchaseLink: 'https://cryptoavatars.io/market',
  }
)
