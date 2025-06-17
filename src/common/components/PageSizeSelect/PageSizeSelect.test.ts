import { PAGE_SIZES } from '@/constants'
import { usePageSizeSelect } from '@/store/page-size-select/page-size-select'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageSizeSelect from './PageSizeSelect.vue'

describe('pageSizeSelect.vue', () => {
  it('should render the label and options', () => {
    const wrapper = mount(PageSizeSelect, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.text()).toContain('Nombre de résultats par page :')
    PAGE_SIZES.forEach((size) => {
      expect(wrapper.text()).toContain(size.toString())
    })
  })

  it('should update the store when a value is selected', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = usePageSizeSelect()

    const wrapper = mount(PageSizeSelect, {
      global: {
        plugins: [pinia]
      }
    })

    const avSelect = wrapper.findComponent({ name: 'AvSelect' })
    await avSelect.props('handleSelectChange')(PAGE_SIZES[1])

    expect(store.pageSizeSelected).toBe(PAGE_SIZES[1])
  })
})
