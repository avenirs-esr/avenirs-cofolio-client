import { useDeclaredSkillsStore } from '@/features/declaredSkills/stores/declaredSkills.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('an declared skills store', () => {
  let store: ReturnType<typeof useDeclaredSkillsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDeclaredSkillsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have default pagination values', () => {
      expect(store.currentPage).toBeDefined()
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBeDefined()
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })

    BddTest().then('it should have drawer state hidden by default', () => {
      expect(store.showCreateDeclaredSkillDrawer).toBe(false)
    })
  })

  BddTest().when('displayCreateDeclaredSkillDrawer is called', () => {
    beforeEach(() => {
      store.displayCreateDeclaredSkillDrawer()
    })

    BddTest().then('it should set showCreateDeclaredSkillDrawer to true', () => {
      expect(store.showCreateDeclaredSkillDrawer).toBe(true)
    })
  })

  BddTest().when('hideCreateDeclaredSkillDrawer is called after display', () => {
    beforeEach(() => {
      store.displayCreateDeclaredSkillDrawer()
      store.hideCreateDeclaredSkillDrawer()
    })

    BddTest().then('it should set showCreateDeclaredSkillDrawer back to false', () => {
      expect(store.showCreateDeclaredSkillDrawer).toBe(false)
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
