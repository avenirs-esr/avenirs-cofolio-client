import { useSkillsStore } from '@/store/skills/skills'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { createPinia, setActivePinia } from 'pinia'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a skills store', () => {
  let store: ReturnType<typeof useSkillsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSkillsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have the default props', () => {
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
      expect(store.additionalCurrentPage).toBe(0)
      expect(store.additionalPageSizeSelected).toBe(PageSizes.FOUR)
    })

    BddTest().then('it should have additional skills drawer state', () => {
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
      expect(typeof store.displayCreateAdditionalSkillDrawer).toBe('function')
      expect(typeof store.hideCreateAdditionalSkillDrawer).toBe('function')
    })
  })

  BddTest().when('the props are updated', () => {
    BddTest().then('it should have the updated props', () => {
      const newCurrentPage = 1
      store.currentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.pageSizeSelected = newPageSizeSelected
      expect(store.pageSizeSelected).toBe(newPageSizeSelected)
    })
  })

  BddTest().when('additional skills drawer is managed', () => {
    BddTest().then('it should display drawer when displayCreateAdditionalSkillDrawer is called', () => {
      store.displayCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(true)
    })

    BddTest().then('it should hide drawer when hideCreateAdditionalSkillDrawer is called', () => {
      store.displayCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(true)

      store.hideCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
    })
  })
})
