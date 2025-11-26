import { useAdditionalSkillsStore } from '@/features/student/additionalSkills/stores/additionalSkills.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('an additional skills store', () => {
  let store: ReturnType<typeof useAdditionalSkillsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAdditionalSkillsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have default pagination values', () => {
      expect(store.currentPage).toBeDefined()
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBeDefined()
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })

    BddTest().then('it should have drawer state hidden by default', () => {
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
    })
  })

  BddTest().when('displayCreateAdditionalSkillDrawer is called', () => {
    beforeEach(() => {
      store.displayCreateAdditionalSkillDrawer()
    })

    BddTest().then('it should set showCreateAdditionalSkillDrawer to true', () => {
      expect(store.showCreateAdditionalSkillDrawer).toBe(true)
    })
  })

  BddTest().when('hideCreateAdditionalSkillDrawer is called after display', () => {
    beforeEach(() => {
      store.displayCreateAdditionalSkillDrawer()
      store.hideCreateAdditionalSkillDrawer()
    })

    BddTest().then('it should set showCreateAdditionalSkillDrawer back to false', () => {
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
    })
  })

  BddTest().when('the page size is changed', () => {
    beforeEach(() => {
      store.pageSizeSelected = PageSizes.FOUR
    })

    BddTest().then('it should reflect the new page size', () => {
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })
  })

  BddTest().when('the current page is updated', () => {
    beforeEach(() => {
      store.currentPage = 3
    })

    BddTest().then('it should reflect the new current page value', () => {
      expect(store.currentPage).toBe(3)
    })
  })
})
