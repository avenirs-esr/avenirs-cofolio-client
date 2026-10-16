import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffAdminGroupsStore = defineStore('staffAdminGroups', () => {
  const groupsCurrentPage = ref<number>(0)
  const groupsPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    groupsCurrentPage,
    groupsPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'groupsCurrentPage',
      'groupsPageSizeSelected',
    ]
  }
})
