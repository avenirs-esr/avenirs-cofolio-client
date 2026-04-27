import TraceLinkInput from '@/features/student/traces/components/interactions/inputs/TraceLinkInput/TraceLinkInput.vue'
import { TRACE_LINK_MAX_LENGTH } from '@/features/student/traces/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvInput: AvInputStub
}

BddTest().given('a trace link input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceLinkInput>>

  beforeEach(() => {
    wrapper = mount(TraceLinkInput, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvInput with default props', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Ajouter un lien')
      expect(input.props('placeholder')).toBe('Ajouter un lien...')
      expect(input.props('maxlength')).toBe(TRACE_LINK_MAX_LENGTH)
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.LINK)
      expect(input.props('isTextarea')).toBe(false)
      expect(input.props('labelVisible')).toBe(true)
      expect(input.props('disabled')).toBe(false)
      expect(input.props('required')).toBe(true)
    })

    BddTest().then('it should render character count hint', () => {
      const hint = wrapper.find('.caption-light')

      expect(hint.exists()).toBe(true)
      expect(hint.text()).toBe(`0 / ${TRACE_LINK_MAX_LENGTH} caractères (espaces compris)`)
    })
  })

  BddTest().when('custom label is provided', () => {
    BddTest().then('it should use the custom label', () => {
      wrapper = mount(TraceLinkInput, {
        props: { label: 'Custom Label' },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('custom placeholder is provided', () => {
    BddTest().then('it should use the custom placeholder', () => {
      wrapper = mount(TraceLinkInput, {
        props: { placeholder: 'Custom placeholder text' },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('placeholder')).toBe('Custom placeholder text')
    })
  })

  BddTest().when('custom maxlength is provided', () => {
    BddTest().then('it should use the custom maxlength', () => {
      wrapper = mount(TraceLinkInput, {
        props: { maxlength: 500 },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('maxlength')).toBe(500)
    })
  })

  BddTest().when('custom prefixIcon is provided', () => {
    BddTest().then('it should use the custom prefixIcon', () => {
      wrapper = mount(TraceLinkInput, {
        props: { prefixIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the component is disabled', () => {
    BddTest().then('it should pass disabled state to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { disabled: true },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('disabled')).toBe(true)
    })
  })

  BddTest().when('required is false', () => {
    BddTest().then('it should pass required state to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { required: false },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('required')).toBe(false)
    })
  })

  BddTest().when('labelVisible is false', () => {
    BddTest().then('it should hide the label', () => {
      wrapper = mount(TraceLinkInput, {
        props: { labelVisible: false },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('isValid is true', () => {
    BddTest().then('it should pass valid state to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { isValid: true },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('isValid')).toBe(true)
    })
  })

  BddTest().when('text is entered', () => {
    BddTest().then('it should update the model value', async () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'My trace link')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['My trace link'])
    })

    BddTest().then('it should update the character count hint', async () => {
      wrapper = mount(TraceLinkInput, {
        props: { modelValue: 'https://example.com' },
        global: { stubs }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe(`19 / ${TRACE_LINK_MAX_LENGTH} caractères (espaces compris)`)
    })
  })

  BddTest().when('a value is provided via v-model', () => {
    BddTest().then('it should pass the value to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { modelValue: 'https://example.com' },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe('https://example.com')
    })
  })

  BddTest().when('errorMessage is provided', () => {
    BddTest().then('it should pass the error message to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { errorMessage: 'Lien invalide' },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('errorMessage')).toBe('Lien invalide')
    })
  })

  BddTest().when('isTextarea is true', () => {
    BddTest().then('it should pass textarea state to AvInput', () => {
      wrapper = mount(TraceLinkInput, {
        props: { isTextarea: true },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('isTextarea')).toBe(true)
    })
  })

  BddTest().when('the character count reaches maximum', () => {
    BddTest().then('it should display the correct count in hint', () => {
      wrapper = mount(TraceLinkInput, {
        props: { modelValue: 'a'.repeat(TRACE_LINK_MAX_LENGTH) },
        global: { stubs }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe(`${TRACE_LINK_MAX_LENGTH} / ${TRACE_LINK_MAX_LENGTH} caractères (espaces compris)`)
    })
  })
})
