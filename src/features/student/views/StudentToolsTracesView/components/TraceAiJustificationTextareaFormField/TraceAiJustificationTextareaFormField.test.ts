import type { CreateTraceForm } from '@/features/student/types'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import TraceAiJustificationTextareaFormField from './TraceAiJustificationTextareaFormField.vue'

const TestWrapper = {
  components: {
    TraceAiJustificationTextareaFormField
  },
  props: {
    showAiJustification: {
      type: Boolean,
      default: true
    },
    labelVisible: {
      type: Boolean,
      default: true
    }
  },
  setup (props: { showAiJustification: boolean, labelVisible: boolean }) {
    const form = useForm({
      defaultValues: {
        iaJustification: ''
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              iaJustification: !value.iaJustification || !value.iaJustification.trim()
                ? 'Ce champ est requis'
                : undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form, showAiJustification: props.showAiJustification, labelVisible: props.labelVisible }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceAiJustificationTextareaFormField
        :form="form"
        :show-ai-justification="showAiJustification"
        :label-visible="labelVisible"
      />
    </form>
  `
}

BddTest().given('a trace AI justification textarea form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceIaJustificationTextarea: {
      name: 'TraceIaJustificationTextarea',
      props: ['id', 'modelValue', 'errorMessage', 'required', 'labelVisible'],
      emits: ['blur', 'update:modelValue'],
      template: '<div><textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"></textarea><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      props: {
        showAiJustification: true,
        labelVisible: true
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AI justification textarea', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.props('id')).toBe('ia-justification')
    })

    BddTest().then('it should have required prop set to true when shown', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.props('required')).toBe(true)
    })

    BddTest().then('it should have labelVisible prop passed correctly', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })
  })

  BddTest().when('showAiJustification is false', () => {
    beforeEach(() => {
      wrapper = mount(TestWrapper, {
        props: {
          showAiJustification: false,
          labelVisible: true
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render the textarea', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.exists()).toBe(false)
    })
  })

  BddTest().when('the user types in the textarea', () => {
    BddTest().then('it should update the form field value', async () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('My AI justification text')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
        expect(updatedTextarea.props('modelValue')).toBe('My AI justification text')
      })
    })
  })

  BddTest().when('the user blurs the textarea', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(textarea.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
        expect(textarea.props('errorMessage')).toBe('Ce champ est requis')
      })
    })

    BddTest().then('it should display error message in the DOM', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('.error')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Ce champ est requis')
      })
    })
  })

  BddTest().when('the form is submitted with valid value', () => {
    BddTest().then('it should not show validation error', async () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('Valid AI justification')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
        expect(updatedTextarea.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().when('labelVisible prop is false', () => {
    beforeEach(() => {
      wrapper = mount(TestWrapper, {
        props: {
          showAiJustification: true,
          labelVisible: false
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass labelVisible as false to the textarea', () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(textarea.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the user enters only whitespace', () => {
    BddTest().then('it should show validation error on submit', async () => {
      const textarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      const textareaElement = textarea.find('textarea')

      await textareaElement.setValue('   ')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedTextarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
        expect(updatedTextarea.props('errorMessage')).toBe('Ce champ est requis')
      })
    })
  })
})
