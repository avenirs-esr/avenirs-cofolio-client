import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export function getSelfKnowledgeCategoryIcon (categoryType: ESelfKnowledgeCategoryType): string {
  switch (categoryType) {
    case ESelfKnowledgeCategoryType.VALUES:
      return MDI_ICONS.DIAMOND_STONE
    case ESelfKnowledgeCategoryType.STRENGTHS:
      return MDI_ICONS.WEIGHTS
    case ESelfKnowledgeCategoryType.ASPIRATIONS:
      return RI_ICONS.HAND_HEART_LINE
    default:
      return MDI_ICONS.STAR_SHOOTING_OUTLINE
  }
}
