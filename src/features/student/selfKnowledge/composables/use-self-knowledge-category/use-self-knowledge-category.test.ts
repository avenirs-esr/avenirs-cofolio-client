import type { Ref } from 'vue'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useSelfKnowledgeCategory composable', () => {
  let categoryId: Ref<string>
  let composableResult: ReturnType<typeof useSelfKnowledgeCategory>

  const firstCategory = mockedSelfKnowledgeCategories[0]
  const secondCategory = mockedSelfKnowledgeCategories[1]

  const mountWithCurrentCategoryId = () => {
    const { result } = mountComposable(
      () => useSelfKnowledgeCategory(categoryId),
      {
        useTanstack: true,
        useI18n: true
      }
    )
    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
    categoryId = ref('')
  })

  BddTest().when('a matching category exists for the given id', () => {
    beforeEach(async () => {
      categoryId.value = firstCategory.id
      mountWithCurrentCategoryId()

      await vi.waitFor(() => {
        expect(composableResult.category.value).toBeDefined()
      })
    })

    BddTest().then('it should expose the matching category', () => {
      expect(composableResult.category.value?.id).toBe(firstCategory.id)
      expect(composableResult.category.value?.title).toBe(firstCategory.title)
    })

    BddTest().then('it should derive categoryType from the category', () => {
      expect(composableResult.categoryType.value).toBe(firstCategory.type)
    })

    BddTest().then('it should compute a non empty translated categoryTypeLabel', () => {
      const label = composableResult.categoryTypeLabel.value

      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })

    BddTest().then('it should compute the categoryIcon from the category type', () => {
      const expectedIcon = getSelfKnowledgeCategoryIcon(
        firstCategory.type as ESelfKnowledgeCategoryType
      )
      expect(composableResult.categoryIcon.value).toBe(expectedIcon)
    })
  })

  BddTest().when('no matching category exists for the given id', () => {
    beforeEach(async () => {
      categoryId.value = 'unknown-category-id'
      mountWithCurrentCategoryId()

      await vi.waitFor(() => {
        expect(composableResult.categoryType.value).toBeDefined()
      })
    })

    BddTest().then('it should expose undefined category', () => {
      expect(composableResult.category.value).toBeUndefined()
    })

    BddTest().then('it should fallback categoryType to STRENGTHS', () => {
      expect(composableResult.categoryType.value).toBe(
        ESelfKnowledgeCategoryType.STRENGTHS
      )
    })

    BddTest().then('it should compute a label for the fallback type', () => {
      const label = composableResult.categoryTypeLabel.value

      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })

    BddTest().then('it should compute the icon based on the fallback type', () => {
      const expectedIcon = getSelfKnowledgeCategoryIcon(
        ESelfKnowledgeCategoryType.STRENGTHS
      )
      expect(composableResult.categoryIcon.value).toBe(expectedIcon)
    })
  })

  if (secondCategory) {
    BddTest().when('the category id changes to another existing category', () => {
      beforeEach(async () => {
        categoryId.value = firstCategory.id
        mountWithCurrentCategoryId()

        await vi.waitFor(() => {
          expect(composableResult.category.value?.id).toBe(firstCategory.id)
        })

        categoryId.value = secondCategory.id

        await vi.waitFor(() => {
          expect(composableResult.category.value?.id).toBe(secondCategory.id)
        })
      })

      BddTest().then('it should update the category reference', () => {
        expect(composableResult.category.value).toBeDefined()
        expect(composableResult.category.value?.id).toBe(secondCategory.id)
        expect(composableResult.category.value?.title).toBe(secondCategory.title)
      })

      BddTest().then('it should update categoryType, label and icon accordingly', () => {
        expect(composableResult.categoryType.value).toBe(secondCategory.type)

        const label = composableResult.categoryTypeLabel.value
        expect(typeof label).toBe('string')
        expect(label.length).toBeGreaterThan(0)

        const expectedIcon = getSelfKnowledgeCategoryIcon(
          secondCategory.type as ESelfKnowledgeCategoryType
        )
        expect(composableResult.categoryIcon.value).toBe(expectedIcon)
      })
    })
  }
})
