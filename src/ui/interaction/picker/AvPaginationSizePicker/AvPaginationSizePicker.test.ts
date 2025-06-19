import type { Pinia } from 'pinia'
import { PageSizes } from '@/config'
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
    Object.values(PageSizes).forEach((size) => {
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
    await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)

    expect(store.pageSizeSelected).toBe(PageSizes.EIGHT)
  })
})
