import AmsPageSizePicker from '@/common/components/PageSizePicker/AmsPageSizePicker.vue'
import { PageSizes } from '@/config'
import { useAmsStore } from '@/store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

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

    const store = useAmsStore()
    expect(wrapper.findComponent({ name: 'AvPageSizePicker' }).exists()).toBe(true)
    expect(store.pageSizeSelected).toBeDefined()
  })

  it('should call handleSelectChange and update store when a valid page size is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(AmsPageSizePicker, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useAmsStore()
    const validValue = PageSizes.TWELVE
    const invalidValue = 99

    const picker = wrapper.findComponent({ name: 'AvPageSizePicker' })

    await picker.props('handleSelectChange')(validValue)
    expect(store.pageSizeSelected).toBe(validValue)

    store.pageSizeSelected = PageSizes.FOUR
    await picker.props('handleSelectChange')(invalidValue)
    expect(store.pageSizeSelected).toBe(4)
  })
})
