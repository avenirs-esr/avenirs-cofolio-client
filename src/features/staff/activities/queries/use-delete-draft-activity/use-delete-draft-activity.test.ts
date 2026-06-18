import { useDeleteDraftActivity } from '@/features/staff/activities/queries/use-delete-draft-activity/use-delete-draft-activity'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

function mountUseDeleteDraftActivity (options?: Parameters<typeof useDeleteDraftActivity>[0]) {
  return mountComposable(() => useDeleteDraftActivity(options), { useTanstack: true, useI18n: true }).result
}

BddTest().given('useDeleteDraftActivity composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('deleteDraftActivity is called with a valid id and the API succeeds', () => {
    const mockOnSuccess = vi.fn()

    beforeEach(async () => {
      const { deleteDraftActivity } = mountUseDeleteDraftActivity({ onSuccess: mockOnSuccess })
      deleteDraftActivity('activity-id-123')
      await flushPromises()
    })

    BddTest().then('it should call addSuccessMessage with the success text', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été supprimée avec succès')
    })

    BddTest().then('it should call the onSuccess callback', () => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  BddTest().when('deleteDraftActivity is called with no onSuccess callback and the API succeeds', () => {
    beforeEach(async () => {
      const { deleteDraftActivity } = mountUseDeleteDraftActivity()
      deleteDraftActivity('activity-id-123')
      await flushPromises()
    })

    BddTest().then('it should call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été supprimée avec succès')
    })
  })

  BddTest().when('deleteDraftActivity is called with activity-id-error and the API returns an error', () => {
    beforeEach(async () => {
      const { deleteDraftActivity } = mountUseDeleteDraftActivity()
      deleteDraftActivity('activity-id-error')
      await flushPromises()
    })

    BddTest().then('it should call addErrorMessage with the correct title', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la suppression de l\'activité',
        })
      )
    })

    BddTest().then('it should not call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })
  })
})
