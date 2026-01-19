import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { useDeclaredProgramsPaginated } from '@/features/student/personalCareer/composables/use-declared-programs-paginated/use-declared-programs-paginated'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useDeclaredProgramsPaginated composable', () => {
  let composableResult: ReturnType<typeof useDeclaredProgramsPaginated>

  const mountComposableUnderTest = () => {
    const { result } = mountComposable(
      () =>
        useDeclaredProgramsPaginated({
          pageSize: 3
        }),
      {
        useTanstack: true
      }
    )

    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is mounted', () => {
    beforeEach(() => {
      mountComposableUnderTest()
    })

    BddTest().then('it should initialize with empty programs and page 0', () => {
      expect(composableResult.programs.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('the first page is loaded', () => {
    beforeEach(async () => {
      mountComposableUnderTest()

      await vi.waitFor(() => {
        expect(composableResult.programs.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into programs', () => {
      const programs = composableResult.programs.value

      expect(programs.length).toBe(3)
      expect(programs[0]).toHaveProperty('id')
      expect(programs[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(3)
      expect(pageInfo.totalElements).toBe(5)
      expect(pageInfo.totalPages).toBe(2)
    })
  })

  BddTest().when('loadMorePrograms is called and more pages are available', () => {
    let firstPagePrograms: DeclaredProgramViewDTO[]

    beforeEach(async () => {
      mountComposableUnderTest()

      await vi.waitFor(() => {
        expect(composableResult.programs.value.length).toBe(3)
      })

      firstPagePrograms = [...composableResult.programs.value]

      composableResult.loadMorePrograms()

      await vi.waitFor(() => {
        expect(composableResult.programs.value.length).toBeGreaterThan(firstPagePrograms.length)
      })
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate programs from multiple pages', () => {
      const programs = composableResult.programs.value

      expect(programs.length).toBe(5)

      const uniqueIds = new Set(programs.map(p => p.id))
      expect(uniqueIds.size).toBe(programs.length)
    })
  })

  BddTest().when('loadMorePrograms is called multiple times', () => {
    beforeEach(async () => {
      mountComposableUnderTest()

      await vi.waitFor(() => {
        expect(composableResult.programs.value.length).toBe(3)
      })

      composableResult.loadMorePrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.programs.value.length).toBe(5)
      })

      composableResult.loadMorePrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.programs.value.length).toBe(5)
      })
    })

    BddTest().then('it should stop accumulating when the last page is reached', () => {
      const programs = composableResult.programs.value

      expect(programs.length).toBe(5)

      const uniqueIds = new Set(programs.map(p => p.id))
      expect(uniqueIds.size).toBe(programs.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    beforeEach(async () => {
      mountComposableUnderTest()

      await vi.waitFor(() => {
        expect(composableResult.programs.value.length).toBe(3)
      })

      composableResult.loadMorePrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.programs.value.length).toBe(5)
      })

      composableResult.resetPagination()

      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(0)
      })
    })

    BddTest().then('it should reset page to 0 while keeping a valid programs list', () => {
      expect(composableResult.page.value).toBe(0)
      expect(composableResult.programs.value.length).toBeGreaterThan(0)
    })
  })
})
