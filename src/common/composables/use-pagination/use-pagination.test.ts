import { usePagination } from '@/common/composables/use-pagination/use-pagination'
import { PageSizes } from '@/ui/config'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick, type Ref } from 'vue'

describe('usePagination', () => {
  describe('given initial pagination state', () => {
    let storeCurrentPage: Ref<number>
    let storePageSizeSelected: Ref<PageSizes>
    let pagination: ReturnType<typeof usePagination>

    beforeEach(() => {
      storeCurrentPage = ref(2)
      storePageSizeSelected = ref(PageSizes.FOUR)
      pagination = usePagination(storeCurrentPage, storePageSizeSelected)
    })

    describe('when the composable is initialized', () => {
      it('then currentPage should equal storeCurrentPage', () => {
        expect(pagination.currentPage.value).toBe(0)
      })

      it('then pageSizeSelected should equal storePageSizeSelected', () => {
        expect(pagination.pageSizeSelected.value).toBe(PageSizes.FOUR)
      })

      it('then it should expose required properties and methods', () => {
        expect(pagination).toHaveProperty('currentPage')
        expect(pagination).toHaveProperty('pageSizeSelected')
        expect(pagination).toHaveProperty('onUpdateCurrentPage')
        expect(pagination).toHaveProperty('onUpdatePageSize')

        expect(typeof pagination.onUpdateCurrentPage).toBe('function')
        expect(typeof pagination.onUpdatePageSize).toBe('function')
      })
    })

    describe('when onUpdateCurrentPage is called', () => {
      beforeEach(() => {
        pagination.onUpdateCurrentPage(5)
      })

      it('then currentPage should be updated', () => {
        expect(pagination.currentPage.value).toBe(5)
        expect(storeCurrentPage.value).toBe(5)
      })
    })

    describe('when onUpdatePageSize is called', () => {
      beforeEach(() => {
        pagination.onUpdatePageSize(PageSizes.TWELVE)
      })

      it('then pageSizeSelected should be updated', () => {
        expect(pagination.pageSizeSelected.value).toBe(PageSizes.TWELVE)
        expect(storePageSizeSelected.value).toBe(PageSizes.TWELVE)
      })

      it('then currentPage should be reset to 0', () => {
        expect(pagination.currentPage.value).toBe(0)
        expect(storeCurrentPage.value).toBe(0)
      })
    })

    describe('when pageSizeSelected is changed externally', () => {
      beforeEach(() => {
        storeCurrentPage.value = 4
        storePageSizeSelected.value = PageSizes.EIGHT
      })

      it('then currentPage should be reset to 0 due to watch', () => {
        expect(pagination.currentPage.value).toBe(0)
      })
    })
  })

  describe('given multiple pagination instances', () => {
    let storePage1: Ref<number>
    let storePageSize1: Ref<PageSizes>
    let storePage2: Ref<number>
    let storePageSize2: Ref<PageSizes>
    let pagination1: ReturnType<typeof usePagination>
    let pagination2: ReturnType<typeof usePagination>

    beforeEach(() => {
      storePage1 = ref(1)
      storePageSize1 = ref(PageSizes.FOUR)
      storePage2 = ref(3)
      storePageSize2 = ref(PageSizes.EIGHT)

      pagination1 = usePagination(storePage1, storePageSize1)
      pagination2 = usePagination(storePage2, storePageSize2)
    })

    it('then each instance should be independent', async () => {
      pagination1.onUpdateCurrentPage(7)
      pagination2.onUpdateCurrentPage(2)

      expect(pagination1.currentPage.value).toBe(7)
      expect(pagination2.currentPage.value).toBe(2)

      pagination1.onUpdatePageSize(PageSizes.TWELVE)
      await nextTick()
      expect(pagination1.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(pagination1.currentPage.value).toBe(0)

      expect(pagination2.pageSizeSelected.value).toBe(PageSizes.EIGHT)
      expect(pagination2.currentPage.value).toBe(2)
    })
  })
})
