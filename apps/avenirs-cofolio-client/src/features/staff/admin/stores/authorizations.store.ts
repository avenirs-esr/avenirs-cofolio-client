import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffAdminAuthorizationsStore = defineStore('staffAdminAuthorizations', () => {
  const authorizationsCurrentPage = ref<number>(0)
  const authorizationsPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    authorizationsCurrentPage,
    authorizationsPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'authorizationsCurrentPage',
      'authorizationsPageSizeSelected',
    ]
  }
})
