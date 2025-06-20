import type { Pinia } from 'pinia'
import { PageSizes } from '@/config'
import { useAmsPageSizePicker, useTracePageSizePicker } from '@/store'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvPageSizePicker from './AvPageSizePicker.vue'

describe('avPageSizePicker', () => {
  let pinia: Pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render the label and options', () => {
    const store = useAmsPageSizePicker()

    const wrapper = mount(AvPageSizePicker, {
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
    const store = useTracePageSizePicker()

    const wrapper = mount(AvPageSizePicker, {
      props: { store },
      global: {
        plugins: [pinia]
      }
    })

    const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
    await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)

    expect(store.pageSize).toBe(PageSizes.EIGHT)
  })
})
