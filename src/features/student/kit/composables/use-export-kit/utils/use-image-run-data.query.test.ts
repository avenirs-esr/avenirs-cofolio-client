import { useImageRunDataQuery } from '@/features/student/kit/composables/use-export-kit/utils/use-image-run-data.query'
import { generateImageRunData } from '@/features/student/kit/composables/use-export-kit/utils/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'

vi.mock('@/features/student/kit/composables/use-export-kit/utils/utils', () => ({
  generateImageRunData: vi.fn(),
}))

BddTest().given('a useImageRunDataQuery composable', () => {
  const generateImageRunDataMock = vi.mocked(generateImageRunData)
  let result: ReturnType<typeof useImageRunDataQuery>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the url is defined', () => {
    beforeEach(async () => {
      result = mountComposable(() => useImageRunDataQuery({
        url: 'https://example.com/image.jpg',
        width: 100,
        height: 50,
      }), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().then('it should call the image data generator', () => {
      expect(generateImageRunDataMock).toHaveBeenCalledWith({
        url: 'https://example.com/image.jpg',
        requiredWidth: 100,
        requiredHeight: 50,
      })
    })
  })

  BddTest().when('the url is undefined', () => {
    beforeEach(async () => {
      result = mountComposable(() => useImageRunDataQuery({
        url: undefined,
        width: 100,
        height: 50,
      }), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().then('it should not fetch the image data', () => {
      expect(generateImageRunDataMock).not.toHaveBeenCalled()
      expect(result.data.value).toBeUndefined()
    })
  })
})
