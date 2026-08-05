import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the getCategoryIcon utility function', () => {
  const testCases: { categoryType: ESelfKnowledgeCategory, expectedIcon: string }[] = [
    { categoryType: ESelfKnowledgeCategory.VALUES, expectedIcon: MDI_ICONS.DIAMOND_STONE },
    { categoryType: ESelfKnowledgeCategory.STRENGTHS, expectedIcon: MDI_ICONS.WEIGHTS },
    { categoryType: ESelfKnowledgeCategory.ASPIRATIONS, expectedIcon: RI_ICONS.HAND_HEART_LINE },
    { categoryType: ESelfKnowledgeCategory.IMPROVEMENT, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategory.INSPIRATIONS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategory.INTERESTS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategory.MOTIVATION, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategory.OBLIGATIONS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategory.TESTIMONIALS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
  ]

  testCases.forEach(({ categoryType, expectedIcon }) => {
    BddTest().when(`getCategoryIcon is called with categoryType: ${categoryType}`, () => {
      let result: string

      beforeEach(() => {
        result = getSelfKnowledgeCategoryIcon(categoryType)
      })

      BddTest().then(`it should return the expected icon: ${expectedIcon}`, () => {
        expect(result).toBe(expectedIcon)
      })
    })
  })
})
