import { useStaffFeedbacksStore } from '@/features/feedbacks/stores/feedbacks.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff feedbacks store', () => {
  let store: ReturnType<typeof useStaffFeedbacksStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStaffFeedbacksStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide feedback pagination state', () => {
      expect(store.feedbacksCurrentPage).toBeDefined()
      expect(store.feedbacksPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default feedback pagination values', () => {
      expect(store.feedbacksCurrentPage).toBe(0)
      expect(store.feedbacksPageSizeSelected).toBe(PageSizes.TWELVE)
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
