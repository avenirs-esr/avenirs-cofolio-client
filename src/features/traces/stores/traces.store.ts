import type { UpdateTraceForm } from '@/features/traces/types/forms.types'
import { useDrawer } from '@/common/composables/use-drawer/use-drawer'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.EIGHT

function useTracesPagination () {
  const unassociatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const unassociatedCurrentPage = ref(0)
  const associatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const associatedCurrentPage = ref(0)

  return {
    unassociatedPageSizeSelected,
    unassociatedCurrentPage,
    associatedPageSizeSelected,
    associatedCurrentPage
  }
}

function useTracesUI () {
  const {
    showDrawer: showCreateTraceDrawer,
    displayDrawer: displayCreateTraceDrawer,
    hideDrawer: hideCreateTraceDrawer
  } = useDrawer()

  const {
    showModal: showUpdateTraceModal,
    displayModal: displayUpdateTraceModal,
    hideModal: hideUpdateTraceModal
  } = useModal()

  return {
    showCreateTraceDrawer,
    displayCreateTraceDrawer,
    hideCreateTraceDrawer,
    showUpdateTraceModal,
    displayUpdateTraceModal,
    hideUpdateTraceModal
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
      'associatedCurrentPage'
    ]
  }
})
