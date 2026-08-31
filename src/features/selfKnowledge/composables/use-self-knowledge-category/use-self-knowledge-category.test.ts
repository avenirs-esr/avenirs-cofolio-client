import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import type { Ref } from 'vue'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { useSelfKnowledgeCategory } from '@/features/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { getSelfKnowledgeCategoryIcon } from '@/features/selfKnowledge/utils/category.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useSelfKnowledgeCategory composable', () => {
  let categoryType: Ref<ESelfKnowledgeCategory>
  let composableResult: ReturnType<typeof useSelfKnowledgeCategory>

  const firstCategory = mockedSelfKnowledgeCategories[0]
  const secondCategory = mockedSelfKnowledgeCategories[1]

  const mountWithCurrentCategoryType = () => {
    const { result } = mountComposable(
      () => useSelfKnowledgeCategory(categoryType),
      {
        useTanstack: true,
        useI18n: true
      }
    )
    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
    categoryType = ref(firstCategory.type)
  })

  BddTest().when('the composable is mounted with a category type', () => {
    beforeEach(() => {
      mountWithCurrentCategoryType()
    })

    BddTest().then('it should expose the given categoryType', () => {
      expect(composableResult.categoryType.value).toBe(firstCategory.type)
    })

    BddTest().then('it should compute a non empty translated categoryTypeLabel', () => {
      const label = composableResult.categoryTypeLabel.value

      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })

    BddTest().then('it should compute a non empty translated categoryTitle', () => {
      const title = composableResult.categoryTitle.value

      expect(typeof title).toBe('string')
      expect(title.length).toBeGreaterThan(0)
    })

    BddTest().then('it should compute a non empty translated categoryDescription', () => {
      const description = composableResult.categoryDescription.value

      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })

    BddTest().then('it should compute the categoryIcon from the category type', () => {
      const expectedIcon = getSelfKnowledgeCategoryIcon(firstCategory.type)
      expect(composableResult.categoryIcon.value).toBe(expectedIcon)
    })
  })

  if (secondCategory) {
    BddTest().when('the category type changes to another category', () => {
      beforeEach(() => {
        mountWithCurrentCategoryType()
        categoryType.value = secondCategory.type
      })

      BddTest().then('it should update categoryType, label, title, description and icon accordingly', () => {
        expect(composableResult.categoryType.value).toBe(secondCategory.type)

        const label = composableResult.categoryTypeLabel.value
        expect(typeof label).toBe('string')
        expect(label.length).toBeGreaterThan(0)

        const title = composableResult.categoryTitle.value
        expect(typeof title).toBe('string')
        expect(title.length).toBeGreaterThan(0)

        const expectedIcon = getSelfKnowledgeCategoryIcon(secondCategory.type)
        expect(composableResult.categoryIcon.value).toBe(expectedIcon)
      })
    })
  }
})
