import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared programs store', () => {
  let store: ReturnType<typeof usePersonalCareerStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePersonalCareerStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide drawer state and methods', () => {
      expect(store.showAddDeclaredProgramDrawer).toBeDefined()
      expect(store.displayAddDeclaredProgramDrawer).toBeDefined()
      expect(store.hideAddDeclaredProgramDrawer).toBeDefined()
    })

    BddTest().then('it should have drawer initially hidden', () => {
      expect(store.showAddDeclaredProgramDrawer).toBe(false)
    })

    BddTest().and('displaying the add declared program drawer', () => {
      beforeEach(() => {
        store.displayAddDeclaredProgramDrawer()
      })

      BddTest().then('it should set showAddDeclaredProgramDrawer to true', () => {
        expect(store.showAddDeclaredProgramDrawer).toBe(true)
      })
    })

    BddTest().and('hiding the add declared program drawer', () => {
      beforeEach(() => {
        store.displayAddDeclaredProgramDrawer()
        store.hideAddDeclaredProgramDrawer()
      })

      BddTest().then('it should set showAddDeclaredProgramDrawer to false', () => {
        expect(store.showAddDeclaredProgramDrawer).toBe(false)
      })
    })

    BddTest().and('toggling drawer visibility multiple times', () => {
      BddTest().then('it should correctly update the state', () => {
        expect(store.showAddDeclaredProgramDrawer).toBe(false)

        store.displayAddDeclaredProgramDrawer()
        expect(store.showAddDeclaredProgramDrawer).toBe(true)

        store.hideAddDeclaredProgramDrawer()
        expect(store.showAddDeclaredProgramDrawer).toBe(false)

        store.displayAddDeclaredProgramDrawer()
        expect(store.showAddDeclaredProgramDrawer).toBe(true)
      })
    })
  })
})
