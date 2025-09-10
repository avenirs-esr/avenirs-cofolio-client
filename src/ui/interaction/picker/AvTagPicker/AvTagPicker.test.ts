import AvTagPicker, { type AvTagPickerOption } from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an AvTagPicker', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvTagPicker>>

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

  BddTest().and('without label', () => {
    beforeEach(() => {
      const props = {
        options: mockOptions,
        handleSelectChange: vi.fn()
      }

      wrapper = mount(AvTagPicker, { props })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not render label', () => {
        const label = wrapper.find('.av-select-label')
        expect(label.exists()).toBe(false)
      })
    })
  })

  BddTest().and('with label', () => {
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

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render given label', () => {
        const label = wrapper.find('.av-select-label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toContain(testLabel)
      })
    })
  })

  BddTest().and('in single mode', () => {
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

    BddTest().when('an option is selected', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[1].trigger('select')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should call handleSelectChange with selected option', () => {
        expect(handleSelectChange).toHaveBeenCalledWith(mockOptions[1])
      })

      BddTest().then('it should mark selected option as selected and disabled', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).not.toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).toContain('fr-tag--selected')
        expect(tags[1].classes()).toContain('fr-tag--disabled')
        expect(tags[2].classes()).not.toContain('fr-tag--selected')
        expect(tags[2].classes()).not.toContain('fr-tag--disabled')
      })
    })

    BddTest().and('with first option selected', () => {
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

      BddTest().when('another option is selected', () => {
        beforeEach(async () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          await tags[1].trigger('select')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should deselect the previous option and select the new one', () => {
          expect(handleSelectChange).toHaveBeenLastCalledWith(mockOptions[1])
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).not.toContain('fr-tag--selected')
          expect(tags[0].classes()).not.toContain('fr-tag--disabled')
          expect(tags[1].classes()).toContain('fr-tag--selected')
          expect(tags[1].classes()).toContain('fr-tag--disabled')
        })
      })
    })
  })

  BddTest().and('in multiple mode', () => {
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

    BddTest().when('first option is selected', () => {
      beforeEach(async () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        await tags[0].trigger('select')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should call handleSelectChange with array containing first option', () => {
        expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0]])
      })

      BddTest().then('it should mark first option as selected but not disabled', () => {
        const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
        expect(tags[0].classes()).toContain('fr-tag--selected')
        expect(tags[0].classes()).not.toContain('fr-tag--disabled')
        expect(tags[1].classes()).not.toContain('fr-tag--selected')
      })

      BddTest().when('when second option is selected', () => {
        beforeEach(async () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          await tags[1].trigger('select')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call handleSelectChange with array containing both options', () => {
          expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0], mockOptions[1]])
        })

        BddTest().then('both options should be selected but not disabled', () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).toContain('fr-tag--selected')
          expect(tags[0].classes()).not.toContain('fr-tag--disabled')
          expect(tags[1].classes()).toContain('fr-tag--selected')
          expect(tags[1].classes()).not.toContain('fr-tag--disabled')
        })
      })
    })

    BddTest().and('with two options selected', () => {
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

      BddTest().when('second option is clicked again', () => {
        beforeEach(async () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          await tags[1].trigger('select')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should deselect the second option', () => {
          expect(handleSelectChange).toHaveBeenLastCalledWith([mockOptions[0]])
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).toContain('fr-tag--selected')
          expect(tags[0].classes()).not.toContain('fr-tag--disabled')
          expect(tags[1].classes()).not.toContain('fr-tag--selected')
          expect(tags[1].classes()).not.toContain('fr-tag--disabled')
        })
      })
    })

    BddTest().and('with single selected option', () => {
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

      BddTest().when('the component is mounted', () => {
        BddTest().then('it should display the selected option as selected', () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).toContain('fr-tag--selected')
          expect(tags[1].classes()).not.toContain('fr-tag--selected')
        })
      })
    })

    BddTest().and('with array of selected options', () => {
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

      BddTest().when('the component is mounted', () => {
        BddTest().then('it should display the selected options as selected', () => {
          const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
          expect(tags[0].classes()).toContain('fr-tag--selected')
          expect(tags[1].classes()).not.toContain('fr-tag--selected')
          expect(tags[2].classes()).toContain('fr-tag--selected')
        })
      })
    })
  })
})
