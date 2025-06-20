import { useAmsPageSizePicker } from '@/store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import AmsPageSizePicker from './AmsPageSizePicker.vue'

describe('amsPageSizePickerWrapper', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render AvPageSizePicker with correct props', () => {
    const wrapper = mount(AmsPageSizePicker, {
      global: {
        plugins: [createPinia()],
      },
    })

    const store = useAmsPageSizePicker()
    expect(wrapper.findComponent({ name: 'AvPageSizePicker' }).exists()).toBe(true)
    expect(store.pageSize).toBeDefined()
  })
})
