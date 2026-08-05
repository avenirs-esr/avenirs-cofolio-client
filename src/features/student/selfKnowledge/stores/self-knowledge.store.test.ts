import { ESelfKnowledgeCategory, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge store', () => {
  let store: ReturnType<typeof useSelfKnowledgeStore>

  const mockCategory: SelfKnowledgeCategoryDTO = {
    type: ESelfKnowledgeCategory.STRENGTHS,
    mandatory: true
  }

  const anotherMockCategory: SelfKnowledgeCategoryDTO = {
    type: ESelfKnowledgeCategory.INTERESTS,
    mandatory: false
  }

  beforeEach(() => {
    const { result } = mountComposable(useSelfKnowledgeStore, { usePinia: true })
    store = result
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have selectedCategory as null', () => {
      expect(store.selectedCategory).toBeNull()
    })

    BddTest().then('it should have showAddElementDrawer as false', () => {
      expect(store.showAddElementDrawer).toBe(false)
    })

    BddTest().then('it should have openAddElementDrawer function', () => {
      expect(typeof store.openAddElementDrawer).toBe('function')
    })

    BddTest().then('it should have closeAddElementDrawer function', () => {
      expect(typeof store.closeAddElementDrawer).toBe('function')
    })
  })

  BddTest().when('opening add element drawer', () => {
    BddTest().then('it should set selectedCategory to the provided category', () => {
      store.openAddElementDrawer(mockCategory)

      expect(store.selectedCategory).toEqual(mockCategory)
    })

    BddTest().then('it should set showAddElementDrawer to true', () => {
      store.openAddElementDrawer(mockCategory)

      expect(store.showAddElementDrawer).toBe(true)
    })

    BddTest().then('it should update selectedCategory when called with different category', () => {
      store.openAddElementDrawer(mockCategory)
      expect(store.selectedCategory).toEqual(mockCategory)

      store.openAddElementDrawer(anotherMockCategory)
      expect(store.selectedCategory).toEqual(anotherMockCategory)
    })
  })

  BddTest().when('closing add element drawer', () => {
    BddTest().then('it should set showAddElementDrawer to false', () => {
      store.openAddElementDrawer(mockCategory)
      expect(store.showAddElementDrawer).toBe(true)

      store.closeAddElementDrawer()
      expect(store.showAddElementDrawer).toBe(false)
    })

    BddTest().then('it should not clear selectedCategory', () => {
      store.openAddElementDrawer(mockCategory)
      expect(store.selectedCategory).toEqual(mockCategory)

      store.closeAddElementDrawer()
      expect(store.selectedCategory).toEqual(mockCategory)
    })
  })

  BddTest().when('performing multiple drawer operations', () => {
    BddTest().then('it should handle open and close cycles correctly', () => {
      expect(store.showAddElementDrawer).toBe(false)
      expect(store.selectedCategory).toBeNull()

      store.openAddElementDrawer(mockCategory)
      expect(store.showAddElementDrawer).toBe(true)
      expect(store.selectedCategory).toEqual(mockCategory)

      store.closeAddElementDrawer()
      expect(store.showAddElementDrawer).toBe(false)
      expect(store.selectedCategory).toEqual(mockCategory)

      store.openAddElementDrawer(anotherMockCategory)
      expect(store.showAddElementDrawer).toBe(true)
      expect(store.selectedCategory).toEqual(anotherMockCategory)

      store.closeAddElementDrawer()
      expect(store.showAddElementDrawer).toBe(false)
      expect(store.selectedCategory).toEqual(anotherMockCategory)
    })
  })
})
