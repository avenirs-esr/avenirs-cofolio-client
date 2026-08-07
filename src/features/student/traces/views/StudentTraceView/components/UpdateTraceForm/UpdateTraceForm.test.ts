import type { UpdateTraceForm as UpdateTraceFormType } from '@/features/student/traces/types/forms.types'
import type { VueWrapper } from '@vue/test-utils'
import { EFileType, ETraceAuthorType, type TraceDetailDTO } from '@/api/avenir-esr'
import { KitValorizationToggleFormFieldStub } from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.stub'
import { TraceAiJustificationTextareaFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TraceAiJustificationTextareaFormField/TraceAiJustificationTextareaFormField.stub'
import { TraceAiUsageToggleFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TraceAiUsageToggleFormField/TraceAiUsageToggleFormField.stub'
import { TraceFileUploadFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.stub'
import { TraceLinkInputFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TraceLinkInputFormField/TraceLinkInputFormField.stub'
import { TraceNameInputFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TraceNameInputFormField/TraceNameInputFormField.stub'
import { TracePersonalNoteTextareaFormFieldStub } from '@/features/student/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.stub'
import { TraceAuthorTypeRadioSetFormFieldStub } from '@/features/student/traces/components/interactions/radios/TraceAuthorTypeRadioSetFormField/TraceAuthorTypeRadioSetFormField.stub'
import { TraceType } from '@/features/student/traces/types/traces.types'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
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
  const mockTrace: TraceDetailDTO = {
    id: 'trace-123',
    title: 'Existing Trace',
    authorType: ETraceAuthorType.PERSONAL,
    valorized: false,
    aiUseJustification: '',
    personalNote: 'Existing note',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }

  const mockTraceWithFile: TraceDetailDTO = {
    ...mockTrace,
    attachment: {
      id: 'attachment-123',
      fileName: 'existing-file.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024,
      url: 'exemple.com/image',
      uploadedAt: '2025-01-15T10:00:00Z'
    },
  }

  const mockTraceWithLink: TraceDetailDTO = {
    ...mockTrace,
    link: 'https://example.com/existing-trace'
  }

  const stubs = {
    TraceNameInputFormField: TraceNameInputFormFieldStub,
    TraceFileUploadFormField: TraceFileUploadFormFieldStub,
    TraceLinkInputFormField: TraceLinkInputFormFieldStub,
    TracePersonalNoteTextareaFormField: TracePersonalNoteTextareaFormFieldStub,
    TraceAuthorTypeRadioSetFormField: TraceAuthorTypeRadioSetFormFieldStub,
    TraceAiUsageToggleFormField: TraceAiUsageToggleFormFieldStub,
    TraceAiJustificationTextareaFormField: TraceAiJustificationTextareaFormFieldStub,
    KitValorizationToggleFormField: KitValorizationToggleFormFieldStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a file trace', () => {
    beforeEach(() => {
      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithFile
        },
        global: {
          stubs
        }
      })
    })

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

    BddTest().then('it should not render link field', () => {
      const linkField = wrapper.findComponent({ name: 'TraceLinkInputFormField' })
      expect(linkField.exists()).toBe(false)
    })

    BddTest().then('it should render the author type radio set', () => {
      const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSetFormField' })
      expect(radioSet.exists()).toBe(true)
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

    BddTest().and('the AI usage toggle is changed to false', () => {
      BddTest().then('it should clear AI justification field', async () => {
        const aiToggle = wrapper.findComponent({ name: 'TraceAiUsageToggleFormField' })
        await aiToggle.vm.$emit('change', false)
        await wrapper.vm.$nextTick()

        const aiJustificationField = wrapper.findComponent({ name: 'TraceAiJustificationTextareaFormField' })
        expect(aiJustificationField.props('showAiJustification')).toBe(false)
      })
    })

    BddTest().and('the AI usage toggle is not changed', () => {
      BddTest().then('it should keep AI justification field hidden by default', () => {
        const aiJustificationField = wrapper.findComponent({ name: 'TraceAiJustificationTextareaFormField' })
        expect(aiJustificationField.props('showAiJustification')).toBe(false)
      })
    })

    BddTest().and('the form is submitted successfully', () => {
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

    BddTest().and('the file upload label is computed', () => {
      BddTest().then('it should include uploaded date', () => {
        const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
        const label = fileUploadField.props('label')
        expect(label).toContain('Mon document chargé')
        expect(label).toContain('Ajouté le')
      })
    })
  })

  BddTest().when('the component is mounted with a link trace', () => {
    beforeEach(() => {
      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithLink
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render file upload field', () => {
      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
      expect(fileUploadField.exists()).toBe(false)
    })

    BddTest().then('it should render link field', () => {
      const linkField = wrapper.findComponent({ name: 'TraceLinkInputFormField' })
      expect(linkField.exists()).toBe(true)
    })
  })

  BddTest().when('file events are emitted from file upload field', () => {
    function createMockForm (traceName: string) {
      const values = {
        traceType: TraceType.FILE,
        traceName
      }

      return {
        handleSubmit: vi.fn(),
        getFieldValue: vi.fn((name: keyof typeof values) => values[name]),
        setFieldValue: vi.fn((name: keyof typeof values, value: string | TraceType) => {
          values[name] = value as never
        }),
        useField: vi.fn(({ name }: { name: string }) => {
          if (name === 'useIA') {
            return {
              state: { value: { value: false } },
              api: { handleChange: vi.fn() }
            }
          }

          if (name === 'iaJustification') {
            return {
              state: { value: { value: '' } },
              api: { handleChange: vi.fn() }
            }
          }

          return {
            state: { value: { value: undefined } },
            api: { handleChange: vi.fn() }
          }
        })
      } as unknown as UpdateTraceFormType
    }

    BddTest().then('it should set trace name when a file is selected and trace name is empty', async () => {
      const form = createMockForm('')

      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithFile,
          form
        },
        global: {
          stubs
        }
      })

      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
      const selectedFile = new File(['content'], 'selected-file.pdf', { type: 'application/pdf' })

      await fileUploadField.vm.$emit('file-selected', selectedFile)

      expect(form.setFieldValue).toHaveBeenCalledWith('traceName', 'selected-file.pdf')
    })

    BddTest().then('it should not overwrite trace name when a file is selected and trace name is already filled', async () => {
      const form = createMockForm('already-filled-name')

      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithFile,
          form
        },
        global: {
          stubs
        }
      })

      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })
      const selectedFile = new File(['content'], 'selected-file.pdf', { type: 'application/pdf' })

      await fileUploadField.vm.$emit('file-selected', selectedFile)

      expect(form.setFieldValue).not.toHaveBeenCalledWith('traceName', 'selected-file.pdf')
    })

    BddTest().then('it should clear trace name when a deleted file name matches trace name', async () => {
      const form = createMockForm('selected-file.pdf')

      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithFile,
          form
        },
        global: {
          stubs
        }
      })

      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })

      await fileUploadField.vm.$emit('file-deleted', 'selected-file.pdf')

      expect(form.setFieldValue).toHaveBeenCalledWith('traceName', '')
    })

    BddTest().then('it should not clear trace name when a deleted file name does not match trace name', async () => {
      const form = createMockForm('another-name.pdf')

      wrapper = mountComponent<typeof UpdateTraceForm>(UpdateTraceForm, {
        props: {
          trace: mockTraceWithFile,
          form
        },
        global: {
          stubs
        }
      })

      const fileUploadField = wrapper.findComponent({ name: 'TraceFileUploadFormField' })

      await fileUploadField.vm.$emit('file-deleted', 'selected-file.pdf')

      expect(form.setFieldValue).not.toHaveBeenCalledWith('traceName', '')
    })
  })
})
