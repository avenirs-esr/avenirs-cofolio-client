import type { Ref } from 'vue'
import {
  declaredExperienceDetailedQueryErrorHandler,
  declaredExperiencesQueryEmptyHandler,
  declaredExperiencesQueryErrorHandler
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  type DeclaredExperienceDetailedViewQueryReturnType,
  type DeclaredExperiencesViewQueryReturnType,
  useDeclaredExperienceDetailedViewQuery,
  useDeclaredExperiencesViewQuery
} from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experiences view query', () => {
  let queryResult: DeclaredExperiencesViewQueryReturnType
  let page: Ref<number>
  let pageSize: Ref<number>

  beforeEach(() => {
    vi.clearAllMocks()
    page = ref(0)
    pageSize = ref(10)
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return paginated data', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value?.data).toBeDefined()
      expect(queryResult.data.value?.page).toBeDefined()
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().then('it should compute declaredExperiences array', () => {
      expect(queryResult.declaredExperiences.value).toBeDefined()
      expect(Array.isArray(queryResult.declaredExperiences.value)).toBe(true)
    })

    BddTest().then('it should compute pageInfo object', () => {
      expect(queryResult.pageInfo.value).toBeDefined()
      expect(queryResult.pageInfo.value.page).toBe(0)
      expect(queryResult.pageInfo.value.pageSize).toBeDefined()
      expect(queryResult.pageInfo.value.totalElements).toBeDefined()
      expect(queryResult.pageInfo.value.totalPages).toBeDefined()
    })

    BddTest().then('it should return declared experiences with expected structure', () => {
      const firstExperience = queryResult.declaredExperiences.value[0]
      if (firstExperience) {
        expect(firstExperience).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          organization: expect.any(String),
          startDate: expect.any(String)
        })
      }
    })

    BddTest().and('the page parameter changes', () => {
      beforeEach(async () => {
        page.value = 1
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.page).toBe(1)
        })
      })

      BddTest().then('it should fetch new page data', () => {
        expect(queryResult.pageInfo.value.page).toBe(1)
      })

      BddTest().then('it should maintain success state', () => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().and('the pageSize parameter changes', () => {
      beforeEach(async () => {
        pageSize.value = 20
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.pageSize).toBe(20)
        })
      })

      BddTest().then('it should fetch data with new page size', () => {
        expect(queryResult.pageInfo.value.pageSize).toBe(20)
      })
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return empty declaredExperiences array', () => {
      expect(queryResult.declaredExperiences.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })

  BddTest().when('the query data is empty', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryEmptyHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should return empty array for declaredExperiences', () => {
      expect(queryResult.declaredExperiences.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo with zeros', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })
})

BddTest().given('a declared experience detailed view query', () => {
  let queryResult: DeclaredExperienceDetailedViewQueryReturnType
  const experienceId = ref('exp123')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredExperienceDetailedViewQuery({ experienceId }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return data with expected structure', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        organization: expect.any(String),
        startDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredExperienceDetailedQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperienceDetailedViewQuery({ experienceId }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return undefined', () => {
      expect(queryResult.data.value).toBeUndefined()
    })
  })
})
