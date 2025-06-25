import type { AvTagPickerOption } from '@/ui'
import AmsPageSizePicker from '@/common/components/PageSizePicker/AmsPageSizePicker.vue'
import { PageSizes } from '@/config'
import { useAmsStore } from '@/store'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect } from 'vitest'

describe('amsPageSizePicker', () => {
  describe('given a page size picker component', () => {
    let wrapper: VueWrapper
    let store: ReturnType<typeof useAmsStore>

    beforeEach(() => {
      const pinia = createPinia()
      setActivePinia(pinia)
      wrapper = mount(AmsPageSizePicker, {
        global: {
          plugins: [pinia],
        },
      })
      store = useAmsStore()
    })

    describe('when the component is rendered', () => {
      it('then the AvPageSizePicker should be present', () => {
        expect(wrapper.findComponent({ name: 'AvPageSizePicker' }).exists()).toBe(true)
      })

      it('then the store pageSizeSelected should be defined', () => {
        expect(store.pageSizeSelected).toBeDefined()
      })
    })

    describe('when a valid page size is selected', () => {
      const validValue: AvTagPickerOption = {
        label: PageSizes.TWELVE.toString(),
        value: PageSizes.TWELVE.toString()
      }

      beforeEach(async () => {
        const picker = wrapper.findComponent({ name: 'AvPageSizePicker' })
        await picker.props('handleSelectChange')(validValue)
      })

      it('then the store should update with the selected page size', () => {
        expect(store.pageSizeSelected).toBe(Number(validValue.value))
      })
    })

    describe('when an invalid page size is selected', () => {
      const invalidValue: AvTagPickerOption = {
        label: '99',
        value: '99'
      }

      beforeEach(async () => {
        store.pageSizeSelected = PageSizes.FOUR
        const picker = wrapper.findComponent({ name: 'AvPageSizePicker' })
        await picker.props('handleSelectChange')(invalidValue)
      })

      it('then the store should maintain the previous valid value', () => {
        expect(store.pageSizeSelected).toBe(4)
      })
    })
  })
})
