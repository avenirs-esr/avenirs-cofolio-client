import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffFeedbacksStore = defineStore('staffFeedbacks', () => {
  const feedbacksCurrentPage = ref<number>(0)
  const feedbacksPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    feedbacksCurrentPage,
    feedbacksPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'feedbacksCurrentPage',
      'feedbacksPageSizeSelected',
    ]
  }
})
