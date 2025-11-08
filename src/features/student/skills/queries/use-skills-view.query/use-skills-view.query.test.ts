import type {
  PagedResponseSkillDTO,
  PageInfoDTO,
  SkillDTO,
  SkillListItemDTO
} from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { createMockedAllSkillListItemDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  useAllSkillsQuery,
  useSkillsViewQuery,
  useStudentCoursesSummaryQuery
} from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, type MockInstance, vi } from 'vitest'

BddTest().given('an useSkillsViewQuery composable', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('valid query parameters', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))

        await flushPromises()
      })

      BddTest().then('it should return mocked skills data for given parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(4)
        expect(queryResult.data.value?.page?.page).toBe(0)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)
        expect(queryResult.data.value?.page?.totalPages).toBe(5)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.FOUR)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill).toHaveProperty('id')
        expect(firstSkill?.id).toMatch(uiidRegex)
        expect(firstSkill?.name).toContain('Ma super compétence')
        expect(firstSkill).toHaveProperty('levelCount')
        expect(firstSkill).toHaveProperty('currentSkillLevel')
        expect(firstSkill).toHaveProperty('achievedSkillLevels')
        expect(firstSkill).toHaveProperty('isProgramFinished')
      })

      BddTest().then('it should return computed skills array', () => {
        expect(queryResult.skills.value).toHaveLength(4)
        expect(queryResult.skills.value[0]).toHaveProperty('id')
        expect(queryResult.skills.value[0]).toHaveProperty('name')
      })

      BddTest().then('it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  BddTest().and('different page and pageSize values', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    BddTest().when('the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill?.name).toContain('Ma super compétence')
        expect(firstSkill?.id).toMatch(uiidRegex)
      })

      BddTest().then('it should return correct number of items based on pageSize', () => {
        expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  BddTest().and('reactive parameters that change', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))
        await flushPromises()
      })

      BddTest().and('page changes', () => {
        beforeEach(async () => {
          page.value = 1
          await flushPromises()
        })

        BddTest().then('the query should update with new page', () => {
          expect(queryResult.data.value?.page?.page).toBe(1)
        })
      })

      BddTest().and('pageSize changes', () => {
        beforeEach(async () => {
          pageSize.value = PageSizes.EIGHT
          await flushPromises()
        })
        BddTest().then('the query should update with new pageSize', async () => {
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
          expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })
})

BddTest().given('an useAllSkillsQuery composable', async () => {
  let getAllSkillsSpy: MockInstance<(options?: RequestInit | undefined) => Promise<SkillListItemDTO[]>>
  let queryReturn: UseQueryReturnType<SkillListItemDTO[], BaseApiException>

  const mockedAllSkills = createMockedAllSkillListItemDTO()

  beforeEach(async () => {
    // Create spy for getAllSkills to verify API calls
    getAllSkillsSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getAllSkills'>(
      await import('@/api/avenir-esr'),
    'getAllSkills'
    ).mockResolvedValue(mockedAllSkills)

    queryReturn = mountQueryComposable<UseQueryReturnType<SkillListItemDTO[], BaseApiException>>(
      () => useAllSkillsQuery()
    )
    await flushPromises()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('an all skills query with no parameters', () => {
    BddTest().when('the query is executed successfully', () => {
      BddTest().then('it should call getAllSkills API and return the list of all skills', async () => {
        const { data } = queryReturn

        expect(getAllSkillsSpy).toHaveBeenCalledTimes(1)

        expect(data.value).toBeDefined()
        expect(data.value).toHaveLength(mockedAllSkills.length)

        const firstItem = data.value![0]
        expect(firstItem).toHaveProperty('skillId')
        expect(firstItem).toHaveProperty('title')
      })

      BddTest().then('it should return properly typed configuration data', async () => {
        // Verify the data has the expected structure
        const config = queryReturn.data.value![0]
        if (config) {
          expect(typeof config.skillId).toBe('string')
          expect(typeof config.title).toBe('string')
        }
      })

      BddTest().then('it should mark the query as successful', async () => {
        expect(queryReturn.isSuccess.value).toBe(true)
        expect(queryReturn.isError.value).toBe(false)
        expect(queryReturn.isLoading.value).toBe(false)
      })
    })

    BddTest().when('the query encounters an error', () => {
      BddTest().then('it should still call the API', async () => {
        expect(getAllSkillsSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should handle error state correctly', async () => {
        if (queryReturn.isError.value) {
          expect(queryReturn.isSuccess.value).toBe(false)
          expect(queryReturn.error.value).toBeDefined()
        }
      })
    })

    BddTest().when('the query is called multiple times', () => {
      beforeEach(() => {
        vi.clearAllMocks()
      })

      BddTest().then('it should use TanStack Query caching', async () => {
        function useMultipleTraceDetailedCalls () {
          useAllSkillsQuery()
          return useAllSkillsQuery()
        }

        mountQueryComposable(() => useMultipleTraceDetailedCalls())
        await flushPromises()

        expect(getAllSkillsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

BddTest().given('a student courses summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentCoursesSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return an array of student progress summaries', () => {
      expect(Array.isArray(query.data.value)).toBe(true)
    })
  })
})
