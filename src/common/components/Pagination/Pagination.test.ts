import Pagination from '@/common/components/Pagination/Pagination.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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

function createWrapper (props = {}, slots = {}) {
  return mount<typeof Pagination>(Pagination, {
    props: {
      pageInfo: defaultPageInfo,
      pageSizeSelected: PageSizes.EIGHT,
      onUpdateCurrentPage: vi.fn(),
      onUpdatePageSize: vi.fn(),
      ...props
    },
    global: {
      stubs: {
        AvPageSizePicker: {
          name: 'AvPageSizePicker',
          props: ['label', 'pageSizeSelected', 'handleSelectChange'],
          template: `<button class="page-size-picker" @click="handleSelectChange({ value: 12 })">Set 12</button>`
        },
        AvPagination: {
          name: 'AvPagination',
          props: ['id', 'currentPage', 'pages', 'ariaLabel', 'compact', 'truncLimit'],
          emits: ['update:current-page'],
          template: `<button class="av-pagination" @click="$emit('update:current-page', 2)">Page 2</button>`
        }
      }
    },
    slots
  })
}

BddTest().given('a pagination', () => {
  BddTest().and('valid props', () => {
    let wrapper: ReturnType<typeof mount<typeof Pagination>>

    beforeEach(() => {
      wrapper = createWrapper()
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render two AvPagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      BddTest().then('it should render AvPageSizePicker', () => {
        const pageSize = wrapper.findComponent({ name: 'AvPageSizePicker' })
        expect(pageSize.exists()).toBe(true)
      })

      BddTest().then('it should not add a truncLimit to AvPagination', () => {
        const topPagination = wrapper.findAllComponents({ name: 'AvPagination' }).find(c => c.props('id') === 'top-pagination')
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
        const wrapper = createWrapper({}, {
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
        const wrapper = createWrapper()

        const bottomPagination = wrapper.findAllComponents({ name: 'AvPagination' }).find(c => c.props('id') === 'bottom-pagination')
        expect(bottomPagination?.exists()).toBe(true)
        expect(bottomPagination!.props('truncLimit')).toBe(1)
      })

      BddTest().then('it should not render AvPageSizePicker', () => {
        const wrapper = createWrapper()
        expect(wrapper.findComponent({ name: 'AvPageSizePicker' }).exists()).toBe(false)
      })
    })
  })
})
