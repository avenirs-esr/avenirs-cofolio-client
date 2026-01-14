import DeclaredSkillCommentInput from '@/features/student/declaredSkills/components/interactions/inputs/DeclaredSkillCommentInput/DeclaredSkillCommentInput.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared skill comment input', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillCommentInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the AvInput component', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have default isValid prop set to false', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('isValid')).toBe(false)
    })

    BddTest().then('it should have default isTextarea prop set to true', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('isTextarea')).toBe(true)
    })

    BddTest().then('it should have default labelVisible prop set to true', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have default disabled prop set to false', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('disabled')).toBe(false)
    })

    BddTest().then('it should have default required prop set to true', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('required')).toBe(true)
    })

    BddTest().then('it should have default maxlength prop set to 400', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('maxlength')).toBe(400)
    })

    BddTest().then('it should use default i18n label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Description de ma compétence')
    })
  })

  BddTest().when('the component is mounted with custom props', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          isValid: true,
          isTextarea: false,
          labelVisible: false,
          disabled: true,
          required: false,
          maxlength: 200,
          id: 'custom-id',
          label: 'Custom Label',
          errorMessage: 'Custom error message'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass custom isValid prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('isValid')).toBe(true)
    })

    BddTest().then('it should pass custom isTextarea prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('isTextarea')).toBe(false)
    })

    BddTest().then('it should pass custom labelVisible prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('labelVisible')).toBe(false)
    })

    BddTest().then('it should pass custom disabled prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('disabled')).toBe(true)
    })

    BddTest().then('it should pass custom required prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('required')).toBe(false)
    })

    BddTest().then('it should pass custom maxlength prop to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('maxlength')).toBe(200)
    })

    BddTest().then('it should use custom label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Custom Label')
    })

    BddTest().then('it should pass custom errorMessage to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('errorMessage')).toBe('Custom error message')
    })
  })

  BddTest().when('the user updates the input value', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'New comment value')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:modelValue event', () => {
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New comment value'])
    })
  })

  BddTest().when('the component receives a modelValue prop', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          modelValue: 'Initial comment'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the modelValue to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('Initial comment')
    })
  })

  BddTest().when('the component is mounted with empty modelValue', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass empty string to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          errorMessage: 'This field is required'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the error message', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('errorMessage')).toBe('This field is required')
    })
  })

  BddTest().when('the component receives multiple updates', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillCommentInput, {
        props: {
          modelValue: 'First value'
        },
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'Second value')
      await wrapper.vm.$nextTick()
      await input.vm.$emit('update:modelValue', 'Third value')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit all updates', () => {
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.length).toBe(2)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Second value'])
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['Third value'])
    })
  })
})
