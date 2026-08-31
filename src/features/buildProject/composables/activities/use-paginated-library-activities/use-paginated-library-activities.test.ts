import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import { largeLibraryActivitiesHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { usePaginatedLibraryActivities } from '@/features/buildProject/composables/activities/use-paginated-library-activities/use-paginated-library-activities'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the usePaginatedLibraryActivities composable', () => {
  let composableResult: ReturnType<typeof usePaginatedLibraryActivities>

  const mountPaginatedComposable = () => {
    server.use(largeLibraryActivitiesHandler)
    const { result } = mountComposable(() => usePaginatedLibraryActivities(), { useTanstack: true })
    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the first page is loaded', () => {
    beforeEach(async () => {
      mountPaginatedComposable()

      await vi.waitFor(() => {
        expect(composableResult.activities.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into activities', () => {
      const activities = composableResult.activities.value

      expect(activities.length).toBe(10)
      expect(activities[0]).toHaveProperty('id')
      expect(activities[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo).toBeDefined()
      expect(pageInfo!.page).toBe(0)
      expect(pageInfo!.pageSize).toBe(10)
      expect(pageInfo!.totalElements).toBeGreaterThan(0)
      expect(pageInfo!.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('loadMoreActivities is called and more pages are available', () => {
    let firstPageActivities: DeclaredActivityViewDTO[]

    beforeEach(async () => {
      mountPaginatedComposable()

      await vi.waitFor(() => {
        expect(composableResult.activities.value.length).toBe(10)
      })

      firstPageActivities = [...composableResult.activities.value]

      composableResult.loadMoreActivities()

      await vi.waitFor(() => {
        expect(composableResult.activities.value.length).toBeGreaterThan(
          firstPageActivities.length
        )
      })
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate activities from multiple pages', () => {
      const activities = composableResult.activities.value

      expect(activities.length).toBe(20)

      const uniqueIds = new Set(activities.map(activity => activity.id))
      expect(uniqueIds.size).toBe(activities.length)
    })
  })

  BddTest().when('loadMoreActivities is called multiple times', () => {
    beforeEach(async () => {
      mountPaginatedComposable()

      await vi.waitFor(() => {
        expect(composableResult.activities.value.length).toBe(10)
      })

      composableResult.loadMoreActivities()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.activities.value.length).toBe(20)
      })

      composableResult.loadMoreActivities()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(2)
        expect(composableResult.activities.value.length).toBe(30)
      })
    })

    BddTest().then('it should continue accumulating activities across pages', () => {
      const activities = composableResult.activities.value

      expect(activities.length).toBe(30)

      const uniqueIds = new Set(activities.map(activity => activity.id))
      expect(uniqueIds.size).toBe(activities.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    let pageAfterReset: number
    let activitiesLengthAfterReset: number

    beforeEach(async () => {
      mountPaginatedComposable()

      await vi.waitFor(() => {
        expect(composableResult.activities.value.length).toBe(10)
      })

      composableResult.loadMoreActivities()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      pageAfterReset = composableResult.page.value
      activitiesLengthAfterReset = composableResult.activities.value.length
    })

    BddTest().then('it should reset page to 0 and clear activities', () => {
      expect(pageAfterReset).toBe(0)
      expect(activitiesLengthAfterReset).toBe(0)
    })
  })
})
