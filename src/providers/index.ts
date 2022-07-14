import Provider from '@/provider'

import CryptoAvatars from './CryptoAvatars'
import Meebits from './Meebits'
import ReadyPlayerMe from './ReadyPlayerMe'

const providers = [CryptoAvatars, Meebits, ReadyPlayerMe]

export default providers.reduce<Record<string, Provider<unknown>>>(
  (acc, provider) => ({ ...acc, [provider.id]: provider }),
  {}
)
