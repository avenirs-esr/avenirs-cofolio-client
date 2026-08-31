import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

export const usePersonalCareerStore = defineStore('personalCareer', () => {
  const {
    showDrawer: showAddDeclaredProgramDrawer,
    displayDrawer: displayAddDeclaredProgramDrawer,
    hideDrawer: hideAddDeclaredProgramDrawer
  } = useDrawer()

  const {
    showDrawer: showAddDeclaredExperienceDrawer,
    displayDrawer: displayAddDeclaredExperienceDrawer,
    hideDrawer: hideAddDeclaredExperienceDrawer
  } = useDrawer()

  const declaredProgramsPageSizeSelected = ref<PageSizes>(PageSizes.EIGHT)
  const declaredProgramsCurrentPage = ref(0)

  const declaredExperiencesPageSizeSelected = ref<PageSizes>(PageSizes.FOUR)
  const declaredExperiencesCurrentPage = ref(0)

  return {
    showAddDeclaredProgramDrawer,
    displayAddDeclaredProgramDrawer,
    hideAddDeclaredProgramDrawer,
    showAddDeclaredExperienceDrawer,
    displayAddDeclaredExperienceDrawer,
    hideAddDeclaredExperienceDrawer,
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
