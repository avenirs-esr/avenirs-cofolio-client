import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export const CATEGORY_ELEMENTS_PAGE_SIZE = 3

export function getSelfKnowledgeCategoryIcon (categoryType: ESelfKnowledgeCategory): string {
  switch (categoryType) {
    case ESelfKnowledgeCategory.VALUES:
      return MDI_ICONS.DIAMOND_STONE
    case ESelfKnowledgeCategory.STRENGTHS:
      return MDI_ICONS.WEIGHTS
    case ESelfKnowledgeCategory.ASPIRATIONS:
      return RI_ICONS.HAND_HEART_LINE
    default:
      return MDI_ICONS.STAR_SHOOTING_OUTLINE
  }
}

export function toSelfKnowledgeCategoriesParam (categoryType: ESelfKnowledgeCategory): ESelfKnowledgeCategory[] {
  return [categoryType]
}
