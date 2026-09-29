import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { CATEGORY_ICON_MAP, getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the getCategoryIcon utility function', () => {
  const testCases: { categoryType: ESelfKnowledgeCategory, expectedIcon: string }[] = Object.entries(CATEGORY_ICON_MAP).map(([categoryType, expectedIcon]) => ({
    categoryType: categoryType as ESelfKnowledgeCategory,
    expectedIcon,
  }))

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
