import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useAdditionalSkillsStore = defineStore('additionalSkills', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  const { showDrawer: showCreateAdditionalSkillDrawer, displayDrawer: displayCreateAdditionalSkillDrawer, hideDrawer: hideCreateAdditionalSkillDrawer } = useDrawer()

  return {
    currentPage,
    pageSizeSelected,
    showCreateAdditionalSkillDrawer,
    displayCreateAdditionalSkillDrawer,
    hideCreateAdditionalSkillDrawer
  }
}, {
  persist: {
    pick: [
      'currentPage',
      'pageSizeSelected'
    ]
  }
})
