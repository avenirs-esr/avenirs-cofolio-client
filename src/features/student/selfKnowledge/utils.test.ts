import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import { getCategoryIcon } from '@/features/student/selfKnowledge/utils'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the getCategoryIcon utility function', () => {
  const testCases: { categoryType: ESelfKnowledgeCategoryType, expectedIcon: string }[] = [
    { categoryType: ESelfKnowledgeCategoryType.VALUES, expectedIcon: MDI_ICONS.DIAMOND_STONE },
    { categoryType: ESelfKnowledgeCategoryType.STRENGTHS, expectedIcon: MDI_ICONS.WEIGHTS },
    { categoryType: ESelfKnowledgeCategoryType.ASPIRATIONS, expectedIcon: RI_ICONS.HAND_HEART_LINE },
    { categoryType: ESelfKnowledgeCategoryType.IMPROVEMENT, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategoryType.INSPIRATIONS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategoryType.INTERESTS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategoryType.MOTIVATION, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategoryType.OBLIGATIONS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
    { categoryType: ESelfKnowledgeCategoryType.TESTIMONIALS, expectedIcon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
  ]

  testCases.forEach(({ categoryType, expectedIcon }) => {
    BddTest().when(`getCategoryIcon is called with categoryType: ${categoryType}`, () => {
      let result: string

      beforeEach(() => {
        result = getCategoryIcon(categoryType)
      })

      BddTest().then(`it should return the expected icon: ${expectedIcon}`, () => {
        expect(result).toBe(expectedIcon)
      })
    })
  })
})
