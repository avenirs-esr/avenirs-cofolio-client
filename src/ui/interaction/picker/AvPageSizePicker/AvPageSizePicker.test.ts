import type { Pinia } from 'pinia'
import { PageSizes } from '@/config'
import { useAmsStore, useTracesStore } from '@/store'
import AvPageSizePicker from '@/ui/interaction/picker/AvPageSizePicker/AvPageSizePicker.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('avPageSizePicker', () => {
  let pinia: Pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render the label and options', () => {
    const store = useAmsStore()
    const handleSelectChange = vi.fn()

    const wrapper = mount(AvPageSizePicker, {
      props: { pageSizeSelected: store.pageSizeSelected, handleSelectChange },
      global: {
        plugins: [pinia]
      }
    })

    let sizes = ''
    Object.values(PageSizes).filter(v => typeof v === 'number').forEach((size) => {
      sizes += size.toString()
    })
    expect(wrapper.text()).toBe(`Nombre de résultats par page :${sizes}`)
  })

  it('should update the store when a value is selected', async () => {
    const store = useTracesStore()
    const handleSelectChange = vi.fn()

    const wrapper = mount(AvPageSizePicker, {
      props: { pageSizeSelected: store.pageSizeSelected, handleSelectChange },
      global: {
        plugins: [pinia]
      }
    })

    const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
    await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)

    expect(store.pageSizeSelected).toBe(PageSizes.EIGHT)
  })
})
