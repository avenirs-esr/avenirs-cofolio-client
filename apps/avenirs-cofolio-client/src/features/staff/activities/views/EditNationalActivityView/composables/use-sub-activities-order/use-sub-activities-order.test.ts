import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { SubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockedActivityContentWithSubActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE } from '@/features/staff/activities/config'
import { useSubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order'

const REORDER_ERROR_TITLE = 'Une erreur est survenue lors de l\'enregistrement de l\'ordre des sous-activités'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

BddTest().given('a useSubActivitiesOrder composable', () => {
  let order: SubActivitiesOrder

  const serverSubActivities = ref<SubActivityOverviewDTO[]>([])

  const mountWith = (activityDraftId = mockedActivityContentWithSubActivities.id) => {
    serverSubActivities.value = [...mockedActivityContentWithSubActivities.subActivities]

    const { result, unmount } = mountComposable(() => useSubActivitiesOrder(activityDraftId, serverSubActivities), {
      useTanstack: true,
      useI18n: true,
    })

    order = result
    return unmount
  }

  const reverseOrder = () => {
    order.orderedSubActivities.value = [...order.orderedSubActivities.value].reverse()
  }

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  BddTest().when('it is initialized', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should expose the sub-activities in the server order', () => {
      expect(order.orderedSubActivities.value).toEqual(serverSubActivities.value)
    })

    BddTest().then('it should have nothing to save', () => {
      expect(order.hasPendingChanges.value).toBe(false)
      expect(order.isSaving.value).toBe(false)
    })
  })

  BddTest().when('the user reorders the sub-activities', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      mountWith()
      reverseOrder()
    })

    BddTest().then('it should display the new order right away', () => {
      expect(order.orderedSubActivities.value).toEqual([...serverSubActivities.value].reverse())
    })

    BddTest().then('it should have pending changes', () => {
      expect(order.hasPendingChanges.value).toBe(true)
    })

    BddTest().and('the autosave delay has not elapsed yet', () => {
      beforeEach(async () => {
        await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE - 1)
      })

      BddTest().then('it should still have pending changes', () => {
        expect(order.hasPendingChanges.value).toBe(true)
      })
    })

    BddTest().and('the autosave delay elapses', () => {
      beforeEach(async () => {
        await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      })

      BddTest().then('it should no longer have pending changes', () => {
        expect(order.hasPendingChanges.value).toBe(false)
      })
    })

    BddTest().and('the user reorders them again before the end of the delay', () => {
      beforeEach(async () => {
        await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE / 2)
        reverseOrder()
        await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE / 2)
      })

      BddTest().then('it should restart the delay', () => {
        expect(order.hasPendingChanges.value).toBe(true)
      })
    })

    BddTest().and('the sub-activities are refetched before the save', () => {
      const addedSubActivity: SubActivityOverviewDTO = {
        ...serverSubActivities.value[0],
        id: 'added-sub-activity'
      }
      let refetchedSubActivities: SubActivityOverviewDTO[]

      beforeEach(async () => {
        refetchedSubActivities = serverSubActivities.value.slice(1).map(subActivity => ({
          ...subActivity,
          title: `${subActivity.title} (renommée)`,
        }))
        serverSubActivities.value = [...refetchedSubActivities, addedSubActivity]
        await nextTick()
      })

      BddTest().then('it should apply the local order to the refetched sub-activities and append the new ones', () => {
        expect(order.orderedSubActivities.value).toEqual([...refetchedSubActivities].reverse().concat(addedSubActivity))
      })
    })
  })

  BddTest().when('the user drops a sub-activity at its original position', () => {
    beforeEach(() => {
      mountWith()
      order.orderedSubActivities.value = [...serverSubActivities.value]
    })

    BddTest().then('it should have nothing to save', () => {
      expect(order.hasPendingChanges.value).toBe(false)
    })
  })

  BddTest().when('saveNow is called while an order is pending', () => {
    beforeEach(async () => {
      mountWith()
      reverseOrder()
      await order.saveNow()
    })

    BddTest().then('it should save without waiting for the delay', () => {
      expect(order.hasPendingChanges.value).toBe(false)
      expect(order.isSaving.value).toBe(false)
    })

    BddTest().then('it should keep the new order', () => {
      expect(order.orderedSubActivities.value).toEqual([...serverSubActivities.value].reverse())
    })
  })

  BddTest().when('the order is being sent', () => {
    beforeEach(async () => {
      mountWith('LOADING_ACTIVITY_DRAFT_ID')
      reverseOrder()
      void order.saveNow()

      await vi.waitFor(() => {
        expect(order.isSaving.value).toBe(true)
      })
    })

    BddTest().then('it should be saving, without pending changes', () => {
      expect(order.isSaving.value).toBe(true)
      expect(order.hasPendingChanges.value).toBe(false)
    })
  })

  BddTest().when('the server fails to save the order', () => {
    beforeEach(async () => {
      mountWith('INVALID_ACTIVITY_DRAFT_ID')
      reverseOrder()
      await order.saveNow()
    })

    BddTest().then('it should restore the server order', () => {
      expect(order.orderedSubActivities.value).toEqual(serverSubActivities.value)
    })

    BddTest().then('it should not leave pending changes', () => {
      expect(order.hasPendingChanges.value).toBe(false)
    })

    BddTest().then('it should display an error', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: REORDER_ERROR_TITLE }))
    })
  })

  BddTest().when('the view is left while an order is pending', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      const leaveView = mountWith()
      reverseOrder()
      leaveView()
    })

    BddTest().and('the autosave delay elapses', () => {
      beforeEach(async () => {
        await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      })

      BddTest().then('it should still save the order', () => {
        expect(order.hasPendingChanges.value).toBe(false)
      })
    })
  })
})
