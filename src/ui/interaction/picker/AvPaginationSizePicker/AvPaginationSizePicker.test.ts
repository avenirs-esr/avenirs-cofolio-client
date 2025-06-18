import type { Pinia } from 'pinia'
import { PAGE_SIZES } from '@/config'
import { useAmsPaginationSizePicker, useTracePaginationSizePicker } from '@/store'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvPaginationSizePicker from './AvPaginationSizePicker.vue'

describe('pageSizeSelect.vue', () => {
  let pinia: Pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render the label and options', () => {
    const store = useAmsPaginationSizePicker()

    const wrapper = mount(AvPaginationSizePicker, {
      props: { store },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Nombre de résultats par page :')
    PAGE_SIZES.forEach((size) => {
      expect(wrapper.text()).toContain(size.toString())
    })
  })

  it('should update the store when a value is selected', async () => {
    const store = useTracePaginationSizePicker()

    const wrapper = mount(AvPaginationSizePicker, {
      props: { store },
      global: {
        plugins: [pinia]
      }
    })

    const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
    await avTagPicker.props('handleSelectChange')(PAGE_SIZES[1])

    expect(store.pageSizeSelected).toBe(PAGE_SIZES[1])
  })
})
