import TracePageSizePicker from '@/common/components/PageSizePicker/TracePageSizePicker.vue'
import { PageSizes } from '@/config'
import { useTracesStore } from '@/store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('tracePageSizePickerWrapper', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render AvPageSizePicker with correct props', () => {
    const wrapper = mount(TracePageSizePicker, {
      global: {
        plugins: [createPinia()],
      },
    })

    const store = useTracesStore()
    expect(wrapper.findComponent({ name: 'AvPageSizePicker' }).exists()).toBe(true)
    expect(store.pageSizeSelected).toBeDefined()
  })

  it('should call handleSelectChange and update store when a valid page size is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(TracePageSizePicker, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useTracesStore()
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
