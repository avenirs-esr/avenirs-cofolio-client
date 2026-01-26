import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { usePaginatedDeclaredExperiences } from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/features/student/personalCareer/stores/personalCareer.store', () => ({
  usePersonalCareerStore: vi.fn()
}))

BddTest().given('the usePaginatedDeclaredExperiences composable', () => {
  let composableResult: ReturnType<typeof usePaginatedDeclaredExperiences>

  const mountComposableWithPageSize = () => {
    vi.mocked(usePersonalCareerStore).mockReturnValue({ declaredExperiencesPageSizeSelected: 4 } as any)

    const { result } = mountComposable(() => usePaginatedDeclaredExperiences({}), { useTanstack: true })
    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      mountComposableWithPageSize()
    })

    BddTest().then('it should initialize with empty elements and page 0', () => {
      expect(composableResult.declaredExperiences.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('the first page is loaded', () => {
    beforeEach(async () => {
      mountComposableWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredExperiences.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into declaredExperiences', () => {
      const elements = composableResult.declaredExperiences.value

      expect(elements.length).toBe(4)
      expect(elements[0]).toHaveProperty('id')
      expect(elements[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(4)
      expect(pageInfo.totalElements).toBeGreaterThan(0)
      expect(pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('loadMoreDeclaredExperiences is called and more pages are available', () => {
    let firstPageExperiences: DeclaredExperienceViewDTO[]

    beforeEach(async () => {
      mountComposableWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredExperiences.value.length).toBe(4)
      })

      firstPageExperiences = [...composableResult.declaredExperiences.value]

      composableResult.loadMoreDeclaredExperiences()

      await vi.waitFor(() => {
        expect(composableResult.declaredExperiences.value.length).toBeGreaterThan(
          firstPageExperiences.length
        )
      })
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate declaredExperiences from multiple pages', () => {
      const experiences = composableResult.declaredExperiences.value

      expect(experiences.length).toBe(8)

      const uniqueIds = new Set(experiences.map(experience => experience.id))
      expect(uniqueIds.size).toBe(experiences.length)
    })
  })

  BddTest().when('loadMoreDeclaredExperiences is called multiple times', () => {
    beforeEach(async () => {
      mountComposableWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredExperiences.value.length).toBe(4)
      })

      composableResult.loadMoreDeclaredExperiences()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.declaredExperiences.value.length).toBe(8)
      })
    })

    BddTest().then('it should continue accumulating experiences across pages', () => {
      const experiences = composableResult.declaredExperiences.value

      expect(experiences.length).toBe(8)

      const uniqueIds = new Set(experiences.map(experience => experience.id))
      expect(uniqueIds.size).toBe(experiences.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    beforeEach(async () => {
      mountComposableWithPageSize()

      await vi.waitFor(() => {
        expect(composableResult.declaredExperiences.value.length).toBe(4)
      })

      composableResult.loadMoreDeclaredExperiences()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(0)
      })
    })

    BddTest().then('it should reset page to 0 and clear elements', () => {
      expect(composableResult.page.value).toBe(0)
      expect(composableResult.declaredExperiences.value.length).toBe(0)
    })
  })
})
