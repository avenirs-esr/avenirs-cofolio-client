import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramLinkFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramLinkFormField/DeclaredProgramLinkFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramLinkInputStub = defineComponent({
  name: 'DeclaredProgramLinkInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-link-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramLinkFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        link: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit () {
          return { fields: { link: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramLinkFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program link form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramLinkInput: DeclaredProgramLinkInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the link input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the user enters a link', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      const textInput = input.find('input')
      await textInput.setValue('https://example.com/program')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
        expect(updated.props('modelValue')).toBe('https://example.com/program')
      })
    })
  })

  BddTest().and('the input emits blur', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      await input.vm.$emit('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted with empty link', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
        expect(input.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().and('the form is submitted with valid link', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
      const textInput = input.find('input')
      await textInput.setValue('https://example.com/valid-program')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramLinkInput' })
        expect(updated.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
