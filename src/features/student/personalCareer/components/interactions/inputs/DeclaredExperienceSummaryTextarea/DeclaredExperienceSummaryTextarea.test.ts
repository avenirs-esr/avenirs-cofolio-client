import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import DeclaredExperienceSummaryTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.vue'
import { DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience summary textarea component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceSummaryTextarea>>

  const stubs = {
    Input: InputStub
  }

  BddTest().when('the component is mounted with model value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: '',
          labelVisible: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the Input component', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have isTextarea prop set to true', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('isTextarea')).toBe(true)
    })

    BddTest().then('it should have maxlength prop set to config value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('maxlength')).toBe(DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Bilan / Prise de recul')
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().then('it should have textareaMinHeight set to 6.5rem', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('textareaMinHeight')).toBe('6.5rem')
    })

    BddTest().then('it should display zero character count', () => {
      expect(wrapper.text()).toContain('0 / 400')
    })
  })

  BddTest().when('the component is mounted with custom label prop', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          label: 'Custom Label',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to Input', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user types in the textarea', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      const input = wrapper.findComponent(InputStub)
      await input.vm.$emit('update:modelValue', 'New summary text')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('New summary text')
    })
  })

  BddTest().when('the component is mounted with initial model value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: 'Initial summary'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('Initial summary')
    })
  })

  BddTest().when('the component uses default custom captions template', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: 'Test'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display character count', () => {
      expect(wrapper.text()).toContain('4 / 400')
    })
  })

  BddTest().when('the textarea has long text content', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      const longText = 'a'.repeat(50)
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: longText
        },
        global: { stubs }
      })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should display correct character count', () => {
      expect(wrapper.text()).toContain('50 / 400')
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          disabled: true,
          required: true,
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to Input', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('disabled')).toBe(true)
      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the textarea content', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceSummaryTextarea, {
        props: {
          modelValue: 'Some text'
        },
        global: { stubs }
      })
      const input = wrapper.findComponent(InputStub)
      await input.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to empty value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().then('it should show zero character count', () => {
      expect(wrapper.text()).toContain('0 / 400')
    })
  })
})
