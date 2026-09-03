import type { IImageOptions } from 'docx'

interface GenerateImageRunDataParams {
  url: string
  requiredWidth?: number
  requiredHeight?: number
}

export async function generateImageRunData ({ url, requiredWidth, requiredHeight }: GenerateImageRunDataParams): Promise<IImageOptions | null> {
  const response = await fetch(url)
  if (!response.ok) {
    return null
  }

  const blob = await response.blob()

  const type = blob.type

  if (!type.startsWith('image/')) {
    return null
  }

  if (['image/jpeg', 'image/png', 'image/gif'].includes(type) === false) {
    return null
  }

  let dataType: 'jpg' | 'png' | 'gif'
  switch (type) {
    case 'image/png':
      dataType = 'png'
      break
    case 'image/gif':
      dataType = 'gif'
      break
    case 'image/jpeg':
    default:
      dataType = 'jpg'
      break
  }

  const image = await createImageBitmap(blob)
  const ratio = image.width / image.height
  const MAX_WIDTH = centimeterToPixel(19)
  const width = requiredWidth ? Math.min(requiredWidth, MAX_WIDTH) : MAX_WIDTH
  const height = requiredHeight ? Math.min(requiredHeight, width / ratio) : width / ratio

  const croppedImage = await cropImageToMaxHeight(image, width, height)

  return { data: croppedImage, type: dataType, transformation: { width, height } }
}

async function cropImageToMaxHeight (
  image: ImageBitmap,
  requiredWidth: number,
  maxHeight: number,
): Promise<ArrayBuffer> {
  const ratio = requiredWidth / image.width
  const scaledHeight = image.height * ratio

  const canvas = document.createElement('canvas')

  if (scaledHeight <= maxHeight) {
    canvas.width = requiredWidth
    canvas.height = scaledHeight

    const ctx = canvas.getContext('2d')!

    ctx.drawImage(image, 0, 0, requiredWidth, scaledHeight)
  }
  else {
    const sourceHeight = maxHeight / ratio
    const sy = (image.height - sourceHeight) / 2

    canvas.width = requiredWidth
    canvas.height = maxHeight

    const ctx = canvas.getContext('2d')!

    ctx.drawImage(
      image,
      0,
      sy,
      image.width,
      sourceHeight,
      0,
      0,
      requiredWidth,
      maxHeight,
    )
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      }
      else {
        reject(new Error('Failed to create image blob'))
      }
    }, 'image/png')
  })

  return blob.arrayBuffer()
}

export function centimeterToTwip (centimeter: number): number {
  return Math.round(centimeter * 567)
}

export function centimeterToPixel (centimeter: number): number {
  return Math.round(centimeter * 37.7952755906)
}

export function centimeterToEmu (centimeter: number): number {
  return Math.round(centimeter * 360000)
}
