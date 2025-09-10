import { PageSizes, pageSizeValues } from '@/ui/config'
import AvPageSizePicker from '@/ui/interaction/picker/AvPageSizePicker/AvPageSizePicker.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a page size picker', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvPageSizePicker>>
  let handleSelectChange: () => void

  beforeEach(() => {
    handleSelectChange = vi.fn()

    wrapper = mount(AvPageSizePicker, {
      props: { label: 'Nombre de résultats par page:', pageSizeSelected: PageSizes.TWELVE, handleSelectChange },
      global: {
        stubs: {
          AvTagPicker: {
            name: 'AvTagPicker',
            template: '<div class="av-tag-picker" @click="handleSelectChange" />',
            props: ['options', 'selected', 'handleSelectChange', 'label', 'multiple']
          }
        }
      }
    })
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should render the label', () => {
      const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
      expect(avTagPicker.props('label')).toContain('Nombre de résultats par page')
    })

    BddTest().then('it should render the correct options', () => {
      const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
      const options = avTagPicker.props('options')
      const expectedOptions = pageSizeValues.map(size => ({
        label: size.toString(),
        value: size.toString()
      }))

      expect(options).toEqual(expectedOptions)
    })

    BddTest().then('it should pass the correct selected option', () => {
      const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
      expect(avTagPicker.props('selected')).toEqual({
        label: PageSizes.TWELVE.toString(),
        value: PageSizes.TWELVE.toString()
      })
    })
  })

  BddTest().when('a selection is made', () => {
    beforeEach(async () => {
      const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
      await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)
    })

    BddTest().then('it should call the handleSelectChange prop with the selected value', () => {
      expect(handleSelectChange).toHaveBeenCalledWith(PageSizes.EIGHT)
    })
  })
})
