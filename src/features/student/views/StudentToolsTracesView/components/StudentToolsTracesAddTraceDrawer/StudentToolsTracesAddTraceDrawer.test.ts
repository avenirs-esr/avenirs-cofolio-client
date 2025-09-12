import type { VueWrapper } from '@vue/test-utils'
import { useTracesStore } from '@/store'
import { mountComponent } from 'tests/utils'
import StudentToolsTracesAddTraceDrawer from './StudentToolsTracesAddTraceDrawer.vue'

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
  },
}

describe('studentToolsTracesAddTraceDrawer', () => {
  describe('given a student tools traces add trace drawer component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesAddTraceDrawer>>

    const getSaveButton = () => {
      return wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
        button.props('variant') === 'FLAT'
      )
    }

    const getCancelButton = () => {
      return wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
        button.props('variant') === 'OUTLINED'
      )
    }

    const fillFormFields = async (traceName = 'My Test Trace', personalNote = 'Test personal note') => {
      const traceNameInput = wrapper.find('#trace-name')
      const personalNoteInput = wrapper.find('#personal-note')
      const fileInput = wrapper.find('#trace-file-upload')

      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

      await traceNameInput.setValue(traceName)
      await personalNoteInput.setValue(personalNote)

      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      })
      await fileInput.trigger('change')

      await wrapper.vm.$nextTick()

      return { mockFile }
    }

    const clickSaveButton = async () => {
      const saveButton = getSaveButton()
      await saveButton?.vm.$emit('click')
    }

    const setAuthenticToggle = async (value: boolean) => {
      const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
      const authenticToggle = toggles.find(toggle => toggle.props('id') === 'isAuthentic')
      expect(authenticToggle).toBeDefined()
      await authenticToggle!.vm.$emit('update:modelValue', value)
      await wrapper.vm.$nextTick()
    }

    const setIAToggle = async (value: boolean) => {
      const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
      const iaToggle = toggles.find(toggle => toggle.props('id') === 'useIA')
      expect(iaToggle).toBeDefined()
      await iaToggle!.vm.$emit('update:modelValue', value)
      await wrapper.vm.$nextTick()
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent<typeof StudentToolsTracesAddTraceDrawer>(StudentToolsTracesAddTraceDrawer, {
        global: {
          stubs
        }
      })

      const store = useTracesStore()
      store.displayCreateTraceDrawer()
    })

    describe('when the component is mounted', () => {
      it('then it should render the drawer with correct props', () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        expect(drawer.exists()).toBe(true)
        expect(drawer.props('position')).toBe('right')
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

      it('then it should render the create trace form declaration items in second accordion', () => {
        const declarationItems = wrapper.find('.declaration-items')
        expect(declarationItems.exists()).toBe(true)
      })

      it('then it should render footer buttons', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const cancelButton = getCancelButton()
        const saveButton = getSaveButton()

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
        const cancelButton = getCancelButton()

        await cancelButton?.vm.$emit('click')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when save button is clicked', () => {
      it('then it should show success message when form is valid', async () => {
        await fillFormFields()
        await setAuthenticToggle(true)
        await clickSaveButton()

        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Votre trace a été ajoutée à votre bibliothèque.'
          })
        })
      })

      it('then it should show error message when trace creation fails', async () => {
        await fillFormFields('ERROR_TRACE')
        await setAuthenticToggle(true)
        await clickSaveButton()

        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de la création de la trace.',
            description: 'Failed to create trace'
          })
        })
      })

      it('then it should not submit when required fields are missing', async () => {
        await fillFormFields()
        await clickSaveButton()

        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })

      it('then it should not submit when IA is enabled but justification is empty', async () => {
        await fillFormFields()
        await setAuthenticToggle(true)
        await setIAToggle(true)
        await clickSaveButton()

        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    describe('when save button state', () => {
      it('then it should be enabled by default', async () => {
        const saveButton = getSaveButton()

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
