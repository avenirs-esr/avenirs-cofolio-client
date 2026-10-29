import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffAssessmentsStore = defineStore('staffAssessments', () => {
  const assessmentsCurrentPage = ref<number>(0)
  const assessmentsPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    assessmentsCurrentPage,
    assessmentsPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'assessmentsCurrentPage',
      'assessmentsPageSizeSelected',
    ]
  }
})
