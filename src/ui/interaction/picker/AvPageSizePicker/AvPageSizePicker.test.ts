import { PageSizes, pageSizeValues } from '@/ui/config'
import AvPageSizePicker from '@/ui/interaction/picker/AvPageSizePicker/AvPageSizePicker.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('avPageSizePicker', () => {
  let wrapper: VueWrapper
  let handleSelectChange: () => void

  describe('given a page size picker', () => {
    beforeEach(() => {
      handleSelectChange = vi.fn()

      wrapper = mount(AvPageSizePicker, {
        props: { pageSizeSelected: PageSizes.TWELVE, handleSelectChange },
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

    describe('when the component is rendered', () => {
      it('then it should render the label', () => {
        const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(avTagPicker.props('label')).toContain('Nombre de résultats par page')
      })

      it('then it should render the correct options', () => {
        const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const options = avTagPicker.props('options')
        const expectedOptions = pageSizeValues.map(size => ({
          label: size.toString(),
          value: size.toString()
        }))

        expect(options).toEqual(expectedOptions)
      })

      it('then it should pass the correct selected option', () => {
        const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(avTagPicker.props('selected')).toEqual({
          label: PageSizes.TWELVE.toString(),
          value: PageSizes.TWELVE.toString()
        })
      })
    })

    describe('when a selection is made', () => {
      beforeEach(async () => {
        const avTagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        await avTagPicker.props('handleSelectChange')(PageSizes.EIGHT)
      })

      it('then it should call the handleSelectChange prop with the selected value', () => {
        expect(handleSelectChange).toHaveBeenCalledWith(PageSizes.EIGHT)
      })
    })
  })
})
