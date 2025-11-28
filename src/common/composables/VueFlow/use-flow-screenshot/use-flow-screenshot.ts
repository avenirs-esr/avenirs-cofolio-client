import { useScreenshot } from '@/common/composables/VueFlow/use-screenshot/use-screenshot'
import { useVueFlow } from '@vue-flow/core'

interface UseFlowScreenshotReturn {
  /**
   * Capture a screenshot of the current Vue Flow diagram and download it as an image file.
   * @param fileName Optional base name for the downloaded file. A timestamp will be appended.
   */
  doScreenshot: (fileName?: string) => void
}

export function useFlowScreenshot (): UseFlowScreenshotReturn {
  const { vueFlowRef } = useVueFlow()
  const { capture } = useScreenshot()

  // === Capture screenshot ===
  function doScreenshot (fileName?: string) {
    if (!vueFlowRef.value) {
      console.warn('VueFlow element not found')
      return
    }

    capture(vueFlowRef.value, { shouldDownload: true, fileName: `${fileName ?? 'flow'}-screenshot-${Date.now()}` })
  }

  return {
    doScreenshot,
  }
}
