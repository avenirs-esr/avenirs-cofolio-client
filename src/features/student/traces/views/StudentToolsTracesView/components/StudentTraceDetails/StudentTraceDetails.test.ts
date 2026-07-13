import { EFileType, ETraceAuthorType, type TraceDetailDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { TraceAiJustificationTextareaStub } from '@/features/student/traces/components/interactions/inputs/TraceAiJustificationTextarea/TraceAiJustificationTextarea.stub'
import { TraceAiUsageToggleStub } from '@/features/student/traces/components/interactions/toggles/TraceAiUsageToggle/TraceAiUsageToggle.stub'
import StudentTraceDetails
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const TraceNameInputStub = {
  name: 'TraceNameInput',
  props: ['modelValue', 'required', 'disabled'],
  template: '<div class="trace-name-input-stub"></div>'
}

const TraceFileUploadStub = {
  name: 'TraceFileUpload',
  props: ['modelValue', 'label', 'validMessage', 'disabled'],
  template: '<div class="trace-file-upload-stub"></div>'
}

const TracePersonalNoteTextareaStub = {
  name: 'TracePersonalNoteTextarea',
  props: ['modelValue', 'label', 'disabled'],
  template: '<div class="trace-personal-note-textarea-stub"></div>'
}

const AvIconTextStub = {
  name: 'AvIconText',
  props: ['typographyClass', 'iconColor', 'icon', 'text'],
  template: '<div class="av-icon-text-stub"></div>'
}

const stubs = {
  TraceNameInput: TraceNameInputStub,
  TraceFileUpload: TraceFileUploadStub,
  TracePersonalNoteTextarea: TracePersonalNoteTextareaStub,
  TraceAiJustificationTextarea: TraceAiJustificationTextareaStub,
  AvIconText: AvIconTextStub,
  TraceAiUsageToggle: TraceAiUsageToggleStub,
  CreationUpdateDateDetails: CreationUpdateDateDetailsStub
}

BddTest().given('a student detailed trace information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceDetails>>

  const mockTrace: TraceDetailDTO = {
    id: '1',
    title: 'Test Trace Title',
    isAssociated: true,
    programName: 'Test Program',
    link: 'https://example.com/trace/1',
    authorType: ETraceAuthorType.COLLECTIVE,
    valorized: false,
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
      url: 'exemple.com/image'
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

  BddTest().when('the component is mounted with an attachment', () => {
    BddTest().then('it should render the trace name input with correct props', () => {
      const traceNameInput = wrapper.findComponent({ name: 'TraceNameInput' })

      expect(traceNameInput.exists()).toBe(true)
      expect(traceNameInput.props('modelValue')).toBe('Test Trace Title')
      expect(traceNameInput.props('required')).toBe(false)
      expect(traceNameInput.props('disabled')).toBe('')
    })

    BddTest().then('it should display the document label and upload date', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })

      expect(traceFileUpload.exists()).toBe(true)
      expect(traceFileUpload.props('label')).toContain('Mon document')
      expect(traceFileUpload.props('label')).toContain('Ajouté le')
      expect(traceFileUpload.props('label')).toContain('15 janvier 2024 à 10:30')
    })

    BddTest().then('it should render the trace file upload with correct props', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })

      expect(traceFileUpload.exists()).toBe(true)

      const modelValue = traceFileUpload.props('modelValue')
      expect(modelValue).toBeInstanceOf(File)
      expect(modelValue.name).toBe('test-document.pdf')

      expect(traceFileUpload.props('validMessage')).toBe('Document chargé.')
      expect(traceFileUpload.props('disabled')).toBe('')
    })

    BddTest().then('it should render the trace creation / update date', () => {
      const creationUpdateDateDetails = wrapper.findComponent({ name: 'CreationUpdateDateDetails' })
      expect(creationUpdateDateDetails.exists()).toBeTruthy()
      expect(creationUpdateDateDetails.props('createdAt')).toBe('2024-01-15T10:30:00')
      expect(creationUpdateDateDetails.props('updatedAt')).toBe('2024-01-15T10:30:00')
    })

    BddTest().then('it should not render the link when attachment is present', () => {
      expect(wrapper.find('a.trace-link').exists()).toBe(false)
    })

    BddTest().then('it should render the personal note textarea with correct props', () => {
      const personalNoteTextarea = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })

      expect(personalNoteTextarea.exists()).toBe(true)
      expect(personalNoteTextarea.props('modelValue')).toBe('Test personal note content')
      expect(personalNoteTextarea.props('disabled')).toBe('')
    })

    BddTest().then('it should render the indicators section', () => {
      const indicators = wrapper.find('.indicators')
      const iconTexts = indicators.findAllComponents({ name: 'AvIconText' })

      expect(indicators.exists()).toBe(true)
      expect(iconTexts).toHaveLength(1)
      expect(iconTexts[0].props('text')).toBe('Production collective')
    })

    BddTest().then('it should render the IA toggle with correct props', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })

      expect(toggle.exists()).toBe(true)
      expect(toggle.props('modelValue')).toBe(false)
      expect(toggle.props('description')).toBe('Production avec IA')
      expect(toggle.props('disabled')).toBe(true)
    })

    BddTest().then('it should not render the IA justification textarea when aiUseJustification is empty', () => {
      const iaJustificationTextarea = wrapper.findComponent({ name: 'TraceAiJustificationTextarea' })

      expect(iaJustificationTextarea.exists()).toBe(false)
    })
  })

  BddTest().when('the trace has no attachment and a link is defined', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        trace: {
          ...mockTrace,
          attachment: undefined
        }
      })
    })

    BddTest().then('it should render the link label', () => {
      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Lien de ma trace')
    })

    BddTest().then('it should render the link as an anchor with correct attributes', () => {
      const link = wrapper.find('a.trace-link')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://example.com/trace/1')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
      expect(link.text()).toBe('https://example.com/trace/1')
    })

    BddTest().then('it should not render the file upload when there is no attachment', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      expect(traceFileUpload.exists()).toBe(false)
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
      const iaJustificationTextarea = wrapper.findComponent({ name: 'TraceAiJustificationTextarea' })

      expect(iaJustificationTextarea.exists()).toBe(true)
      expect(iaJustificationTextarea.props('modelValue')).toBe('Test AI justification text')
      expect(iaJustificationTextarea.props('labelVisible')).toBe(false)
      expect(iaJustificationTextarea.props('disabled')).toBe('')
    })

    BddTest().then('it should render the IA toggle as enabled', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })

      expect(toggle.props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the component displays formatted date', () => {
    BddTest().then('it should format the date correctly in French locale', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })

      expect(traceFileUpload.props('label')).toContain('15 janvier 2024 à 10:30')
    })
  })

  BddTest().when('the computed properties are evaluated', () => {
    BddTest().then('it should compute traceAsFile with correct structure', () => {
      const traceFileUpload = wrapper.findComponent({ name: 'TraceFileUpload' })
      const fileValue = traceFileUpload.props('modelValue')

      expect(fileValue).toBeDefined()
      expect(fileValue).toBeInstanceOf(File)
      expect(fileValue.name).toBe('test-document.pdf')
    })
  })
})
