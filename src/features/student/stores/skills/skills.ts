import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useSkillsStore = defineStore('skills', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  const additionalPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const additionalCurrentPage = ref(0)

  const { showDrawer: showCreateAdditionalSkillDrawer, displayDrawer: displayCreateAdditionalSkillDrawer, hideDrawer: hideCreateAdditionalSkillDrawer } = useDrawer()

  return {
    currentPage,
    pageSizeSelected,
    additionalCurrentPage,
    additionalPageSizeSelected,
    showCreateAdditionalSkillDrawer,
    displayCreateAdditionalSkillDrawer,
    hideCreateAdditionalSkillDrawer
  }
}, {
  persist: true
})
