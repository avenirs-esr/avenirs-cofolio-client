import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import StudentTraceDetails
  from '@/features/student/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const TraceNameInputStub = {
  name: 'TraceNameInput',
  props: ['modelValue', 'required', 'disabled'],
  template: '<div class="trace-name-input-stub"></div>'
}

const TraceFileUploadStub = {
  name: 'TraceFileUpload',
  props: ['modelValue', 'ariaLabel', 'deleteButtonLabel', 'disabled'],
  template: '<div class="trace-file-upload-stub"></div>'
}

const TracePersonalNoteTextareaStub = {
  name: 'TracePersonalNoteTextarea',
  props: ['modelValue', 'label', 'disabled'],
  template: '<div class="trace-personal-note-textarea-stub"></div>'
}

const TraceIaJustificationTextareaStub = {
  name: 'TraceIaJustificationTextarea',
  props: ['modelValue', 'maxlength', 'labelVisible', 'disabled'],
  template: '<div class="trace-ia-justification-textarea-stub"></div>'
}

const AvIconTextStub = {
  name: 'AvIconText',
  props: ['typographyClass', 'iconColor', 'icon', 'text'],
  template: '<div class="av-icon-text-stub"></div>'
}

const AvToggleStub = {
  name: 'AvToggle',
  props: ['modelValue', 'description', 'disabled'],
  template: '<div class="av-toggle-stub"></div>'
}

const stubs = {
  TraceNameInput: TraceNameInputStub,
  TraceFileUpload: TraceFileUploadStub,
  TracePersonalNoteTextarea: TracePersonalNoteTextareaStub,
  TraceIaJustificationTextarea: TraceIaJustificationTextareaStub,
  AvIconText: AvIconTextStub,
  AvToggle: AvToggleStub
}

BddTest().given('a student detailed trace information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceDetails>>

  const mockTrace: TraceDetailDTO = {
    id: '1',
    title: 'Test Trace Title',
    isAssociated: true,
    programName: 'Test Program',
    isGroup: false,
    aiUseJustification: '',
    personalNote: 'Test personal note content',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    attachment: {
      id: 'attachment-1',
      fileName: 'test-document.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024000,
      uploadedAt: '2024-01-15T10:30:00',
      version: 1
    }
  }

  beforeEach(() => {
    wrapper = mount(StudentTraceDetails, {
      props: {
        trace: mockTrace
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the trace name input with correct props', () => {
      const traceNameInput = wrapper.findComponent({ name: 'TraceNameInput' })

      expect(traceNameInput.exists()).toBe(true)
      expect(traceNameInput.props('modelValue')).toBe('Test Trace Title')
      expect(traceNameInput.props('required')).toBe(false)
      expect(traceNameInput.props('disabled')).toBe('')
    })

    BddTest().then('it should display the document label and upload date', () => {
      const captionText = wrapper.find('.caption-regular')

      expect(captionText.exists()).toBe(true)
      expect(captionText.text()).toContain('Mon document')
      expect(captionText.text()).toContain('Ajouté le')
      expect(captionText.text()).toContain('15 janvier 2024 à 10:30')
    })

    BddTest().then('it should render the trace file upload with correct props', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })

      expect(traceFileUpload.exists()).toBe(true)
      expect(traceFileUpload.props('modelValue')).toEqual({
        name: 'test-document.pdf',
        size: 1024000
      })
      expect(traceFileUpload.props('ariaLabel')).toBe('Mon document chargé')
      expect(traceFileUpload.props('disabled')).toBe('')
    })

    BddTest().then('it should render the personal note textarea with correct props', () => {
      const personalNoteTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })

      expect(personalNoteTextarea.exists()).toBe(true)
      expect(personalNoteTextarea.props('modelValue')).toBe('Test personal note content')
      expect(personalNoteTextarea.props('label')).toBe('Note personnelle')
      expect(personalNoteTextarea.props('disabled')).toBe('')
    })

    BddTest().then('it should render the indicators section', () => {
      const indicators = wrapper.find('.student-detailed-trace-information__indicators')
      const iconTexts = indicators.findAllComponents({ name: 'AvIconText' })

      expect(indicators.exists()).toBe(true)
      expect(iconTexts).toHaveLength(2)
      expect(iconTexts[0].props('text')).toBe('Cette trace est une production de groupe')
      expect(iconTexts[1].props('text')).toBe('Production authentique et personnelle')
    })

    BddTest().then('it should render the IA toggle with correct props', () => {
      const avToggle = wrapper.findComponent({ name: 'AvToggle' })

      expect(avToggle.exists()).toBe(true)
      expect(avToggle.props('modelValue')).toBe(false)
      expect(avToggle.props('description')).toBe('Production avec IA')
      expect(avToggle.props('disabled')).toBe('')
    })

    BddTest().then('it should not render the IA justification textarea when aiUseJustification is empty', () => {
      const iaJustificationTextarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })

      expect(iaJustificationTextarea.exists()).toBe(false)
    })
  })

  BddTest().when('the trace has IA justification', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        trace: {
          ...mockTrace,
          aiUseJustification: 'Test AI justification text'
        }
      })
    })

    BddTest().then('it should render the IA justification textarea', () => {
      const iaJustificationTextarea = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })

      expect(iaJustificationTextarea.exists()).toBe(true)
      expect(iaJustificationTextarea.props('modelValue')).toBe('Test AI justification text')
      expect(iaJustificationTextarea.props('maxlength')).toBe(500)
      expect(iaJustificationTextarea.props('labelVisible')).toBe(false)
      expect(iaJustificationTextarea.props('disabled')).toBe('')
    })

    BddTest().then('it should render the IA toggle as enabled', () => {
      const avToggle = wrapper.findComponent({ name: 'AvToggle' })

      expect(avToggle.props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the component displays formatted date', () => {
    BddTest().then('it should format the date correctly in French locale', () => {
      const captionText = wrapper.find('.caption-regular')

      expect(captionText.text()).toContain('15 janvier 2024 à 10:30')
    })
  })

  BddTest().when('the computed properties are evaluated', () => {
    BddTest().then('it should compute traceAsFile with correct structure', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const fileValue = traceFileUpload.props('modelValue')

      expect(fileValue).toBeDefined()
      expect(fileValue).toHaveProperty('name', 'test-document.pdf')
      expect(fileValue).toHaveProperty('size', 1024000)
    })
  })
})
