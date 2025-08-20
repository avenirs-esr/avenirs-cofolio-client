import type { AttachmentUploadDTO, CreateTraceDTO, TracesCreationResponse, UploadAttachmentBody } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import * as avenirEsrApi from '@/api/avenir-esr'
import { useTracesStore } from '@/store'
import { waitFor } from 'storybook/test'
import { mountComponent } from 'tests/utils'
import StudentToolsTracesAddTraceDrawer from './StudentToolsTracesAddTraceDrawer.vue'

const stubs = {
  AvDrawer: {
    name: 'AvDrawer',
    props: ['show', 'position', 'width'],
    emits: ['escape-pressed'],
    template: '<div class="av-drawer-stub"><slot /><slot name="footer" /></div>'
  },
  AvAccordionsGroup: {
    name: 'AvAccordionsGroup',
    template: '<div class="av-accordions-group-stub"><slot /></div>'
  },
  AvAccordion: {
    name: 'AvAccordion',
    props: ['title', 'icon'],
    template: '<div class="av-accordion-stub"><slot /></div>'
  },
  AvButton: {
    name: 'AvButton',
    props: ['label', 'variant', 'type', 'icon', 'disabled', 'loading'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ label }}</button>'
  }
}

describe('studentToolsTracesAddTraceDrawer', () => {
  let createTraceSpy: MockInstance<(createTraceDTO: CreateTraceDTO, options?: RequestInit) => Promise<TracesCreationResponse>>
  let uploadAttachmentSpy: MockInstance<(traceId: string, uploadAttachmentBody: UploadAttachmentBody, options?: RequestInit) => Promise<AttachmentUploadDTO>>

  describe('given a student tools traces add trace drawer component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesAddTraceDrawer>>

    beforeEach(() => {
      vi.clearAllMocks()

      createTraceSpy = vi.spyOn(avenirEsrApi, 'createTrace')
      uploadAttachmentSpy = vi.spyOn(avenirEsrApi, 'uploadAttachment')

      wrapper = mountComponent<typeof StudentToolsTracesAddTraceDrawer>(StudentToolsTracesAddTraceDrawer, {
        global: {
          stubs
        }
      })

      const store = useTracesStore()
      store.displayCreateTraceDrawer()
    })

    afterEach(() => {
      createTraceSpy?.mockRestore()
      uploadAttachmentSpy?.mockRestore()
    })

    describe('when the component is mounted', () => {
      it('then it should render the drawer with correct props', () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        expect(drawer.exists()).toBe(true)
        expect(drawer.props('position')).toBe('left')
        expect(drawer.props('width')).toBe('50rem')
      })

      it('then it should render the title', () => {
        const title = wrapper.find('.student-tools-traces-add-trace-drawer__title')

        expect(title.exists()).toBe(true)
        expect(title.text()).toBe('Ajouter une trace')
      })

      it('then it should render accordion group with three accordions', () => {
        const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
        const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })

        expect(accordionsGroup.exists()).toBe(true)
        expect(accordions).toHaveLength(3)
      })

      it('then it should render the create trace form items in first accordion', () => {
        const createTraceFormItems = wrapper.find('.create-trace-form-trace-definition-items')
        expect(createTraceFormItems.exists()).toBe(true)
      })

      it('then it should render footer buttons', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const cancelButton = buttons.find(button => button.props('variant') === 'OUTLINED')
        const saveButton = buttons.find(button => button.props('variant') === 'FLAT')

        expect(buttons).toHaveLength(2)
        expect(cancelButton?.props('label')).toBe('QUITTER')
        expect(saveButton?.props('label')).toBe('ENREGISTRER')
      })

      it('then it should render form element', () => {
        const form = wrapper.find('form')
        expect(form.exists()).toBe(true)
      })
    })

    describe('when store showCreateTraceDrawer is false', () => {
      it('then it should pass false to drawer show prop', async () => {
        const store = useTracesStore()
        store.hideCreateTraceDrawer()
        await wrapper.vm.$nextTick()

        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        expect(drawer.props('show')).toBe(false)
      })
    })

    describe('when escape is pressed on drawer', () => {
      it('then it should hideCreateTraceDrawer', async () => {
        const store = useTracesStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateTraceDrawer')
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        await drawer.vm.$emit('escape-pressed')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when cancel button is clicked', () => {
      it('then it should hideCreateTraceDrawer', async () => {
        const store = useTracesStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateTraceDrawer')

        const cancelButton = wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
          button.props('variant') === 'OUTLINED'
        )

        await cancelButton?.vm.$emit('click')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when form is filled and save button is clicked', () => {
      it('then it should call API functions with correct arguments', async () => {
        const traceNameInput = wrapper.find('#trace-name')
        const personalNoteInput = wrapper.find('#personal-note')
        const fileInput = wrapper.find('#trace-file-upload')

        const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

        await traceNameInput.setValue('My Test Trace')
        await personalNoteInput.setValue('Test personal note')

        Object.defineProperty(fileInput.element, 'files', {
          value: [mockFile],
          writable: false,
        })
        await fileInput.trigger('change')

        await wrapper.vm.$nextTick()

        const saveButton = wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
          button.props('variant') === 'FLAT'
        )
        await saveButton?.vm.$emit('click')

        await wrapper.vm.$nextTick()

        await waitFor(() => {
          expect(createTraceSpy).toHaveBeenCalledWith({
            title: 'My Test Trace',
            language: 'FRENCH',
            personalNote: 'Test personal note',
            isGroup: false
          })
        })

        expect(uploadAttachmentSpy).toHaveBeenCalledWith(
          expect.any(String),
          { file: mockFile }
        )
      })
    })

    describe('when save button state', () => {
      it('then it should be enabled by default', async () => {
        const saveButton = wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
          button.props('variant') === 'FLAT'
        )

        expect(saveButton?.props('disabled')).toBe(false)
      })
    })

    describe('when component has accordion items', () => {
      it('then it should render add trace accordion with correct props', () => {
        const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
        const addTraceAccordion = accordions[0]

        expect(addTraceAccordion.props('title')).toBe('Ajouter ma trace')
        expect(addTraceAccordion.props('icon')).toBeDefined()
      })

      it('then it should render declarations accordion', () => {
        const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
        const declarationsAccordion = accordions[1]

        expect(declarationsAccordion.props('title')).toBe('Effectuer mes déclarations')
      })

      it('then it should render associate trace accordion', () => {
        const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
        const associateTraceAccordion = accordions[2]

        expect(associateTraceAccordion.props('title')).toBe('Associer ma trace')
      })
    })
  })
})
