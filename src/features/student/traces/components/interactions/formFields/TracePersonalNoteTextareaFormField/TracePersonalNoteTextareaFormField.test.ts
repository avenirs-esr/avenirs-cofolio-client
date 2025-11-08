import type { CreateTraceForm } from '@/features/student/traces'
import TracePersonalNoteTextareaFormField
  from '@/features/student/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TracePersonalNoteTextareaFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        personalNote: ''
      },
      validators: {
        onSubmit () {
          return {
            fields: {
              personalNote: undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TracePersonalNoteTextareaFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace personal note textarea form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TracePersonalNoteTextarea: {
      name: 'TracePersonalNoteTextarea',
      props: ['id', 'modelValue', 'errorMessage'],
      emits: ['blur', 'update:modelValue'],
      template: '<div><textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"></textarea><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the personal note textarea', () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      expect(textarea.props('id')).toBe('personal-note')
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the user types in the textarea', () => {
    BddTest().then('it should update the form field value', async () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('My personal note')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
        expect(updatedTextarea.props('modelValue')).toBe('My personal note')
      })
    })
  })

  BddTest().when('the user blurs the textarea', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(textarea.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should not show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      expect(textarea.props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the form is submitted with valid value', () => {
    BddTest().then('it should not show validation error', async () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('Valid personal note')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
        expect(updatedTextarea.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().when('the user types a non-string value', () => {
    BddTest().then('it should update the form field value to undefined', async () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })

      await textarea.vm.$emit('update:modelValue', 123)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
        expect(updatedTextarea.props('modelValue')).toBeUndefined()
      })
    })
  })

  BddTest().when('the user clears the textarea', () => {
    BddTest().then('it should update the form field value to empty string', async () => {
      const textarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('Some text')
      await wrapper.vm.$nextTick()

      await textareaElement.setValue('')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
        expect(updatedTextarea.props('modelValue')).toBe('')
      })
    })
  })
})
