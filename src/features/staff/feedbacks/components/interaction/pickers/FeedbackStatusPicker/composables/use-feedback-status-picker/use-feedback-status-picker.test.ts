import { mockedFeedbackDashboard } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { getFeedbackDashboardErrorHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { useFeedbackStatusPicker } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/composables/use-feedback-status-picker/use-feedback-status-picker'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'

BddTest().given('useFeedbackStatusPicker composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('called without options and dashboard returns data', () => {
    let result: ReturnType<typeof useFeedbackStatusPicker>

    beforeEach(async () => {
      result = mountComposable(() => useFeedbackStatusPicker(), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().then('it should return totalFeedbacks from dashboard', () => {
      expect(result.totalFeedbacks.value).toBe(mockedFeedbackDashboard.totalFeedbacks)
    })

    BddTest().then('it should return newFeedbacks from dashboard', () => {
      expect(result.newFeedbacks.value).toBe(mockedFeedbackDashboard.newFeedbacks)
    })

    BddTest().then('it should return sentFeedbacks from processedFeedbacks', () => {
      expect(result.sentFeedbacks.value).toBe(mockedFeedbackDashboard.processedFeedbacks)
    })

    BddTest().then('it should compute unprocessedFeedbacks as pendingFeedbacks minus newFeedbacks', () => {
      expect(result.unprocessedFeedbacks.value).toBe(
        mockedFeedbackDashboard.pendingFeedbacks - mockedFeedbackDashboard.newFeedbacks
      )
    })

    BddTest().then('it should initialize selectedStatus as ALL', () => {
      expect(result.selectedStatus.value).toBe('ALL')
    })
  })

  BddTest().when('dashboard request fails', () => {
    let result: ReturnType<typeof useFeedbackStatusPicker>

    beforeEach(async () => {
      server.use(getFeedbackDashboardErrorHandler)
      result = mountComposable(() => useFeedbackStatusPicker(), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().then('it should return 0 for totalFeedbacks', () => {
      expect(result.totalFeedbacks.value).toBe(0)
    })

    BddTest().then('it should return 0 for newFeedbacks', () => {
      expect(result.newFeedbacks.value).toBe(0)
    })

    BddTest().then('it should return 0 for sentFeedbacks', () => {
      expect(result.sentFeedbacks.value).toBe(0)
    })

    BddTest().then('it should return 0 for unprocessedFeedbacks', () => {
      expect(result.unprocessedFeedbacks.value).toBe(0)
    })
  })

  BddTest().when('onStatusSelected is called', () => {
    let result: ReturnType<typeof useFeedbackStatusPicker>
    const mockOnReset = vi.fn()

    beforeEach(async () => {
      result = mountComposable(() => useFeedbackStatusPicker({ onReset: mockOnReset }), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().and('the option value is NEW', () => {
      beforeEach(() => {
        result.onStatusSelected({ value: EFeedbackStatus.NEW, label: 'New' })
      })

      BddTest().then('it should update selectedStatus to NEW', () => {
        expect(result.selectedStatus.value).toBe(EFeedbackStatus.NEW)
      })

      BddTest().then('it should call onReset', () => {
        expect(mockOnReset).toHaveBeenCalledOnce()
      })
    })

    BddTest().and('the option value is IN_PROCESS', () => {
      beforeEach(() => {
        result.onStatusSelected({ value: EFeedbackStatus.IN_PROCESS, label: 'Unprocessed' })
      })

      BddTest().then('it should update selectedStatus to IN_PROCESS', () => {
        expect(result.selectedStatus.value).toBe(EFeedbackStatus.IN_PROCESS)
      })

      BddTest().then('it should call onReset', () => {
        expect(mockOnReset).toHaveBeenCalledOnce()
      })
    })

    BddTest().and('the option value is SUBMITTED', () => {
      beforeEach(() => {
        result.onStatusSelected({ value: EFeedbackStatus.SUBMITTED, label: 'Sent' })
      })

      BddTest().then('it should update selectedStatus to SUBMITTED', () => {
        expect(result.selectedStatus.value).toBe(EFeedbackStatus.SUBMITTED)
      })

      BddTest().then('it should call onReset', () => {
        expect(mockOnReset).toHaveBeenCalledOnce()
      })
    })

    BddTest().and('the option value is SEEN', () => {
      beforeEach(() => {
        result.onStatusSelected({ value: EFeedbackStatus.SEEN, label: 'Seen' })
      })

      BddTest().then('it should update selectedStatus to SEEN', () => {
        expect(result.selectedStatus.value).toBe(EFeedbackStatus.SEEN)
      })

      BddTest().then('it should call onReset', () => {
        expect(mockOnReset).toHaveBeenCalledOnce()
      })
    })

    BddTest().and('the option value is ALL', () => {
      beforeEach(() => {
        result.onStatusSelected({ value: EFeedbackStatus.NEW, label: 'New' })
        result.onStatusSelected({ value: 'ALL', label: 'All' })
      })

      BddTest().then('it should reset selectedStatus to ALL', () => {
        expect(result.selectedStatus.value).toBe('ALL')
      })
    })
  })

  BddTest().when('called without onReset and onStatusSelected is called', () => {
    let result: ReturnType<typeof useFeedbackStatusPicker>

    beforeEach(async () => {
      result = mountComposable(() => useFeedbackStatusPicker(), { useTanstack: true }).result
      await flushPromises()
    })

    BddTest().then('it should not throw', () => {
      expect(() => result.onStatusSelected({ value: EFeedbackStatus.NEW, label: 'New' })).not.toThrow()
    })
  })

  BddTest().when('called with an activityId and dashboard returns data', () => {
    let result: ReturnType<typeof useFeedbackStatusPicker>

    beforeEach(async () => {
      result = mountComposable(
        () => useFeedbackStatusPicker({ activityId: 'activity-123' }),
        { useTanstack: true }
      ).result
      await flushPromises()
    })

    BddTest().then('it should return totalFeedbacks from dashboard', () => {
      expect(result.totalFeedbacks.value).toBe(mockedFeedbackDashboard.totalFeedbacks)
    })

    BddTest().then('it should compute unprocessedFeedbacks correctly', () => {
      expect(result.unprocessedFeedbacks.value).toBe(
        mockedFeedbackDashboard.pendingFeedbacks - mockedFeedbackDashboard.newFeedbacks
      )
    })
  })
})
