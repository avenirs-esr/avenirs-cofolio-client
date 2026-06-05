import type { CreateTraceForm } from '@/features/student/traces'
import TraceFileUploadFormField
  from '@/features/student/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceFileUploadFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        file: null as unknown as File
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              file: !value.file ? 'Required field' : undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceFileUploadFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace file upload form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceFileUpload: {
      name: 'TraceFileUpload',
      props: ['id', 'modelValue', 'error', 'validMessage'],
      emits: ['blur', 'change', 'update:modelValue'],
      template: '<div><input type="traceFileUpload" :id="id" @change="$emit(\'change\', $event.target.files)" @blur="$emit(\'blur\')" /><span v-if="error" class="error">{{ error }}</span><span v-if="validMessage" class="valid">{{ validMessage }}</span></div>'
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
    BddTest().then('it should render the file upload input', () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(fileUpload.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(fileUpload.props('id')).toBe('trace-file-upload')
    })

    BddTest().then('it should have null initial value', () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(fileUpload.props('modelValue')).toBeNull()
    })

    BddTest().then('it should not show valid message initially', () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(fileUpload.props('validMessage')).toBeUndefined()
    })
  })

  BddTest().when('the user selects a file', () => {
    BddTest().then('it should update the form field value', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => index === 0 ? file : null
      } as unknown as FileList

      await fileUpload.vm.$emit('change', fileList)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(updatedFileUpload.props('modelValue')).toEqual(file)
      })
    })

    BddTest().then('it should show valid message', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(updatedFileUpload.props('validMessage')).toBeTruthy()
      })
    })
  })

  BddTest().when('the user blurs the file input', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const fileInput = fileUpload.find('input[type="traceFileUpload"]')

      await fileInput.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(fileUpload.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(fileUpload.props('error')).toBe('Required field')
      })
    })

    BddTest().then('it should display error message in the DOM', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('.error')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Required field')
      })
    })
  })

  BddTest().when('the form is submitted with valid file', () => {
    BddTest().then('it should not show validation error', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(updatedFileUpload.props('error')).toBeFalsy()
      })
    })
  })

  BddTest().when('the user clears the file selection', () => {
    BddTest().then('it should update the form field value to null', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      await fileUpload.vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(updatedFileUpload.props('modelValue')).toBeNull()
      })
    })

    BddTest().then('it should emit the deleted file name', async () => {
      const formField = wrapper.findComponent(TraceFileUploadFormField)
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      await fileUpload.vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()

      expect(formField.emitted('fileDeleted')?.[0]).toEqual(['test.pdf'])
    })

    BddTest().then('it should not show valid message', async () => {
      const fileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      await fileUpload.vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
        expect(updatedFileUpload.props('validMessage')).toBeUndefined()
      })
    })
  })
})
