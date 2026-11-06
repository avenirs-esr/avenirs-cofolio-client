import type { UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { useModal } from '@avenirs-esr/shared'
import { defineStore } from 'pinia'
import { useDrawer } from '@/common/composables/use-drawer/use-drawer'

const DEFAULT_PAGE_SIZE = PageSizes.EIGHT

function useTracesPagination () {
  const unassociatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const unassociatedCurrentPage = ref(0)
  const unassociatedTotalPages = ref(1)
  const associatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const associatedCurrentPage = ref(0)
  const associatedTotalPages = ref(1)
  return {
    unassociatedPageSizeSelected,
    unassociatedCurrentPage,
    associatedPageSizeSelected,
    unassociatedTotalPages,
    associatedCurrentPage,
    associatedTotalPages
  }
}

function useTracesUI () {
  const {
    showDrawer: showCreateTraceDrawer,
    displayDrawer: displayCreateTraceDrawer,
    hideDrawer: hideCreateTraceDrawer
  } = useDrawer()

  const {
    modalOpened: updateTraceModalOpened,
    openModal: openUpdateTraceModal,
    closeModal: closeUpdateTraceModal
  } = useModal()

  return {
    showCreateTraceDrawer,
    displayCreateTraceDrawer,
    hideCreateTraceDrawer,
    updateTraceModalOpened,
    openUpdateTraceModal,
    closeUpdateTraceModal
  }
}

function useUpdateTraceForm () {
  const updateTraceForm = ref<UpdateTraceForm | null>(null)
  const updateTraceFormModified = ref(false)

  function setUpdateTraceForm (form: UpdateTraceForm | null) {
    updateTraceForm.value = form
  }

  function setUpdateTraceFormModified (isModified: boolean) {
    updateTraceFormModified.value = isModified
  }

  async function submitUpdateTraceForm () {
    await updateTraceForm.value?.handleSubmit()
  }

  return {
    updateTraceFormModified,
    setUpdateTraceForm,
    setUpdateTraceFormModified,
    submitUpdateTraceForm
  }
}

export const useTracesStore = defineStore('traces', () => {
  return {
    ...useTracesPagination(),
    ...useTracesUI(),
    ...useUpdateTraceForm()
  }
}, {
  persist: {
    pick: [
      'unassociatedPageSizeSelected',
      'associatedPageSizeSelected',
      'unassociatedCurrentPage',
      'associatedCurrentPage',
      'unassociatedTotalPages',
      'associatedTotalPages'
    ]
  }
})
