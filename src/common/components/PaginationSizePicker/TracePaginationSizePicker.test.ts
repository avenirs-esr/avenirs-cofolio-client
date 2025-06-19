import { useTracePaginationSizePicker } from '@/store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import AmsPaginationSizePicker from './AmsPaginationSizePicker.vue'

describe('tracePaginationSizePickerWrapper', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render AvPaginationSizePicker with correct props', () => {
    const wrapper = mount(AmsPaginationSizePicker, {
      global: {
        plugins: [createPinia()],
      },
    })

    const store = useTracePaginationSizePicker()
    expect(wrapper.findComponent({ name: 'AvPaginationSizePicker' }).exists()).toBe(true)
    expect(store.paginationSize).toBeDefined()
  })
})
