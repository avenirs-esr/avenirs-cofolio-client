import { useScreenshot } from '@/common/composables/use-screenshot/use-screenshot'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, type MockInstance, vi } from 'vitest'

const mockToJpeg = vi.fn()
const mockToPng = vi.fn()
const mockAnchor = {
  href: '',
  download: '',
  click: vi.fn()
}

vi.mock('html-to-image', async (importOriginal) => {
  const actual = await importOriginal<typeof import('html-to-image')>()
  return {
    ...actual,
    toJpeg: (...args: any[]) => mockToJpeg(...args),
    toPng: (...args: any[]) => mockToPng(...args)
  }
})

BddTest().given('an useScreenshot composable', () => {
  let composableResult: ReturnType<typeof useScreenshot>

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      composableResult = mountComposable(() => useScreenshot(), {}).result
    })

    BddTest().then('it should expose the required properties and methods', () => {
      expect(composableResult).toHaveProperty('capture')
      expect(composableResult).toHaveProperty('download')
      expect(composableResult).toHaveProperty('dataUrl')
      expect(composableResult).toHaveProperty('error')
      expect(typeof composableResult.capture).toBe('function')
      expect(typeof composableResult.download).toBe('function')
      expect(composableResult.dataUrl).toBeDefined()
      expect(composableResult.error).toBeDefined()
    })
  })

  BddTest().when('capture is called with type "jpeg"', () => {
    const mockElement = document.createElement('div')
    const mockDataUrl = 'data:image/jpeg;base64,mockjpegdata'

    beforeEach(async () => {
      mockToJpeg.mockResolvedValueOnce(mockDataUrl)

      await composableResult.capture(mockElement, { type: 'jpeg' })
    })

    BddTest().then('it should call toJpeg and set dataUrl and imgType accordingly', () => {
      expect(mockToJpeg).toHaveBeenCalledWith(mockElement, expect.any(Object))
      expect(composableResult.dataUrl.value).toBe(mockDataUrl)
    })
  })

  BddTest().when('capture is called and toJpeg throws an error', () => {
    const mockElement = document.createElement('div')
    const mockErrorMessage = 'Mock toJpeg error'

    beforeEach(async () => {
      mockToJpeg.mockRejectedValueOnce(new Error(mockErrorMessage))

      await expect(
        composableResult.capture(mockElement, { type: 'jpeg' })
      ).rejects.toThrow(mockErrorMessage)
    })

    BddTest().then('it should set the error property', () => {
      expect(composableResult.error.value).toBeInstanceOf(Error)
      expect(composableResult.error.value?.message).toBe(mockErrorMessage)
    })
  })

  BddTest().when('capture is called with type "png"', () => {
    const mockElement = document.createElement('div')
    const mockDataUrl = 'data:image/png;base64,mockpngdata'

    beforeEach(async () => {
      mockToPng.mockResolvedValueOnce(mockDataUrl)

      await composableResult.capture(mockElement, { type: 'png' })
    })

    BddTest().then('it should call toPng and set dataUrl and imgType accordingly', () => {
      expect(mockToPng).toHaveBeenCalledWith(mockElement, expect.any(Object))
      expect(composableResult.dataUrl.value).toBe(mockDataUrl)
    })
  })

  BddTest().when('capture is called and toPng throws an error', () => {
    const mockElement = document.createElement('div')
    const mockErrorMessage = 'Mock toPng error'

    beforeEach(async () => {
      mockToPng.mockRejectedValueOnce(new Error(mockErrorMessage))

      await expect(
        composableResult.capture(mockElement, { type: 'png' })
      ).rejects.toThrow(mockErrorMessage)
    })

    BddTest().then('it should set the error property', () => {
      expect(composableResult.error.value).toBeInstanceOf(Error)
      expect(composableResult.error.value?.message).toBe(mockErrorMessage)
    })
  })

  BddTest().when('capture is called without specifying a type', () => {
    const mockElement = document.createElement('div')
    const mockDataUrl = 'data:image/png;base64,mockpngdata'

    beforeEach(async () => {
      mockToPng.mockResolvedValueOnce(mockDataUrl)

      await composableResult.capture(mockElement, {})
    })

    BddTest().then('it should default to calling toPng and set dataUrl and imgType accordingly', () => {
      expect(mockToPng).toHaveBeenCalledWith(mockElement, expect.any(Object))
      expect(composableResult.dataUrl.value).toBe(mockDataUrl)
    })
  })

  BddTest().when('capture is called with shouldDownload set to true', () => {
    const mockElement = document.createElement('div')
    const mockDataUrl = 'data:image/jpeg;base64,mockjpegdata'
    const mockFileName = 'screenshot-test'

    let createElementSpy: MockInstance

    beforeEach(async () => {
      mockToPng.mockResolvedValueOnce(mockDataUrl)

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement)
      await composableResult.capture(mockElement, { fileName: mockFileName, shouldDownload: true })
    })

    afterEach(() => {
      createElementSpy.mockRestore()
    })

    BddTest().then('it should call download with the specified filename', () => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })
  })

  BddTest().when('download is called with a filename', () => {
    const mockFileName = 'test-screenshot'

    let createElementSpy: MockInstance

    beforeEach(() => {
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement)
      composableResult.download(mockFileName)
    })

    afterEach(() => {
      createElementSpy.mockRestore()
    })

    BddTest().then('it should create an anchor element and trigger a download', () => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockAnchor.download).toBe(`${mockFileName}.png`)
      expect(mockAnchor.click).toHaveBeenCalled()
    })
  })
})
