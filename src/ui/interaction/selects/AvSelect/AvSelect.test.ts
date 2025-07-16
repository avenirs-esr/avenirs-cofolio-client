import AvSelect from '@/ui/interaction/selects/AvSelect/AvSelect.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

const stubs = {
  DsfrSelect: {
    name: 'DsfrSelect',
    props: [
      'title',
      'modelValue',
      'options',
      'label',
      'required',
      'disabled',
      'hint',
      'name',
      'selectId',
      'errorMessage',
      'successMessage'
    ],
    emits: ['update:model-value'],
    template: `
      <div class="dsfr-select">
        <select @change="$emit('update:model-value', $event.target.value)">
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    `
  }
}

const options = [
  { value: '1', text: 'Option 1' },
  { value: '2', text: 'Option 2' },
  { value: '3', text: 'Option 3', disabled: true }
]

const defaultProps = {
  modelValue: null,
  defaultUnselectedText: 'Select an option',
  options
}

function mountWithProps (props = {}) {
  return mount(AvSelect, {
    props: { ...defaultProps, ...props },
    global: { stubs }
  })
}

describe('avSelect', () => {
  describe('given a select component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountWithProps()
    })

    describe('when the component is mounted', () => {
      it('then it should render the default title', () => {
        expect(wrapper.findComponent({ name: 'DsfrSelect' }).props('title')).toBe('Select an option')
      })

      it('then it should display all available options', () => {
        expect(wrapper.text()).toContain('Option 1')
        expect(wrapper.text()).toContain('Option 2')
        expect(wrapper.text()).toContain('Option 3')
      })
    })

    describe('when the user selects a new value (changes via select)', () => {
      it('then it should emit update:modelValue with new value', async () => {
        await wrapper.find('select').setValue('1')
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['1'])
      })
    })
  })

  describe('given a select component with a valid modelValue', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountWithProps({ modelValue: '2' })
    })

    describe('when the component is mounted', () => {
      it('then it should use the matching option as title', () => {
        expect(wrapper.findComponent({ name: 'DsfrSelect' }).props('title')).toBe('Option 2')
      })
    })
  })

  describe('given a select component with an unknown modelValue', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountWithProps({ modelValue: '999' })
    })

    describe('when the component is mounted', () => {
      it('then it should fallback to defaultUnselectedText', () => {
        expect(wrapper.findComponent({ name: 'DsfrSelect' }).props('title')).toBe('Select an option')
      })
    })
  })

  describe('given a select component witg additional props', () => {
    const customProps = {
      modelValue: '1',
      label: 'Mon label',
      selectId: 'mon-id',
      required: true,
      disabled: true,
      hint: 'Indice',
      name: 'monNom',
      successMessage: 'Bravo',
      errorMessage: 'Erreur'
    }

    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountWithProps(customProps)
    })

    describe('when the component is mounted', () => {
      it('then it should forward those props to DsfrSelect', () => {
        const dsfr = wrapper.findComponent({ name: 'DsfrSelect' })
        for (const key of Object.keys(customProps)) {
          expect(dsfr.props(key)).toEqual(customProps[key as keyof typeof customProps])
        }
      })
    })
  })
})
