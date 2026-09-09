import Pagination from '@/common/components/Pagination/Pagination.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvPageSizePickerStub, AvPaginationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

export const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

const defaultPageInfo = {
  page: 1,
  totalPages: 3,
  totalElements: 30,
  pageSize: 10
}

BddTest().given('a pagination', () => {
  let wrapper: ReturnType<typeof mount<typeof Pagination>>

  function createWrapper (props = {}, slots = {}) {
    wrapper = mount<typeof Pagination>(Pagination, {
      props: {
        pageInfo: defaultPageInfo,
        pageSizeSelected: PageSizes.EIGHT,
        onUpdateCurrentPage: vi.fn(),
        onUpdatePageSize: vi.fn(),
        ...props
      },
      global: {
        stubs: {
          AvPageSizePicker: AvPageSizePickerStub,
          AvPagination: AvPaginationStub
        }
      },
      slots
    })
  }

  function getAvPaginations () {
    return wrapper.findAllComponents(AvPaginationStub)
  }

  function getAvPageSizePicker () {
    return wrapper.findComponent(AvPageSizePickerStub)
  }

  BddTest().and('valid props', () => {
    beforeEach(() => {
      createWrapper()
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render two AvPagination components', () => {
        const paginations = getAvPaginations()
        expect(paginations).toHaveLength(2)
      })

      BddTest().then('it should render AvPageSizePicker', () => {
        const pageSize = getAvPageSizePicker()
        expect(pageSize.exists()).toBe(true)
      })

      BddTest().then('it should not add a truncLimit to AvPagination', () => {
        const topPagination = getAvPaginations().find(c => c.props('id') === 'top-pagination')
        expect(topPagination?.exists()).toBe(true)
        expect(topPagination!.props('truncLimit')).toBeUndefined()
      })
    })

    BddTest().when('AvPagination emits update:current-page', () => {
      BddTest().then('it should call onUpdateCurrentPage with correct value', async () => {
        await wrapper.find('.av-pagination').trigger('click')
        expect(wrapper.props('onUpdateCurrentPage')).toHaveBeenCalledWith(2)
      })
    })

    BddTest().when('AvPageSizePicker triggers handleSelectChange', () => {
      BddTest().then('it should call onUpdatePageSize with the selected value', async () => {
        await wrapper.find('.page-size-picker').trigger('click')
        expect(wrapper.props('onUpdatePageSize')).toHaveBeenCalledWith(12)
      })
    })
  })

  BddTest().and('a provided default slot', () => {
    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the slot content', () => {
        createWrapper({}, {
          default: '<div class="slot-content">Hello slot</div>'
        })

        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(wrapper.text()).toContain('Hello slot')
      })
    })
  })

  BddTest().and('it is viewed in mobile', () => {
    BddTest().when('the component is mounted', () => {
      BddTest().then('it should add a truncLimit to AvPagination', () => {
        mockIsMobile.value = true
        createWrapper()

        const bottomPagination = getAvPaginations().find(c => c.props('id') === 'bottom-pagination')
        expect(bottomPagination?.exists()).toBe(true)
        expect(bottomPagination!.props('truncLimit')).toBe(1)
      })

      BddTest().then('it should not render AvPageSizePicker', () => {
        createWrapper()
        expect(getAvPageSizePicker().exists()).toBe(false)
      })
    })
  })
})
