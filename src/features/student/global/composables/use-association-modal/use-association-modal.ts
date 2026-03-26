import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { Ref } from 'vue'
import { useModal } from '@/common/composables'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useAssociationModal () {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const {
    showModal: showConfirmModal,
    displayModal: displayConfirmModal,
    hideModal: hideConfirmModal
  } = useModal()

  const searchQuery = ref('')
  const selectedOptions = ref<AvAutocompleteOption[]>([])

  const selectedAssociations = computed(() =>
    selectedOptions.value.map(option => ({
      id: option.value.toString(),
      title: option.label
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
        description: searchError.value.message,
      })
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
    listenAndDisplayToastOnSearchError
  }
}
