import type { SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { defineStore } from 'pinia'
import { useDrawer } from '@/common/composables'

export const useSelfKnowledgeStore = defineStore('self-knowledge', () => {
  const selectedCategory = ref<SelfKnowledgeCategoryDTO | null>(null)

  const {
    showDrawer: showAddElementDrawer,
    displayDrawer: displayAddElementDrawer,
    hideDrawer: hideAddElementDrawer
  } = useDrawer()

  function openAddElementDrawer (categoryDTO: SelfKnowledgeCategoryDTO) {
    selectedCategory.value = categoryDTO
    displayAddElementDrawer()
  }

  function closeAddElementDrawer () {
    hideAddElementDrawer()
  }

  return {
    selectedCategory,
    showAddElementDrawer,
    openAddElementDrawer,
    closeAddElementDrawer
  }
})
