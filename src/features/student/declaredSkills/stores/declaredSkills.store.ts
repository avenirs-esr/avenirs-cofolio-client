import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useDeclaredSkillsStore = defineStore('declaredSkills', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  const { showDrawer: showCreateDeclaredSkillDrawer, displayDrawer: displayCreateDeclaredSkillDrawer, hideDrawer: hideCreateDeclaredSkillDrawer } = useDrawer()

  return {
    currentPage,
    pageSizeSelected,
    showCreateDeclaredSkillDrawer,
    displayCreateDeclaredSkillDrawer,
    hideCreateDeclaredSkillDrawer
  }
}, {
  persist: {
    pick: [
      'currentPage',
      'pageSizeSelected'
    ]
  }
})
