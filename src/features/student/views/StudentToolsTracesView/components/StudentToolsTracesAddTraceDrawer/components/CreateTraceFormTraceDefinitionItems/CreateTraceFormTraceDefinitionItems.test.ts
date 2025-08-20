import {
  TRACE_ACCEPTED_FILE_TYPES,
  type TraceFormData
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import CreateTraceFormTraceDefinitionItems from './CreateTraceFormTraceDefinitionItems.vue'

const TestWrapper = {
  components: {
    CreateTraceFormTraceDefinitionItems
  },
  setup () {
    const form = useForm({
      defaultValues: {
        file: null as unknown as File,
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
  AvFileUpload: {
    name: 'AvFileUpload',
    props: ['id', 'modelValue', 'accept', 'ariaLabel', 'error', 'validMessage'],
    emits: ['change'],
    template: '<input type="file" :id="id" :accept="accept" @change="$emit(\'change\', $event.target.files)" /><slot /><slot name="hint" />'
  },
  AvInput: {
    name: 'AvInput',
    props: ['id', 'modelValue', 'label', 'placeholder', 'errorMessage', 'required', 'prefixIcon', 'maxlength', 'isTextarea', 'type'],
    emits: ['blur', 'update:modelValue'],
    template: '<input v-if="!isTextarea" :type="type || \'text\'" :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><textarea v-else :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><slot name="customCaptions" :current-value="modelValue" :maxlength="maxlength" />'
  }
}

describe('createTraceFormTraceDefinitionItems', () => {
  describe('given a create trace form trace definition items component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(TestWrapper, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the form fields container', () => {
        const container = wrapper.find('.create-trace-form-trace-definition-items__fields')
        expect(container.exists()).toBe(true)
      })

      it('then it should render AvFileUpload with correct props', () => {
        const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

        expect(fileUpload.exists()).toBe(true)
        expect(fileUpload.props('id')).toBe('trace-file-upload')
        expect(fileUpload.props('accept')).toEqual(TRACE_ACCEPTED_FILE_TYPES)
      })

      it('then it should render trace name input with correct props', () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        const traceNameInput = avInputs.find(input => input.props('id') === 'trace-name')

        expect(traceNameInput).toBeDefined()
        expect(traceNameInput?.props('id')).toBe('trace-name')
        expect(traceNameInput?.props('required')).toBe('')
        expect(traceNameInput?.props('label')).toBe('Nom de ma trace')
      })

      it('then it should render personal note textarea with correct props', () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        const personalNoteInput = avInputs.find(input => input.props('id') === 'personal-note')

        expect(personalNoteInput).toBeDefined()
        expect(personalNoteInput?.props('id')).toBe('personal-note')
        expect(personalNoteInput?.props('isTextarea')).toBe('')
        expect(personalNoteInput?.props('maxlength')).toBe(200)
        expect(personalNoteInput?.props('label')).toBe('Note personnelle')
      })
    })

    describe('when file is changed', () => {
      it('then it should update the form field value', async () => {
        const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
        const fileInput = wrapper.find('#trace-file-upload')

        Object.defineProperty(fileInput.element, 'files', {
          value: [mockFile],
          writable: false,
        })

        await fileInput.trigger('change')

        const fileUploadComponent = wrapper.findComponent({ name: 'AvFileUpload' })
        expect(fileUploadComponent.props('validMessage')).toBe(`${mockFile.name} - Document chargé.`)
      })
    })

    describe('when trace name is changed', () => {
      it('then it should update the form field value', async () => {
        const traceNameInput = wrapper.find('#trace-name')

        await traceNameInput.setValue('My test trace')

        const traceNameInputComponent = wrapper.findAllComponents({ name: 'AvInput' }).find(input => input.props('id') === 'trace-name')
        expect(traceNameInputComponent?.props('modelValue')).toBe('My test trace')
      })
    })

    describe('when personal note is changed', () => {
      it('then it should update the form field value', async () => {
        const personalNoteInput = wrapper.find('#personal-note')

        await personalNoteInput.setValue('My personal note')

        const personalNoteInputComponent = wrapper.findAllComponents({ name: 'AvInput' }).find(input => input.props('id') === 'personal-note')
        expect(personalNoteInputComponent?.props('modelValue')).toBe('My personal note')
      })
    })

    describe('when file success message is displayed', () => {
      it('then it should show success message when file is selected', async () => {
        const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
        const fileInput = wrapper.find('#trace-file-upload')

        Object.defineProperty(fileInput.element, 'files', {
          value: [mockFile],
          writable: false,
        })

        await fileInput.trigger('change')
        await wrapper.vm.$nextTick()

        const fileUploadComponent = wrapper.findComponent({ name: 'AvFileUpload' })
        expect(fileUploadComponent.props('validMessage')).toBe('test.pdf - Document chargé.')
      })

      it('then it should not show success message when no file is selected', () => {
        const fileUploadComponent = wrapper.findComponent({ name: 'AvFileUpload' })
        expect(fileUploadComponent.props('validMessage')).toBeUndefined()
      })
    })
  })
})
