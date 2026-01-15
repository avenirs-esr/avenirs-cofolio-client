import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { usePaginatedDeclaredPrograms } from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the usePaginatedDeclaredProgram composable', () => {
  let composableResult: ReturnType<typeof usePaginatedDeclaredPrograms>

  const mountWithPageSize = () => {
    const { result } = mountComposable(
      () =>
        usePaginatedDeclaredPrograms({
          pageSize: 6
        }),
      {
        useTanstack: true
      }
    )

    composableResult = result
  }

  const mountWithoutPageSize = () => {
    const { result } = mountComposable(
      () =>
        usePaginatedDeclaredPrograms({}),
      {
        useTanstack: true
      }
    )

    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized with page size', () => {
    beforeEach(() => {
      mountWithPageSize()
    })

    BddTest().then('it should initialize with empty elements and page 0', () => {
      expect(composableResult.declaredPrograms.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('the composable is initialized without page size', () => {
    beforeEach(() => {
      mountWithoutPageSize()
    })

    BddTest().then('it should initialize with empty elements and page 0', () => {
      expect(composableResult.declaredPrograms.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('the composable is initialized with a page size and the first page is loaded', () => {
    beforeEach(async () => {
      mountWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into elements', () => {
      const elements = composableResult.declaredPrograms.value

      expect(elements.length).toBe(6)
      expect(elements[0]).toHaveProperty('id')
      expect(elements[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(6)
      expect(pageInfo.totalElements).toBeGreaterThan(0)
      expect(pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('the composable is initialized without a page size and the first page is loaded', () => {
    beforeEach(async () => {
      mountWithoutPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into elements with default page size', () => {
      const elements = composableResult.declaredPrograms.value

      expect(elements.length).toBe(3)
      expect(elements[0]).toHaveProperty('id')
      expect(elements[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(3)
      expect(pageInfo.totalElements).toBeGreaterThan(0)
      expect(pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('loadMoreDeclaredPrograms is called and more pages are available', () => {
    let firstPagePrograms: DeclaredProgramViewDTO[]

    beforeEach(async () => {
      mountWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBe(6)
      })

      firstPagePrograms = [...composableResult.declaredPrograms.value]

      composableResult.loadMoreDeclaredPrograms()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBeGreaterThan(
          firstPagePrograms.length
        )
      })
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate declaredPrograms from multiple pages', () => {
      const programs = composableResult.declaredPrograms.value

      expect(programs.length).toBe(12)

      const uniqueIds = new Set(programs.map(program => program.id))
      expect(uniqueIds.size).toBe(programs.length)
    })
  })

  BddTest().when('loadMoreDeclaredPrograms is called multiple times', () => {
    beforeEach(async () => {
      mountWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBe(6)
      })

      composableResult.loadMoreDeclaredPrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.declaredPrograms.value.length).toBe(12)
      })

      composableResult.loadMoreDeclaredPrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(2)
        expect(composableResult.declaredPrograms.value.length).toBe(18)
      })
    })

    BddTest().then('it should continue accumulating programs across pages', () => {
      const programs = composableResult.declaredPrograms.value

      expect(programs.length).toBe(18)

      const uniqueIds = new Set(programs.map(program => program.id))
      expect(uniqueIds.size).toBe(programs.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    beforeEach(async () => {
      mountWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredPrograms.value.length).toBe(6)
      })

      composableResult.loadMoreDeclaredPrograms()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(0)
      })
    })

    BddTest().then('it should reset page to 0 while keeping a valid elements list', () => {
      expect(composableResult.page.value).toBe(0)
      expect(composableResult.declaredPrograms.value.length).toBeGreaterThan(0)
    })
  })
})
