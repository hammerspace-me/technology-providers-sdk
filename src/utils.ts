export const FORMATS = ['vrm', 'fbx', 'glb', 'vox']

export const isUrl = (string: string): boolean =>
  /http:\/\/|https:\/\/|ipfs:\/\//.test(string)

export const getBaseUrl = (path: string): string => {
  const pathArray = path.split('/')
  const protocol = pathArray[0].replace(':', '')
  const host = pathArray[2]
  return `${protocol}://${host}`
}

export const getFileExtensionFromUrl = (url: string): string =>
  (url.split(/[#?]/)[0].split('.').pop() as string).trim()

export const replaceExtension = (uri: string, extension: string): string => {
  const beginning = uri.substr(0, uri.lastIndexOf('.'))
  const queryString = uri.split('?')[1]
  let newUri = `${beginning}.${extension}`
  if (queryString) newUri += `?${queryString}`
  return newUri
}

export const getExtension = (uri: string): string =>
  (uri.split('.').pop() as string).split('?')[0]
