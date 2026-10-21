import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const useStaffAdminUsersStore = defineStore('staffAdminUsers', () => {
  const usersCurrentPage = ref<number>(0)
  const usersPageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

  return {
    usersCurrentPage,
    usersPageSizeSelected,
  }
}, {
  persist: {
    pick: [
      'usersCurrentPage',
      'usersPageSizeSelected',
    ]
  }
})
