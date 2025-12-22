import { useDrawer } from '@/common/composables'
import { defineStore } from 'pinia'

export const usePersonalCareerStore = defineStore('personalCareer', () => {
  const { showDrawer: showAddDeclaredProgramDrawer, displayDrawer: displayAddDeclaredProgramDrawer, hideDrawer: hideAddDeclaredProgramDrawer } = useDrawer()

  return {
    showAddDeclaredProgramDrawer,
    displayAddDeclaredProgramDrawer,
    hideAddDeclaredProgramDrawer
  }
})
