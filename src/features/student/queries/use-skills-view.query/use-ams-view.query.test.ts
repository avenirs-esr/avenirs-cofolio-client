import type { AmsViewDTO, PagedResponseAmsViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useAmsViewQuery } from '@/features/student/queries'
import { PageSizes } from '@/ui/config'
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('useAmsViewQuery', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given valid query parameters', () => {
    const studentProgressId = ref('program-123')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable<UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
          amss: Ref<AmsViewDTO[]>
          pageInfo: Ref<PageInfoDTO>
        }>(() => useAmsViewQuery(studentProgressId, page, pageSize))

        await flushPromises()
      })

      it('then it should return mocked AMS data for given parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(4)
        expect(queryResult.data.value?.page?.page).toBe(0)
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
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  describe('given undefined studentProgressId', () => {
    const studentProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when the query is executed with undefined studentProgressId', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
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
          page: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0
        })
      })
    })
  })

  describe('given different page and pageSize values', () => {
    const studentProgressId = ref('program-456')
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    describe('when the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      it('then it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
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
    const studentProgressId = ref('program-initial')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    describe('when parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      describe('when studentProgressId changes', () => {
        beforeEach(async () => {
          studentProgressId.value = 'program-updated'
          await flushPromises()
        })

        it('then the query should update with new studentProgressId', () => {
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
          expect(queryResult.amss.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })

  describe('given studentProgressId changes from undefined to defined', () => {
    const studentProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.TWELVE)

    describe('when studentProgressId becomes defined', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      describe('when studentProgressId is set to a valid value', () => {
        beforeEach(async () => {
          studentProgressId.value = 'program-enabled'
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
