import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import {
  type AdditionalSkillDTO,
  type AdditionalSkillProgressDTO,
  EAdditionalSkillType,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseAdditionalSkillProgressDTO,
  type PagedResponseSkillDTO,
  type PageInfoDTO,
  type SkillDTO
} from '@/api/avenir-esr'
import { useAdditionalSkillsViewQuery, useSearchAdditionalSkillsQuery, useSkillsViewQuery } from '@/features/student/queries'
import { PageSizes } from '@/ui/config'
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('useAdditionalSkillsViewQuery', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  describe('given valid query parameters', () => {
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO, BaseApiException> & {
        skills: Ref<AdditionalSkillDTO[] | AdditionalSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAdditionalSkillsViewQuery(page, pageSize))

        await flushPromises()
      })

      it('then it should return mocked skills data for given parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(4)
        expect(queryResult.data.value?.page?.page).toBe(0)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)
        expect(queryResult.data.value?.page?.totalPages).toBe(5)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.FOUR)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill).toHaveProperty('id')
        expect(firstSkill?.id).toMatch(uiidRegex)
        expect(firstSkill?.title).toContain('Ma super compétence')
        expect(firstSkill).toHaveProperty('pathSegments')
        expect(firstSkill).toHaveProperty('type')
      })

      it('then it should return computed skills array', () => {
        expect(queryResult.skills.value).toHaveLength(4)
        expect(queryResult.skills.value[0]).toHaveProperty('id')
        expect(queryResult.skills.value[0]).toHaveProperty('title')
      })

      it('then it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  describe('given different page and pageSize values', () => {
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    describe('when the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO, BaseApiException> & {
        skills: Ref<AdditionalSkillDTO[] | AdditionalSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAdditionalSkillsViewQuery(page, pageSize))
        await flushPromises()
      })

      it('then it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill?.title).toContain('Ma super compétence')
        expect(firstSkill?.id).toMatch(uiidRegex)
      })

      it('then it should return correct number of items based on pageSize', () => {
        expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  describe('given reactive parameters that change', () => {
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO, BaseApiException> & {
        skills: Ref<AdditionalSkillDTO[] | AdditionalSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAdditionalSkillsViewQuery(page, pageSize))
        await flushPromises()
      })

      describe('when page changes', () => {
        beforeEach(async () => {
          page.value = 1
          await flushPromises()
        })

        it('then the query should update with new page', () => {
          expect(queryResult.data.value?.page?.page).toBe(1)
        })
      })

      describe('when pageSize changes', () => {
        beforeEach(async () => {
          pageSize.value = PageSizes.EIGHT
          await flushPromises()
        })
        it('then the query should update with new pageSize', async () => {
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
          expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })
})

describe('useSkillsViewQuery', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given valid query parameters', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))

        await flushPromises()
      })

      it('then it should return mocked skills data for given parameters', () => {
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

      it('then it should return computed skills array', () => {
        expect(queryResult.skills.value).toHaveLength(4)
        expect(queryResult.skills.value[0]).toHaveProperty('id')
        expect(queryResult.skills.value[0]).toHaveProperty('name')
      })

      it('then it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  describe('given different page and pageSize values', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    describe('when the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))
        await flushPromises()
      })

      it('then it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill?.name).toContain('Ma super compétence')
        expect(firstSkill?.id).toMatch(uiidRegex)
      })

      it('then it should return correct number of items based on pageSize', () => {
        expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  describe('given reactive parameters that change', () => {
    const sort = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
        skills: Ref<SkillDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSkillsViewQuery(sort, page, pageSize))
        await flushPromises()
      })

      describe('when page changes', () => {
        beforeEach(async () => {
          page.value = 1
          await flushPromises()
        })

        it('then the query should update with new page', () => {
          expect(queryResult.data.value?.page?.page).toBe(1)
        })
      })

      describe('when pageSize changes', () => {
        beforeEach(async () => {
          pageSize.value = PageSizes.EIGHT
          await flushPromises()
        })
        it('then the query should update with new pageSize', async () => {
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
          expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })
})

describe('useSearchAdditionalSkillsQuery', () => {
  const uiidRegex = /^search-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  describe('given valid search parameters', () => {
    const keyword = ref('com')
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with keyword >= 3 characters', () => {
      let queryResult: ReturnType<typeof useSearchAdditionalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchAdditionalSkillsQuery(keyword, pageSize))
        await flushPromises()
      })

      it('then it should return search results matching the keyword', () => {
        expect(queryResult.skills.value.length).toBeGreaterThan(0)

        const firstSkill = queryResult.skills.value[0]
        expect(firstSkill).toHaveProperty('id')
        expect(firstSkill.id).toMatch(uiidRegex)
        expect(firstSkill.title.toLowerCase()).toContain('com')
        expect(firstSkill).toHaveProperty('pathSegments')
        expect(firstSkill).toHaveProperty('type')
        expect(firstSkill.type).toBe(EAdditionalSkillType.ROME4)
      })

      it('then it should have infinite query properties', () => {
        expect(queryResult.hasNextPage).toBeDefined()
        expect(queryResult.fetchNextPage).toBeDefined()
        expect(queryResult.isFetchingNextPage).toBeDefined()
      })
    })

    describe('when keyword is less than 3 characters', () => {
      const shortKeyword = ref('co')
      let queryResult: ReturnType<typeof useSearchAdditionalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchAdditionalSkillsQuery(shortKeyword, pageSize))
        await flushPromises()
      })

      it('then it should return empty skills array', () => {
        expect(queryResult.skills.value).toHaveLength(0)
      })
    })

    describe('when keyword is empty', () => {
      const emptyKeyword = ref('')
      let queryResult: ReturnType<typeof useSearchAdditionalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchAdditionalSkillsQuery(emptyKeyword, pageSize))
        await flushPromises()
      })

      it('then it should return empty skills array', () => {
        expect(queryResult.skills.value).toHaveLength(0)
      })
    })

    describe('when keyword changes from valid to invalid', () => {
      const dynamicKeyword = ref('communication')
      let queryResult: ReturnType<typeof useSearchAdditionalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchAdditionalSkillsQuery(dynamicKeyword, pageSize))
        await flushPromises()
      })

      it('then it should clear results when keyword becomes too short', async () => {
        expect(queryResult.skills.value.length).toBeGreaterThan(0)

        dynamicKeyword.value = 'co'
        await flushPromises()

        expect(queryResult.skills.value).toHaveLength(0)
      })
    })
  })
})
