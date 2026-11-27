import type { SelfKnowledgeCategoryDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { useDrawer } from '@avenirs-esr/shared'
import { defineStore } from 'pinia'

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
