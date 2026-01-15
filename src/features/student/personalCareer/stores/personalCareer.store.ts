import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const usePersonalCareerStore = defineStore('personalCareer', () => {
  const {
    showDrawer: showAddDeclaredProgramDrawer,
    displayDrawer: displayAddDeclaredProgramDrawer,
    hideDrawer: hideAddDeclaredProgramDrawer
  } = useDrawer()

  const declaredProgramsPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const declaredProgramsCurrentPage = ref(0)

  const declaredExperiencesPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const declaredExperiencesCurrentPage = ref(0)

  return {
    showAddDeclaredProgramDrawer,
    displayAddDeclaredProgramDrawer,
    hideAddDeclaredProgramDrawer,
    declaredProgramsCurrentPage,
    declaredProgramsPageSizeSelected,
    declaredExperiencesCurrentPage,
    declaredExperiencesPageSizeSelected
  }
}, {
  persist: {
    pick: [
      'declaredProgramsCurrentPage',
      'declaredProgramsPageSizeSelected',
      'declaredExperiencesCurrentPage',
      'declaredExperiencesPageSizeSelected'
    ]
  }
})
