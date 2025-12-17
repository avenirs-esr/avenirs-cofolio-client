import DeclaredProgramLinkInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramLinkInput/DeclaredProgramLinkInput.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program link input', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramLinkInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the AvInput component', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have default label from i18n', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Lien')
    })

    BddTest().then('it should have default placeholder from i18n', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('placeholder')).toBe('https://exemple.com')
    })

    BddTest().then('it should have default prefix icon', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().and('the user enters a URL', () => {
      BddTest().then('it should update the model value', async () => {
        const input = wrapper.findComponent({ name: 'AvInput' })
        await input.vm.$emit('update:modelValue', 'https://example.com/program')
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['https://example.com/program'])
      })
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          label: 'Custom Label'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          prefixIcon: MDI_ICONS.PLUS_CIRCLE_OUTLINE
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default prefix icon', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          placeholder: 'Custom Placeholder'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default placeholder', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          modelValue: 'https://initial-link.com'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('https://initial-link.com')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          errorMessage: 'Invalid URL format'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass error message to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('errorMessage')).toBe('Invalid URL format')
    })
  })

  BddTest().when('the component is mounted with maxlength prop', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramLinkInput, {
        props: {
          maxlength: 100
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass maxlength to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('maxlength')).toBe(100)
    })
  })
})
