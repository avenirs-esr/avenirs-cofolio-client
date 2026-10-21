import type { Options as HTMLToImageOptions } from 'html-to-image/es/types'
import type { Ref } from 'vue'
import { toJpeg as ElToJpg, toPng as ElToPng } from 'html-to-image'

export type ImageType = 'jpeg' | 'png'

export interface UseScreenshotOptions extends HTMLToImageOptions {
  type?: ImageType
  fileName?: string
  shouldDownload?: boolean
  fetchRequestInit?: RequestInit
}

export type CaptureScreenshot = (
  el: HTMLElement,
  options?: UseScreenshotOptions
) => Promise<string>

export type Download = (fileName: string) => void

export interface UseScreenshot {
  capture: CaptureScreenshot
  download: Download
  dataUrl: Ref<string>
  error: Ref
}

export function useScreenshot (): UseScreenshot {
  const dataUrl = ref<string>('')
  const imgType = ref<ImageType>('png')
  const error = ref()

  async function capture (el: HTMLElement, options: UseScreenshotOptions = {}) {
    let data

    const fileName = options.fileName ?? `screenshot-${Date.now()}`

    switch (options.type) {
      case 'jpeg':
        data = await toJpeg(el, options)
        break
      case 'png':
      default:
        data = await toPng(el, options)
        break
    }

    if (options.shouldDownload && fileName !== '') {
      download(fileName)
    }

    return data
  }

  function toJpeg (
    el: HTMLElement,
    options: HTMLToImageOptions = { quality: 0.95 }
  ) {
    error.value = null

    return ElToJpg(el, options)
      .then((data) => {
        dataUrl.value = data
        imgType.value = 'jpeg'
        return data
      })
      .catch((err: unknown) => {
        error.value = err as Error
        throw err
      })
  }

  function toPng (
    el: HTMLElement,
    options: HTMLToImageOptions = { quality: 0.95 }
  ) {
    error.value = null

    return ElToPng(el, options)
      .then((data) => {
        dataUrl.value = data
        imgType.value = 'png'
        return data
      })
      .catch((err: unknown) => {
        error.value = err as Error
        throw err
      })
  }

  function download (fileName: string) {
    const link = document.createElement('a')
    link.download = `${fileName}.${imgType.value}`
    link.href = dataUrl.value
    link.click()
  }

  return {
    capture,
    download,
    dataUrl,
    error,
  }
}
