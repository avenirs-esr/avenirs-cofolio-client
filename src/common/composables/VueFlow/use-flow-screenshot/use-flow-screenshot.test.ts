import { useFlowScreenshot } from '@/common/composables/VueFlow/use-flow-screenshot/use-flow-screenshot'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockVueFlowRef = ref<HTMLDivElement | null>(document.createElement('div'))
const mockCapture = vi.fn()

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      vueFlowRef: mockVueFlowRef
    }),
  }
})

vi.mock('@/common/composables/use-screenshot/use-screenshot', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-screenshot/use-screenshot')>()
  return {
    ...actual,
    useScreenshot: () => ({
      capture: mockCapture
    }),
  }
})

BddTest().given('an useVueFlowScreenshot composable', () => {
  let composableResult: ReturnType<typeof useFlowScreenshot>

  BddTest().when('the composable is initialized with a defined vue flow ref', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      composableResult = mountComposable(() => useFlowScreenshot(), {}).result
    })

    BddTest().then('it should expose the doScreenshot method', () => {
      expect(composableResult).toHaveProperty('doScreenshot')
      expect(typeof composableResult.doScreenshot).toBe('function')
    })

    BddTest().and('doScreenshot is called without filename', () => {
      beforeEach(() => {
        composableResult.doScreenshot()
      })

      BddTest().then('it should call capture with a default filename', () => {
        expect(mockCapture).toHaveBeenCalledWith(mockVueFlowRef.value, { shouldDownload: true, fileName: expect.stringMatching(/^flow-screenshot-\d+$/) })
      })
    })

    BddTest().and('doScreenshot is called with a filename', () => {
      const testFileName = 'custom-flow'

      beforeEach(() => {
        composableResult.doScreenshot(testFileName)
      })

      BddTest().then('it should call capture with the provided filename', () => {
        expect(mockCapture).toHaveBeenCalledWith(mockVueFlowRef.value, { shouldDownload: true, fileName: expect.stringMatching(new RegExp(`^${testFileName}-screenshot-\\d+$`)) })
      })
    })
  })

  BddTest().when('the composable is initialized with a null vue flow ref', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockVueFlowRef.value = null
      composableResult = mountComposable(() => useFlowScreenshot(), {}).result
    })

    BddTest().and('doScreenshot is called', () => {
      beforeEach(() => {
        composableResult.doScreenshot()
      })

      BddTest().then('it should not call capture and log a warning', () => {
        expect(mockCapture).not.toHaveBeenCalled()
      })
    })
  })
})
