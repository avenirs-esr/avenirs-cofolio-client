import type { VueWrapper } from '@vue/test-utils'
import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateTraceForm from '@/features/student/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    }))
  }
})

BddTest().given('an update trace form component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateTraceForm>>
  let mockTrace: TraceDetailDTO

  const stubs = {
    TraceNameInputFormField: {
      name: 'TraceNameInputFormField',
      props: ['form'],
      template: '<input id="traceName" />'
    },
    TraceFileUploadFormField: {
      name: 'TraceFileUploadFormField',
      props: ['form', 'label'],
      template: '<input id="trace-file-upload" type="file" />'
    },
    TracePersonalNoteTextareaFormField: {
      name: 'TracePersonalNoteTextareaFormField',
      props: ['form'],
      template: '<textarea id="personalNote" />'
    },
    TraceAuthenticDeclarationToggleFormField: {
      name: 'TraceAuthenticDeclarationToggleFormField',
      props: ['form'],
      template: '<div class="av-toggle-stub" />'
    },
    TraceGroupProductionToggleFormField: {
      name: 'TraceGroupProductionToggleFormField',
      props: ['form'],
      template: '<div class="av-toggle-stub" />'
    },
    TraceAiUsageToggleFormField: {
      name: 'TraceAiUsageToggleFormField',
      props: ['form'],
      emits: ['change'],
      template: '<div class="av-toggle-stub" />'
    },
    TraceAiJustificationTextareaFormField: {
      name: 'TraceAiJustificationTextareaFormField',
      props: ['form', 'showAiJustification', 'labelVisible'],
      template: '<textarea id="iaJustification" v-if="showAiJustification" />'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockTrace = {
      id: 'trace-123',
      title: 'Existing Trace',
      programName: 'Test Program',
      isGroup: false,
      aiUseJustification: '',
      personalNote: 'Existing note',
      attachment: {
        id: 'attachment-123',
        fileName: 'existing-file.pdf',
        fileType: EFileType.PDF,
        fileSize: 1024,
        version: 1,
        uploadedAt: '2025-01-15T10:00:00Z'
      },
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    }

    wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
      props: {
        trace: mockTrace
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the form', () => {
      const form = wrapper.find('form.update-trace-form')
      expect(form.exists()).toBe(true)
    })

    BddTest().then('it should render trace name field', () => {
      const traceNameField = wrapper.findComponent({ name: 'TraceNameInputFormField' })
      expect(traceNameField.exists()).toBe(true)
    })

    BddTest().then('it should render file upload field with label', () => {
      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
      expect(fileUploadField.exists()).toBe(true)
      expect(fileUploadField.props('label')).toContain('Mon document chargé')
    })

    BddTest().then('it should render personal note field', () => {
      const personalNoteField = wrapper.findComponent({ name: 'TracePersonalNoteTextareaFormField' })
      expect(personalNoteField.exists()).toBe(true)
    })

    BddTest().then('it should render authentic declaration toggle', () => {
      const authenticToggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggleFormField' })
      expect(authenticToggle.exists()).toBe(true)
    })

    BddTest().then('it should render group production toggle', () => {
      const groupToggle = wrapper.findComponent({ name: 'TraceGroupProductionToggleFormField' })
      expect(groupToggle.exists()).toBe(true)
    })

    BddTest().then('it should render AI usage toggle', () => {
      const aiToggle = wrapper.findComponent({ name: 'TraceAiUsageToggleFormField' })
      expect(aiToggle.exists()).toBe(true)
    })

    BddTest().then('it should render AI justification field', () => {
      const aiJustificationField = wrapper.findComponent({ name: 'TraceAiJustificationTextareaFormField' })
      expect(aiJustificationField.exists()).toBe(true)
      expect(aiJustificationField.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the AI usage toggle is changed to false', () => {
    BddTest().then('it should clear AI justification field', async () => {
      const aiToggle = wrapper.findComponent({ name: 'TraceAiUsageToggleFormField' })
      await aiToggle.vm.$emit('change', false)
      await wrapper.vm.$nextTick()

      const aiJustificationField = wrapper.findComponent({ name: 'TraceAiJustificationTextareaFormField' })
      expect(aiJustificationField.props('showAiJustification')).toBe(false)
    })
  })

  BddTest().when('the AI usage toggle is not changed', () => {
    BddTest().then('it should keep AI justification field hidden by default', () => {
      const aiJustificationField = wrapper.findComponent({ name: 'TraceAiJustificationTextareaFormField' })
      expect(aiJustificationField.props('showAiJustification')).toBe(false)
    })
  })

  BddTest().when('the form is submitted successfully', () => {
    BddTest().then('it should show success message and hide modal', async () => {
      const traceNameInput = wrapper.find('#traceName')
      await traceNameInput.setValue('Updated Trace Name')
      await wrapper.vm.$nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith({
          timeout: 2000,
          description: 'Votre trace a été modifiée avec succès.'
        })
      })
    })
  })

  BddTest().when('the file upload label is computed', () => {
    BddTest().then('it should include uploaded date', () => {
      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
      const label = fileUploadField.props('label')
      expect(label).toContain('Mon document chargé')
      expect(label).toContain('Ajouté le')
    })
  })
})
