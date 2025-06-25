import AvTagPicker, { type AvTagPickerOption } from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('avTagPicker', () => {
  const stubs = {
    DsfrTag: {
      name: 'DsfrTag',
      props: ['label', 'icon', 'selected', 'disabled'],
      template: `<button @click="$emit('select')"><slot /></button>`
    }
  }

  const mockOptions: AvTagPickerOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
  ]

  describe('given an AvTagPicker without label', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      const props = {
        options: mockOptions,
        handleSelectChange: vi.fn()
      }

      wrapper = mount(AvTagPicker, {
        props
      })
    })

    describe('when the component is mounted', () => {
      it('then it should not render label', () => {
        const label = wrapper.find('.av-select-label')
        expect(label.exists()).toBe(false)
      })
    })
  })

  describe('given an AvTagPicker with label', () => {
    let wrapper: VueWrapper
    const testLabel = 'Test Label'

    beforeEach(() => {
      const props = {
        label: testLabel,
        options: mockOptions,
        handleSelectChange: vi.fn()
      }

      wrapper = mount(AvTagPicker, {
        props
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render given label', () => {
        const label = wrapper.find('.av-select-label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toContain(testLabel)
      })
    })
  })

  describe('given an AvTagPicker in single mode', () => {
    let wrapper: VueWrapper
    const handleSelectChange = vi.fn()

    beforeEach(() => {
      const props = {
        options: mockOptions,
        handleSelectChange,
        multiple: false
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })
    })

    describe('when an option is selected', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[1].trigger('select')
        await wrapper.vm.$nextTick()
      })

      it('then it should call handleSelectChange with selected option', () => {
        expect(handleSelectChange).toHaveBeenCalledWith(mockOptions[1])
      })

      it('then it should mark selected option as selected and disabled', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).not.toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).toContain('fr-tag--selected')
        expect(tags[1].classes()).toContain('fr-tag--disabled')
        expect(tags[2].classes()).not.toContain('fr-tag--selected')
        expect(tags[2].classes()).not.toContain('fr-tag--disabled')
      })
    })
  })

  describe('given an AvTagPicker in single mode with first option selected', () => {
    let wrapper: VueWrapper
    const handleSelectChange = vi.fn()

    beforeEach(async () => {
      const props = {
        options: mockOptions,
        handleSelectChange,
        multiple: false
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })

      const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
      await tags[0].trigger('select')
      await wrapper.vm.$nextTick()
    })

    describe('when another option is selected', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[1].trigger('select')
        await wrapper.vm.$nextTick()
      })

      it('then it should deselect the previous option and select the new one', () => {
        expect(handleSelectChange).toHaveBeenLastCalledWith(mockOptions[1])
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).not.toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).toContain('fr-tag--selected')
        expect(tags[1].classes()).toContain('fr-tag--disabled')
      })
    })
  })

  describe('given an AvTagPicker in multiple mode', () => {
    let wrapper: VueWrapper
    const handleSelectChange = vi.fn()

    beforeEach(() => {
      const props = {
        options: mockOptions,
        handleSelectChange,
        multiple: true
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })
    })

    describe('when first option is selected', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[0].trigger('select')
        await wrapper.vm.$nextTick()
      })

      it('then it should call handleSelectChange with array containing first option', () => {
        expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0]])
      })

      it('then it should mark first option as selected but not disabled', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).not.toContain('fr-tag--selected')
      })

      describe('and when second option is selected', () => {
        beforeEach(async () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          await tags[1].trigger('select')
          await wrapper.vm.$nextTick()
        })

        it('then it should call handleSelectChange with array containing both options', () => {
          expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0], mockOptions[1]])
        })

        it('then both options should be selected but not disabled', () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).toContain('fr-tag--selected')
          expect(tags[0].classes()).not.toContain('fr-tag--disabled')
          expect(tags[1].classes()).toContain('fr-tag--selected')
          expect(tags[1].classes()).not.toContain('fr-tag--disabled')
        })
      })
    })
  })

  describe('given an AvTagPicker in multiple mode with two options selected', () => {
    let wrapper: VueWrapper
    const handleSelectChange = vi.fn()

    beforeEach(async () => {
      const props = {
        options: mockOptions,
        handleSelectChange,
        multiple: true
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })

      const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
      await tags[0].trigger('select')
      await wrapper.vm.$nextTick()
      await tags[1].trigger('select')
      await wrapper.vm.$nextTick()
    })

    describe('when second option is clicked again', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[1].trigger('select')
        await wrapper.vm.$nextTick()
      })

      it('then it should deselect the second option', () => {
        expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0]])
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).not.toContain('fr-tag--selected')
        expect(tags[1].classes()).not.toContain('fr-tag--disabled')
      })
    })
  })

  describe('given an AvTagPicker with single selected option', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      const selectedOption: AvTagPickerOption = mockOptions[0]
      const handleSelectChange = vi.fn()
      const props = {
        options: mockOptions,
        selected: selectedOption,
        handleSelectChange
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should display the selected option as selected', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).toContain('fr-tag--selected')
        expect(tags[1].classes()).not.toContain('fr-tag--selected')
      })
    })
  })

  describe('given an AvTagPicker in multiple mode with array of selected options', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      const selectedOptions: AvTagPickerOption[] = [mockOptions[0], mockOptions[2]]
      const handleSelectChange = vi.fn()
      const props = {
        options: mockOptions,
        selected: selectedOptions,
        handleSelectChange,
        multiple: true
      }

      wrapper = mount(AvTagPicker, {
        props,
        global: { stubs }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should display the selected options as selected', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).toContain('fr-tag--selected')
        expect(tags[1].classes()).not.toContain('fr-tag--selected')
        expect(tags[2].classes()).toContain('fr-tag--selected')
      })
    })
  })
})
