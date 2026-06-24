import type { NotificationDTO } from '@/api/avenir-esr'
import { EUserCategory } from '@/api/avenir-esr'
import { usePaginatedNotifications } from '@/common/notifications/composables/use-paginated-notifications/use-paginated-notifications'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the usePaginatedNotifications composable', () => {
  let composableResult: ReturnType<typeof usePaginatedNotifications>

  const mountDefault = () => {
    vi.clearAllMocks()

    const { result } = mountComposable(
      () => usePaginatedNotifications({ userCategory: EUserCategory.STUDENT }),
      { useTanstack: true }
    )
    composableResult = result
  }

  BddTest().when('the first page is loaded', () => {
    beforeEach(async () => {
      mountDefault()
      await vi.waitFor(() => {
        expect(composableResult.notifications.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into notifications', () => {
      const notifications = composableResult.notifications.value

      expect(notifications.length).toBe(8)
      expect(notifications[0]).toHaveProperty('id')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should match paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo).toBeDefined()
      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(8)
      expect(pageInfo.totalElements).toBeGreaterThan(0)
      expect(pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('loadMoreNotifications is called and more pages exist', () => {
    let firstPage: NotificationDTO[]

    beforeEach(async () => {
      mountDefault()
      await vi.waitFor(() => {
        expect(composableResult.notifications.value.length).toBe(8)
      })

      firstPage = [...composableResult.notifications.value]

      composableResult.loadMoreNotifications()

      await vi.waitFor(() => {
        expect(composableResult.notifications.value.length).toBeGreaterThan(firstPage.length)
      })
    })

    BddTest().then('it should increment page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate notifications across pages', () => {
      const notifications = composableResult.notifications.value

      expect(notifications.length).toBe(16)

      const uniqueIds = new Set(notifications.map(n => n.id))
      expect(uniqueIds.size).toBe(notifications.length)
    })
  })

  BddTest().when('loadMoreNotifications is called multiple times', () => {
    beforeEach(async () => {
      mountDefault()

      await vi.waitFor(() => {
        expect(composableResult.notifications.value.length).toBe(8)
      })

      composableResult.loadMoreNotifications()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.notifications.value.length).toBe(16)
      })

      composableResult.loadMoreNotifications()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(2)
        expect(composableResult.notifications.value.length).toBe(16)
      })
    })

    BddTest().then('it should continue accumulating across pages', () => {
      const notifications = composableResult.notifications.value
      const uniqueIds = new Set(notifications.map(n => n.id))

      expect(notifications.length).toBe(16)
      expect(uniqueIds.size).toBe(notifications.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    let pageAfterReset: number
    let lengthAfterReset: number

    beforeEach(async () => {
      mountDefault()

      await vi.waitFor(() => {
        expect(composableResult.notifications.value.length).toBe(8)
      })

      composableResult.loadMoreNotifications()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      pageAfterReset = composableResult.page.value
      lengthAfterReset = composableResult.notifications.value.length
    })

    BddTest().then('it should reset page and clear notifications', () => {
      expect(pageAfterReset).toBe(0)
      expect(lengthAfterReset).toBe(0)
    })
  })
})
