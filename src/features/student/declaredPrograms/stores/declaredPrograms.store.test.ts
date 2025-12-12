import { useDeclaredProgramsStore } from '@/features/student/declaredPrograms/stores/declaredPrograms.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared programs store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide drawer state and methods', () => {
      const store = useDeclaredProgramsStore()

      expect(store.showAddDeclaredProgramDrawer).toBeDefined()
      expect(store.displayAddDeclaredProgramDrawer).toBeDefined()
      expect(store.hideAddDeclaredProgramDrawer).toBeDefined()
    })

    BddTest().then('it should have drawer initially hidden', () => {
      const store = useDeclaredProgramsStore()

      expect(store.showAddDeclaredProgramDrawer).toBe(false)
    })
  })

  BddTest().when('displaying the add declared program drawer', () => {
    BddTest().then('it should set showAddDeclaredProgramDrawer to true', () => {
      const store = useDeclaredProgramsStore()

      store.displayAddDeclaredProgramDrawer()

      expect(store.showAddDeclaredProgramDrawer).toBe(true)
    })
  })

  BddTest().when('hiding the add declared program drawer', () => {
    BddTest().then('it should set showAddDeclaredProgramDrawer to false', () => {
      const store = useDeclaredProgramsStore()
      store.displayAddDeclaredProgramDrawer()

      store.hideAddDeclaredProgramDrawer()

      expect(store.showAddDeclaredProgramDrawer).toBe(false)
    })
  })

  BddTest().when('toggling drawer visibility multiple times', () => {
    BddTest().then('it should correctly update the state', () => {
      const store = useDeclaredProgramsStore()

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
