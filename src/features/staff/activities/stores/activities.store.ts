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

  return {
    showAddActivityModal,
    displayAddActivityModal,
    hideAddActivityModal,
    workingSpaceCurrentPage,
    workingSpacePageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'workingSpaceCurrentPage',
      'workingSpacePageSizeSelected',
    ]
  }
})
