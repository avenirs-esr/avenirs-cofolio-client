import type { Pinia } from 'pinia'
import { PageSizes, pageSizeValues } from '@/config'
import { useAmsStore, useTracesStore } from '@/store'
import AvPageSizePicker from '@/ui/interaction/picker/AvPageSizePicker/AvPageSizePicker.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, vi } from 'vitest'

describe('avPageSizePicker', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('given a page size picker with AMS store', () => {
    let wrapper: VueWrapper
    let store: ReturnType<typeof useAmsStore>

    beforeEach(() => {
      store = useAmsStore()
      const handleSelectChange = vi.fn()
      wrapper = mount(AvPageSizePicker, {
        props: { pageSizeSelected: store.pageSizeSelected, handleSelectChange },
        global: {
          plugins: [pinia]
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then it should render the label and options correctly', () => {
        let sizes = ''
        pageSizeValues.forEach((size) => {
          sizes += size.toString()
        })
        expect(wrapper.text()).toBe(`Nombre de résultats par page :${sizes}`)
      })
    })
  })

  describe('given a page size picker with Traces store', () => {
    let wrapper: VueWrapper
    let store: ReturnType<typeof useTracesStore>

    beforeEach(() => {
      store = useTracesStore()
      const handleSelectChange = vi.fn()
      wrapper = mount(AvPageSizePicker, {
        props: { pageSizeSelected: store.pageSizeSelected, handleSelectChange },
        global: {
          plugins: [pinia]
        }
      })
    })

    describe('when a value is selected via AvTagPicker', () => {
      beforeEach(async () => {
        const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)
      })

      it('then the store should be updated with the selected value', () => {
        expect(store.pageSizeSelected).toBe(PageSizes.EIGHT)
      })
    })
  })
})
