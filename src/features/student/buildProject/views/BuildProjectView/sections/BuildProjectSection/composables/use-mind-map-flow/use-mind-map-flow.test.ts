import { useMindMapFlow } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-mind-map-flow/use-mind-map-flow'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockSaveCurrentState = vi.fn()
const mockRestoreSavedState = vi.fn()
const mockResetToInitialState = vi.fn()

vi.mock('@/common/composables/VueFlow/use-flow-state/use-flow-state', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/VueFlow/use-flow-state/use-flow-state')>()
  return {
    ...actual,
    useFlowState: () => ({
      saveCurrentState: mockSaveCurrentState,
      restoreSavedState: mockRestoreSavedState,
      resetToInitialState: mockResetToInitialState,
    }),
  }
})

BddTest().given('the useMindMapFlow composable', () => {
  let composableResult: ReturnType<typeof useMindMapFlow>
  const prefix = 'mind-map'
  const index = '1'

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      composableResult = mountComposable(() => useMindMapFlow(), { }).result
    })

    BddTest().then('it should expose the save, restore and reset methods', () => {
      expect(composableResult).toHaveProperty('saveCurrentState')
      expect(composableResult).toHaveProperty('restoreSavedState')
      expect(composableResult).toHaveProperty('resetToInitialState')
    })

    BddTest().and('saveCurrentState is called', () => {
      beforeEach(() => {
        composableResult.saveCurrentState(prefix, index)
      })

      BddTest().then('the useFlowState saveCurrentState should be called with the same parameters', () => {
        expect(mockSaveCurrentState).toHaveBeenCalledWith(prefix, index)
      })
    })

    BddTest().and('restoreSavedState is called', () => {
      beforeEach(() => {
        composableResult.restoreSavedState(prefix, index)
      })

      BddTest().then('the useFlowState restoreSavedState should be called with the same parameters', () => {
        expect(mockRestoreSavedState).toHaveBeenCalledWith(prefix, index)
      })
    })

    BddTest().and('resetToInitialState is called', () => {
      beforeEach(() => {
        composableResult.resetToInitialState()
      })

      BddTest().then('the useFlowState resetToInitialState should be called', () => {
        expect(mockResetToInitialState).toHaveBeenCalled()
      })
    })
  })
})
