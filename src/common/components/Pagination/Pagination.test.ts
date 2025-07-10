import Pagination from '@/common/components/Pagination/Pagination.vue'
import { PageSizes } from '@/ui/config'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const defaultPageInfo = {
  number: 1,
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
          props: ['id', 'currentPage', 'pages', 'ariaLabel', 'compact'],
          emits: ['update:current-page'],
          template: `<button class="pagination" @click="$emit('update:current-page', 2)">Page 2</button>`
        }
      }
    },
    slots
  })
}

describe('pagination', () => {
  describe('given valid props', () => {
    let wrapper: ReturnType<typeof mount<typeof Pagination>>

    beforeEach(() => {
      wrapper = createWrapper()
    })

    describe('when the component is mounted', () => {
      it('then it should render two AvPagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      it('then it should render AvPageSizePicker', () => {
        const pageSize = wrapper.findComponent({ name: 'AvPageSizePicker' })
        expect(pageSize.exists()).toBe(true)
      })
    })

    describe('when AvPagination emits update:current-page', () => {
      it('then it should call onUpdateCurrentPage with correct value', async () => {
        await wrapper.find('.pagination').trigger('click')
        expect(wrapper.props('onUpdateCurrentPage')).toHaveBeenCalledWith(2)
      })
    })

    describe('when AvPageSizePicker triggers handleSelectChange', () => {
      it('then it should call onUpdatePageSize with the selected value', async () => {
        await wrapper.find('.page-size-picker').trigger('click')
        expect(wrapper.props('onUpdatePageSize')).toHaveBeenCalledWith(12)
      })
    })
  })

  describe('given default slot is provided', () => {
    it('then it should render the slot content', () => {
      const wrapper = createWrapper({}, {
        default: '<div class="slot-content">Hello slot</div>'
      })

      expect(wrapper.find('.slot-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Hello slot')
    })
  })
})
