import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export const CATEGORY_ELEMENTS_PAGE_SIZE = 3

export const CATEGORY_ICON_MAP: Record<ESelfKnowledgeCategory, string> = {
  [ESelfKnowledgeCategory.VALUES]: MDI_ICONS.FLOWER_TUILIP_OUTLINE,
  [ESelfKnowledgeCategory.STRENGTHS]: MDI_ICONS.WEIGHTS,
  [ESelfKnowledgeCategory.ASPIRATIONS]: RI_ICONS.HAND_HEART_LINE,
  [ESelfKnowledgeCategory.MOTIVATION]: MDI_ICONS.ROCKET_LAUNCH_OUTLINE,
  [ESelfKnowledgeCategory.IMPROVEMENT]: MDI_ICONS.TRENDING_UP,
  [ESelfKnowledgeCategory.INTERESTS]: MDI_ICONS.PALETTE_OUTLINE,
  [ESelfKnowledgeCategory.INSPIRATIONS]: MDI_ICONS.LIGHTBULB_OUTLINE,
  [ESelfKnowledgeCategory.OBLIGATIONS]: MDI_ICONS.LIST_STATUS,
  [ESelfKnowledgeCategory.TESTIMONIALS]: MS_ICONS.RECORD_VOICE_OVER_OUTLINE_ROUNDED,
}

export function getSelfKnowledgeCategoryIcon (categoryType: ESelfKnowledgeCategory): string {
  return CATEGORY_ICON_MAP[categoryType] ?? MDI_ICONS.STAR_SHOOTING_OUTLINE
}

export function toSelfKnowledgeCategoriesParam (categoryType: ESelfKnowledgeCategory): ESelfKnowledgeCategory[] {
  return [categoryType]
}
