import type { AmsViewDTO, PagedResponseAmsViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useAmsViewQuery } from '@/features/student/queries'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

BddTest().given('an useAmsViewQuery composable', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('valid query parameters', () => {
    const studentProgressId = ref('program-123')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('the query is executed with all parameters', () => {
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

      BddTest().then('it should return mocked AMS data for given parameters', () => {
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

      BddTest().then('it should return computed amss array', () => {
        expect(queryResult.amss.value).toHaveLength(4)
        expect(queryResult.amss.value[0]).toHaveProperty('id')
        expect(queryResult.amss.value[0]).toHaveProperty('title')
      })

      BddTest().then('it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  BddTest().and('undefined studentProgressId', () => {
    const studentProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('the query is executed with undefined studentProgressId', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      BddTest().then('the query should be disabled', () => {
        expect(queryResult.data.value).toBeUndefined()
      })

      BddTest().then('amss should return empty array', () => {
        expect(queryResult.amss.value).toEqual([])
      })

      BddTest().then('pageInfo should return default values', () => {
        expect(queryResult.pageInfo.value).toEqual({
          page: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0
        })
      })
    })
  })

  BddTest().and('different page and pageSize values', () => {
    const studentProgressId = ref('program-456')
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    BddTest().when('the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstAms = queryResult.data.value?.data?.[0]
        expect(firstAms?.title).toContain('program-456')
        expect(firstAms?.id).toMatch(uiidRegex)
      })

      BddTest().then('it should return correct number of items based on pageSize', () => {
        expect(queryResult.amss.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  BddTest().and('reactive parameters that change', () => {
    const studentProgressId = ref('program-initial')
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      BddTest().and('studentProgressId changes', () => {
        beforeEach(async () => {
          studentProgressId.value = 'program-updated'
          await flushPromises()
        })

        BddTest().then('the query should update with new studentProgressId', () => {
          expect(queryResult.data.value?.data).toHaveLength(PageSizes.FOUR)

          const firstAms = queryResult.data.value?.data?.[0]
          expect(firstAms?.title).toContain('program-updated')
          expect(firstAms?.id).toMatch(uiidRegex)
        })
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
          expect(queryResult.amss.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })

  BddTest().and('studentProgressId changes from undefined to defined', () => {
    const studentProgressId = ref<string | undefined>(undefined)
    const page = ref(0)
    const pageSize = ref(PageSizes.TWELVE)

    BddTest().when('studentProgressId becomes defined', () => {
      let queryResult: UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
        amss: Ref<AmsViewDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useAmsViewQuery(studentProgressId, page, pageSize))
        await flushPromises()
      })

      BddTest().and('studentProgressId is set to a valid value', () => {
        beforeEach(async () => {
          studentProgressId.value = 'program-enabled'
          await flushPromises()
        })

        BddTest().then('the query should become enabled and return data', () => {
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
