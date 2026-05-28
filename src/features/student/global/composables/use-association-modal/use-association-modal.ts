import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { Ref } from 'vue'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useAssociationModal<T extends AvAutocompleteOption = AvAutocompleteOption> () {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const {
    showModal: showConfirmModal,
    displayModal: displayConfirmModal,
    hideModal: hideConfirmModal
  } = useModal()

  const searchQuery = ref('')
  const selectedOptions = ref<T[]>([]) as Ref<T[]>

  const selectedAssociations = computed(() =>
    selectedOptions.value.map(option => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description
    }))
  )

  function onSearch (query: string) {
    searchQuery.value = query
  }

  function onDeleteItem (itemId: string) {
    selectedOptions.value = selectedOptions.value.filter(option => option.value !== itemId)
  }

  function listenAndDisplayToastOnSearchError (isSearchError: Ref<boolean>, searchError: Ref<BaseApiException | null>) {
    watch(isSearchError, (value) => {
      if (!value || !searchError.value) {
        return
      }

      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(searchError.value),
      })
    })
  }

  function onAssociateMutationError (error: BaseApiException, title?: string) {
    addErrorMessage({
      title: title ?? t('global.error.generic'),
      description: getErrorMessage(error),
    })
  }

  return {
    searchQuery,
    selectedOptions,
    selectedAssociations,
    showConfirmModal,
    displayConfirmModal,
    hideConfirmModal,
    onSearch,
    onDeleteItem,
    listenAndDisplayToastOnSearchError,
    onAssociateMutationError
  }
}
