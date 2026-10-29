import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'
import { useStaffAssessmentsStore } from '@/features/staff/assessments/stores/assessments.store'

BddTest().given('a staff assessments store', () => {
  let store: ReturnType<typeof useStaffAssessmentsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStaffAssessmentsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide pagination state with default values', () => {
      expect(store.assessmentsCurrentPage).toBe(0)
      expect(store.assessmentsPageSizeSelected).toBe(PageSizes.TWELVE)
    })

    BddTest().and('updating assessments current page', () => {
      BddTest().then('it should allow updating the current page', () => {
        store.assessmentsCurrentPage = 2
        expect(store.assessmentsCurrentPage).toBe(2)
      })
    })

    BddTest().and('updating assessments page size', () => {
      BddTest().then('it should allow updating the page size', () => {
        store.assessmentsPageSizeSelected = PageSizes.FOUR
        expect(store.assessmentsPageSizeSelected).toBe(PageSizes.FOUR)
      })
    })
  })
})
