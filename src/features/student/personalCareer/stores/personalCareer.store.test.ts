import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a personal career store', () => {
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
      expect(store.showAddDeclaredExperienceDrawer).toBeDefined()
      expect(store.displayAddDeclaredExperienceDrawer).toBeDefined()
      expect(store.hideAddDeclaredExperienceDrawer).toBeDefined()
    })

    BddTest().then('it should have drawer initially hidden', () => {
      expect(store.showAddDeclaredProgramDrawer).toBe(false)
      expect(store.showAddDeclaredExperienceDrawer).toBe(false)
    })

    BddTest().then('it should provide declared programs pagination state', () => {
      expect(store.declaredProgramsCurrentPage).toBeDefined()
      expect(store.declaredProgramsPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default declared programs pagination values', () => {
      expect(store.declaredProgramsCurrentPage).toBe(0)
      expect(store.declaredProgramsPageSizeSelected).toBe(PageSizes.EIGHT)
    })

    BddTest().then('it should provide declared experiences pagination state', () => {
      expect(store.declaredExperiencesCurrentPage).toBeDefined()
      expect(store.declaredExperiencesPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default declared experiences pagination values', () => {
      expect(store.declaredExperiencesCurrentPage).toBe(0)
      expect(store.declaredExperiencesPageSizeSelected).toBe(PageSizes.FOUR)
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

    BddTest().and('displaying the add declared experience drawer', () => {
      beforeEach(() => {
        store.displayAddDeclaredExperienceDrawer()
      })

      BddTest().then('it should set showAddDeclaredExperienceDrawer to true', () => {
        expect(store.showAddDeclaredExperienceDrawer).toBe(true)
      })
    })

    BddTest().and('hiding the add declared experience drawer', () => {
      beforeEach(() => {
        store.displayAddDeclaredExperienceDrawer()
        store.hideAddDeclaredExperienceDrawer()
      })

      BddTest().then('it should set showAddDeclaredExperienceDrawer to false', () => {
        expect(store.showAddDeclaredExperienceDrawer).toBe(false)
      })
    })

    BddTest().and('toggling experience drawer visibility multiple times', () => {
      BddTest().then('it should correctly update the state', () => {
        expect(store.showAddDeclaredExperienceDrawer).toBe(false)

        store.displayAddDeclaredExperienceDrawer()
        expect(store.showAddDeclaredExperienceDrawer).toBe(true)

        store.hideAddDeclaredExperienceDrawer()
        expect(store.showAddDeclaredExperienceDrawer).toBe(false)

        store.displayAddDeclaredExperienceDrawer()
        expect(store.showAddDeclaredExperienceDrawer).toBe(true)
      })
    })

    BddTest().and('updating declared programs pagination', () => {
      BddTest().then('it should allow updating current page', () => {
        store.declaredProgramsCurrentPage = 2
        expect(store.declaredProgramsCurrentPage).toBe(2)
      })

      BddTest().then('it should allow updating page size', () => {
        store.declaredProgramsPageSizeSelected = PageSizes.EIGHT
        expect(store.declaredProgramsPageSizeSelected).toBe(PageSizes.EIGHT)
      })
    })

    BddTest().and('updating declared experiences pagination', () => {
      BddTest().then('it should allow updating current page', () => {
        store.declaredExperiencesCurrentPage = 3
        expect(store.declaredExperiencesCurrentPage).toBe(3)
      })

      BddTest().then('it should allow updating page size', () => {
        store.declaredExperiencesPageSizeSelected = PageSizes.TWELVE
        expect(store.declaredExperiencesPageSizeSelected).toBe(PageSizes.TWELVE)
      })
    })
  })
})
