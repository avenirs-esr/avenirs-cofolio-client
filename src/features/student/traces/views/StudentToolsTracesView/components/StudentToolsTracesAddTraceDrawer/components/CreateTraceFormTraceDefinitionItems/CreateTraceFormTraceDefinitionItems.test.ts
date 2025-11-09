import type { TraceFormData } from '@/features/student/traces'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import CreateTraceFormTraceDefinitionItems from 'src/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'

const TestWrapper = {
  components: {
    CreateTraceFormTraceDefinitionItems
  },
  setup () {
    const form = useForm({
      defaultValues: {
        file: null,
        traceName: '',
        personalNote: ''
      } as TraceFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              file: !value.file ? 'Required field' : undefined,
              traceName: !value.traceName.trim() ? 'Required field' : undefined,
            }
          }
        }
      }
    })
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <CreateTraceFormTraceDefinitionItems :form="form" />
    </form>
  `
}

const stubs = {
  TraceFileUpload: {
    name: 'TraceFileUpload',
    props: ['id', 'modelValue', 'accept', 'ariaLabel', 'error', 'validMessage'],
    emits: ['change', 'update:modelValue'],
    template: '<div><input type="file" :id="id" :accept="accept" @change="$emit(\'change\', $event.target.files)" @input="$emit(\'update:modelValue\', $event.target.files?.[0])" /><slot /><slot name="hint" /></div>'
  },
  TraceNameInput: {
    name: 'TraceNameInput',
    props: ['id', 'modelValue', 'errorMessage', 'required'],
    emits: ['blur', 'update:modelValue'],
    template: '<input :id="id" :value="modelValue" :required="required" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />'
  },
  TracePersonalNoteTextarea: {
    name: 'TracePersonalNoteTextarea',
    props: ['id', 'modelValue', 'errorMessage'],
    emits: ['blur', 'update:modelValue'],
    template: '<textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />'
  }
}

BddTest().given('a create trace form trace definition items component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the form fields container', () => {
      const container = wrapper.find('.create-trace-form-trace-definition-items__fields')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render TraceFileUpload with correct props', () => {
      const TraceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })

      expect(TraceFileUpload.exists()).toBe(true)
      expect(TraceFileUpload.props('id')).toBe('trace-file-upload')
    })

    BddTest().then('it should render trace name input with correct props', () => {
      const traceNameInput = wrapper.findComponent({ name: 'TraceNameInput' })

      expect(traceNameInput.exists()).toBe(true)
      expect(traceNameInput.props('id')).toBe('trace-name')
      expect(traceNameInput.props('required')).toBe('')
    })

    BddTest().then('it should render personal note textarea with correct props', () => {
      const personalNoteInput = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })

      expect(personalNoteInput.exists()).toBe(true)
      expect(personalNoteInput.props('id')).toBe('personal-note')
    })
  })

  BddTest().when('file is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = wrapper.find('#trace-file-upload')

      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      })

      await fileInput.trigger('change')

      const TraceFileUploadComponent = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(TraceFileUploadComponent.props('validMessage')).toBe(`Document chargé.`)
    })
  })

  BddTest().when('trace name is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const traceNameInput = wrapper.find('#trace-name')

      await traceNameInput.setValue('My test trace')

      const traceNameInputComponent = wrapper.findComponent({ name: 'TraceNameInput' })
      expect(traceNameInputComponent.props('modelValue')).toBe('My test trace')
    })
  })

  BddTest().when('personal note is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const personalNoteInput = wrapper.find('#personal-note')

      await personalNoteInput.setValue('My personal note')

      const personalNoteInputComponent = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
      expect(personalNoteInputComponent.props('modelValue')).toBe('My personal note')
    })
  })

  BddTest().when('file success message is displayed', () => {
    BddTest().then('it should show success message when file is selected', async () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = wrapper.find('#trace-file-upload')

      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      })

      await fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      const TraceFileUploadComponent = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(TraceFileUploadComponent.props('validMessage')).toBe('Document chargé.')
    })

    BddTest().then('it should not show success message when no file is selected', () => {
      const TraceFileUploadComponent = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(TraceFileUploadComponent.props('validMessage')).toBeUndefined()
    })
  })
})
