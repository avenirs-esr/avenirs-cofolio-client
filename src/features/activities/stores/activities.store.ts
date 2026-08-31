import { useModal } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffActivitiesStore = defineStore('staffActivities', () => {
  const {
    showModal: showAddActivityModal,
    displayModal: displayAddActivityModal,
    hideModal: hideAddActivityModal,
  } = useModal()

  const workingSpaceCurrentPage = ref<number>(0)
  const workingSpacePageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  const allActivitiesCurrentPage = ref<number>(0)
  const allActivitiesPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  const feedbacksCurrentPage = ref<number>(0)
  const feedbacksPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    showAddActivityModal,
    displayAddActivityModal,
    hideAddActivityModal,
    workingSpaceCurrentPage,
    workingSpacePageSizeSelected,
    allActivitiesCurrentPage,
    allActivitiesPageSizeSelected,
    feedbacksCurrentPage,
    feedbacksPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'workingSpaceCurrentPage',
      'workingSpacePageSizeSelected',
      'allActivitiesCurrentPage',
      'allActivitiesPageSizeSelected',
      'feedbacksCurrentPage',
      'feedbacksPageSizeSelected',
    ]
  }
})
