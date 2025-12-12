import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramTitleFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.vue'
import { DECLARED_PROGRAM_TITLE_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramTitleInputStub = defineComponent({
  name: 'DeclaredProgramTitleInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-title-input-stub">
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
    DeclaredProgramTitleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        title: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit ({ value }) {
          if (!value.title || value.title.trim() === '') {
            return {
              fields: {
                title: 'Le titre est requis'
              }
            }
          }
          return { fields: { title: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramTitleFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program title form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramTitleInput: DeclaredProgramTitleInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the title input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the user enters a title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('My Program Title')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
        expect(updated.props('modelValue')).toBe('My Program Title')
      })
    })
  })

  BddTest().and('the user enters a title exceeding max length', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      const textInput = input.find('input')
      const longTitle = 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH + 10)
      await textInput.setValue(longTitle)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should truncate the value to max length', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
        expect(updated.props('modelValue')).toHaveLength(DECLARED_PROGRAM_TITLE_MAX_LENGTH)
      })
    })
  })

  BddTest().and('the input emits blur', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      await input.vm.$emit('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted with empty title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
        expect(input.props('errorMessage')).toBe('Le titre est requis')
      })
    })
  })

  BddTest().and('the form is submitted with valid title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('Valid Program Title')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramTitleInput' })
        expect(updated.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
