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
  fileFormat: FileFormat
): FormattedMeebitResponse => ({
  avatar: {
    source: `${
      ownerFiles[getFormatFilename(fileFormat)]
    }&accessToken=${accessToken}`,
    type: 'humanoid',
    fileFormat,
    bodyType: 'full-body',
  },
  imageUrl,
  index,
})

export default formatMetadata
