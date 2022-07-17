import { FileFormat } from '@/types'

import { FormattedMeebitResponse, MeebitsApiEntry, OwnerFiles } from './types'

const getFormatFilename = (format: FileFormat): keyof OwnerFiles => {
  const formats: Record<string, keyof OwnerFiles> = {
    fbx: 'ownerDownloadFBX',
    glb: 'ownerDownloadGLB',
    vox: 'ownerDownloadVOX',
    vrm: 'ownerDownloadVRM',
  }
  return formats[format]
}

const formatMetadata = (
  { imageUrl, index, type, ...ownerFiles }: MeebitsApiEntry,
  accessToken: string,
  format: FileFormat
): FormattedMeebitResponse => ({
  avatar: {
    format,
    type: type === 'HUMAN' ? 'humanoid' : null,
    uri: `${ownerFiles[getFormatFilename(format)]}&accessToken=${accessToken}`,
  },
  imageUrl,
  index,
})

export default formatMetadata
