import type { AmsViewDTO, AmsViewResponse, PageInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { PageSizes } from '@/config'
import { useAmsViewQuery } from '@/features/student/queries'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...actual,
    getAmsView: vi.fn(),
  }
})

describe('useAmsViewQuery', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  /*
  // TODO: uncomment when mock removed from getAmsView
  const mockedGetAmsView = vi.mocked(getAmsView)
  */
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    /*
    // TODO: uncomment when mock removed from getAmsView
    mockedGetAmsView.mockImplementation(async ({ programProgressId, page, pageSize }) => {
      return createMockedAmsViewResponse(pageSize ?? PageSizes.FOUR, 20, page ?? 0, programProgressId)
    })
    */
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given valid query parameters', () => {
    const programProgressId = ref('program-123')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<AmsViewResponse, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfo>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable<UseQueryReturnType<AmsViewResponse, BaseApiException> & {
          amss: Ref<AmsViewDTO[]>
          pageInfo: Ref<PageInfo>
        }>(() => useAmsViewQuery(programProgressId, page, pageSize))

        await flushPromises()
      })

      it('then it should return mocked AMS data for given parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(4)
        expect(queryResult.data.value?.page?.number).toBe(0)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)
        expect(queryResult.data.value?.page?.totalPages).toBe(5)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.FOUR)

        const firstAms = queryResult.data.value?.data?.[0]
        expect(firstAms).toHaveProperty('id')
        expect(firstAms?.id).toMatch(uiidRegex)
        expect(firstAms?.title).toContain('program-123')
        expect(firstAms).toHaveProperty('countSkills')
        expect(firstAms).toHaveProperty('countTraces')
        expect(firstAms).toHaveProperty('status')
        expect(firstAms).toHaveProperty('progress')
      })

      it('then it should return computed amss array', () => {
        expect(queryResult.amss.value).toHaveLength(4)
        expect(queryResult.amss.value[0]).toHaveProperty('id')
        expect(queryResult.amss.value[0]).toHaveProperty('title')
      })

      it('then it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.number).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  describe('given undefined programProgressId', () => {
    const programProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with undefined programProgressId', () => {
      let queryResult: UseQueryReturnType<AmsViewResponse, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfo>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(programProgressId, page, pageSize))
        await flushPromises()
      })

      it('then the query should be disabled', () => {
        expect(queryResult.data.value).toBeUndefined()
      })

      it('then amss should return empty array', () => {
        expect(queryResult.amss.value).toEqual([])
      })

      it('then pageInfo should return default values', () => {
        expect(queryResult.pageInfo.value).toEqual({
          number: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0
        })
      })
    })
  })

  describe('given different page and pageSize values', () => {
    const programProgressId = ref('program-456')
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    describe('when the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<AmsViewResponse, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfo>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(programProgressId, page, pageSize))
        await flushPromises()
      })

      it('then it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.number).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstAms = queryResult.data.value?.data?.[0]
        expect(firstAms?.title).toContain('program-456')
        expect(firstAms?.id).toMatch(uiidRegex)
      })

      it('then it should return correct number of items based on pageSize', () => {
        expect(queryResult.amss.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  describe('given reactive parameters that change', () => {
    const programProgressId = ref('program-initial')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when parameter values are updated', () => {
      let queryResult: UseQueryReturnType<AmsViewResponse, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfo>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(programProgressId, page, pageSize))
        await flushPromises()
      })

      describe('when programProgressId changes', () => {
        beforeEach(async () => {
          programProgressId.value = 'program-updated'
          await flushPromises()
        })

        it('then the query should update with new programProgressId', () => {
          expect(queryResult.data.value?.data).toHaveLength(PageSizes.FOUR)

          const firstAms = queryResult.data.value?.data?.[0]
          expect(firstAms?.title).toContain('program-updated')
          expect(firstAms?.id).toMatch(uiidRegex)
        })
      })

      describe('when page changes', () => {
        beforeEach(async () => {
          page.value = 1
          await flushPromises()
        })

        it('then the query should update with new page', () => {
          expect(queryResult.data.value?.page?.number).toBe(1)
        })
      })

      describe('when pageSize changes', () => {
        beforeEach(async () => {
          pageSize.value = PageSizes.EIGHT
          await flushPromises()
        })
        it('then the query should update with new pageSize', async () => {
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
          expect(queryResult.amss.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })

  describe('given programProgressId changes from undefined to defined', () => {
    const programProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.TWELVE)

    describe('when programProgressId becomes defined', () => {
      let queryResult: UseQueryReturnType<AmsViewResponse, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfo>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(programProgressId, page, pageSize))
        await flushPromises()
      })

      describe('when programProgressId is set to a valid value', () => {
        beforeEach(async () => {
          programProgressId.value = 'program-enabled'
          await flushPromises()
        })

        it('then the query should become enabled and return data', () => {
          expect(queryResult.data.value?.data).toHaveLength(PageSizes.TWELVE)
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.TWELVE)
          expect(queryResult.amss.value).toHaveLength(PageSizes.TWELVE)

          const firstAms = queryResult.data.value?.data?.[0]
          expect(firstAms?.title).toContain('program-enabled')
          expect(firstAms?.id).toMatch(uiidRegex)
        })
      })
    })
  })
})
