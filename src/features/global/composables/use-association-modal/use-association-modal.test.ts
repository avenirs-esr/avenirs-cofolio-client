import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { BaseApiException } from '@/common/exceptions'
import { useAssociationModal } from '@/features/global/composables/use-association-modal/use-association-modal'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    }),
  }
})

BddTest().given('the useAssociationModal composable', () => {
  let composable: ReturnType<typeof useAssociationModal>

  beforeEach(() => {
    vi.clearAllMocks()
    const { result } = mountComposable(() => useAssociationModal(), {
      usePinia: true,
      useI18n: true
    })
    composable = result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should have empty searchQuery', () => {
      expect(composable.searchQuery.value).toBe('')
    })

    BddTest().then('it should have empty selectedOptions', () => {
      expect(composable.selectedOptions.value).toEqual([])
    })

    BddTest().then('it should have empty selectedAssociations', () => {
      expect(composable.selectedAssociations.value).toEqual([])
    })

    BddTest().then('it should have hidden confirm modal', () => {
      expect(composable.showConfirmModal.value).toBe(false)
    })
  })

  BddTest().when('onSearch is called', () => {
    beforeEach(() => {
      composable.onSearch('test query')
    })

    BddTest().then('it should update the searchQuery', () => {
      expect(composable.searchQuery.value).toBe('test query')
    })
  })

  BddTest().when('selectedOptions are set', () => {
    const options: AvAutocompleteOption[] = [
      { label: 'Item A', value: 'id-a' },
      { label: 'Item B', value: 'id-b' }
    ]

    beforeEach(() => {
      composable.selectedOptions.value = options
    })

    BddTest().then('it should compute selectedAssociations from options', () => {
      expect(composable.selectedAssociations.value).toEqual([
        { id: 'id-a', title: 'Item A' },
        { id: 'id-b', title: 'Item B' }
      ])
    })

    BddTest().and('onDeleteItem is called with an existing id', () => {
      beforeEach(() => {
        composable.onDeleteItem('id-a')
      })

      BddTest().then('it should remove the item from selectedOptions', () => {
        expect(composable.selectedOptions.value).toHaveLength(1)
        expect(composable.selectedOptions.value[0].value).toBe('id-b')
      })

      BddTest().then('it should update selectedAssociations accordingly', () => {
        expect(composable.selectedAssociations.value).toEqual([
          { id: 'id-b', title: 'Item B' }
        ])
      })
    })

    BddTest().and('options include description', () => {
      const optionsWithDescription: AvAutocompleteOption[] = [
        { label: 'Item C', value: 'id-c', description: 'Description C' },
        { label: 'Item D', value: 'id-d', description: 'Description D' }
      ]

      beforeEach(() => {
        composable.selectedOptions.value = optionsWithDescription
      })

      BddTest().then('it should include description in selectedAssociations', () => {
        expect(composable.selectedAssociations.value).toEqual([
          { id: 'id-c', title: 'Item C', description: 'Description C' },
          { id: 'id-d', title: 'Item D', description: 'Description D' }
        ])
      })
    })

    BddTest().and('onDeleteItem is called with a non-existing id', () => {
      beforeEach(() => {
        composable.onDeleteItem('id-unknown')
      })

      BddTest().then('it should not remove any item', () => {
        expect(composable.selectedOptions.value).toHaveLength(2)
      })
    })
  })

  BddTest().when('displayConfirmModal is called', () => {
    beforeEach(() => {
      composable.displayConfirmModal()
    })

    BddTest().then('it should show the confirm modal', () => {
      expect(composable.showConfirmModal.value).toBe(true)
    })

    BddTest().and('hideConfirmModal is called', () => {
      beforeEach(() => {
        composable.hideConfirmModal()
      })

      BddTest().then('it should hide the confirm modal', () => {
        expect(composable.showConfirmModal.value).toBe(false)
      })
    })
  })

  BddTest().when('onAssociateMutationError is called without a custom title', () => {
    beforeEach(() => {
      composable.onAssociateMutationError(new BaseApiException('Association failed'))
    })

    BddTest().then('it should call addErrorMessage with the generic title and error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.any(String)
        })
      )
    })
  })

  BddTest().when('onAssociateMutationError is called with a custom title', () => {
    beforeEach(() => {
      composable.onAssociateMutationError(new BaseApiException('Association failed'), 'Custom error title')
    })

    BddTest().then('it should call addErrorMessage with the custom title', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Custom error title',
          description: expect.any(String)
        })
      )
    })
  })

  BddTest().when('listenAndDisplayToastOnSearchError is set up and error occurs', () => {
    const isSearchError = ref(false)
    const searchError = ref<BaseApiException | null >(null)

    BddTest().then('it should call addErrorMessage when error becomes true', async () => {
      composable.listenAndDisplayToastOnSearchError(
        isSearchError,
        searchError
      )

      searchError.value = new BaseApiException('Search failed')
      isSearchError.value = true

      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.any(String)
        })
      )
    })

    BddTest().then('it should not call addErrorMessage when isSearchError becomes false', async () => {
      composable.listenAndDisplayToastOnSearchError(
        isSearchError,
        searchError
      )

      isSearchError.value = false

      await nextTick()

      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })
})
