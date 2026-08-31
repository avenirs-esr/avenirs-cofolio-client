import { useStaffActivitiesStore } from '@/features/activities/stores/activities.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff activities store', () => {
  let store: ReturnType<typeof useStaffActivitiesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStaffActivitiesStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide modal state and methods', () => {
      expect(store.showAddActivityModal).toBeDefined()
      expect(store.displayAddActivityModal).toBeDefined()
      expect(store.hideAddActivityModal).toBeDefined()
    })

    BddTest().then('it should have modal initially hidden', () => {
      expect(store.showAddActivityModal).toBe(false)
    })

    BddTest().then('it should provide working space pagination state', () => {
      expect(store.workingSpaceCurrentPage).toBeDefined()
      expect(store.workingSpacePageSizeSelected).toBeDefined()
    })

    BddTest().then('it should provide feedback pagination state', () => {
      expect(store.feedbacksCurrentPage).toBeDefined()
      expect(store.feedbacksPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default working space pagination values', () => {
      expect(store.workingSpaceCurrentPage).toBe(0)
      expect(store.workingSpacePageSizeSelected).toBe(PageSizes.TWELVE)
    })

    BddTest().then('it should have default feedback pagination values', () => {
      expect(store.feedbacksCurrentPage).toBe(0)
      expect(store.feedbacksPageSizeSelected).toBe(PageSizes.TWELVE)
    })

    BddTest().and('displaying the add activity modal', () => {
      beforeEach(() => {
        store.displayAddActivityModal()
      })

      BddTest().then('it should set showAddActivityModal to true', () => {
        expect(store.showAddActivityModal).toBe(true)
      })
    })

    BddTest().and('hiding the add activity modal', () => {
      beforeEach(() => {
        store.displayAddActivityModal()
        store.hideAddActivityModal()
      })

      BddTest().then('it should set showAddActivityModal to false', () => {
        expect(store.showAddActivityModal).toBe(false)
      })
    })

    BddTest().and('toggling modal visibility multiple times', () => {
      BddTest().then('it should correctly update the state', () => {
        expect(store.showAddActivityModal).toBe(false)

        store.displayAddActivityModal()
        expect(store.showAddActivityModal).toBe(true)

        store.hideAddActivityModal()
        expect(store.showAddActivityModal).toBe(false)

        store.displayAddActivityModal()
        expect(store.showAddActivityModal).toBe(true)
      })
    })

    BddTest().and('updating working space pagination', () => {
      BddTest().then('it should allow updating current page', () => {
        store.workingSpaceCurrentPage = 2
        expect(store.workingSpaceCurrentPage).toBe(2)
      })

      BddTest().then('it should allow updating page size', () => {
        store.workingSpacePageSizeSelected = PageSizes.FOUR
        expect(store.workingSpacePageSizeSelected).toBe(PageSizes.FOUR)
      })
    })

    BddTest().and('updating feedback pagination', () => {
      BddTest().then('it should allow updating feedback current page', () => {
        store.feedbacksCurrentPage = 2
        expect(store.feedbacksCurrentPage).toBe(2)
      })

      BddTest().then('it should allow updating feedback page size', () => {
        store.feedbacksPageSizeSelected = PageSizes.FOUR
        expect(store.feedbacksPageSizeSelected).toBe(PageSizes.FOUR)
      })
    })
  })
})
