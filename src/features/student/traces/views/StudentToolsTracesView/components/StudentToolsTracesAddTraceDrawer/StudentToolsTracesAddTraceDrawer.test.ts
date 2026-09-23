import type { AssociationSelections } from '@/features/student/associations'
import {
  EAssociationContextType,
  ETraceAuthorType,
  type FileDTO
} from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import { AssociationSelectionSectionStub } from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.stub'
import { useTracesStore } from '@/features/student/traces'
import StudentToolsTracesAddTraceDrawer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
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

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

BddTest().given('a student tools traces add trace drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesAddTraceDrawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvAccordionsGroup: {
      name: 'AvAccordionsGroup',
      props: ['activeAccordion'],
      emits: ['update:activeAccordion'],
      template: '<div class="av-accordions-group-stub"><slot /></div>'
    },
    AvAccordion: {
      name: 'AvAccordion',
      props: ['title', 'icon'],
      template: '<div class="av-accordion-stub"><slot /></div>'
    },
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    Toggle: ToggleStub,
    ConfirmationModal: ConfirmationModalStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    AssociationSelectionSection: AssociationSelectionSectionStub,
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getSaveButton = () => getCancelConfirmButtons()?.find('.confirm')
  const getCancelButton = () => getCancelConfirmButtons()?.find('.cancel')
  const getAccordionsGroup = () => wrapper.findComponent({ name: 'AvAccordionsGroup' })
  const getAssociationSelectionSection = () => wrapper.findComponent(AssociationSelectionSectionStub)

  const fillFormFields = async (traceName = 'My Test Trace', personalNote = 'Test personal note') => {
    await wrapper.vm.$nextTick()

    const nameCmp = wrapper.findComponent({ name: 'TraceNameInput' })
    expect(nameCmp.exists()).toBe(true)
    await nameCmp.vm.$emit('update:modelValue', traceName)

    const noteCmp = wrapper.findComponent({ name: 'TracePersonalNoteTextarea' })
    expect(noteCmp.exists()).toBe(true)
    await noteCmp.vm.$emit('update:modelValue', personalNote)

    const fileCmp = wrapper.findComponent({ name: 'TraceFileUpload' })
    expect(fileCmp.exists()).toBe(true)

    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    await fileCmp.vm.$emit('update:modelValue', mockFile)

    await wrapper.vm.$nextTick()

    return { mockFile }
  }

  const clickSaveButton = async () => {
    const saveButton = getSaveButton()
    await saveButton?.trigger('click')
  }

  const clickCancelButton = async () => {
    const cancelButton = getCancelButton()
    await cancelButton?.trigger('click')
  }

  const setAuthorType = async (value: ETraceAuthorType) => {
    const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
    expect(radioSet.exists()).toBe(true)
    await radioSet.vm.$emit('update:modelValue', value)
    await wrapper.vm.$nextTick()
  }

  const setIAToggle = async (value: boolean) => {
    const toggles = wrapper.findAllComponents({ name: 'Toggle' })
    const iaToggle = toggles.find(toggle => toggle.props('id') === 'use-ia')
    expect(iaToggle).toBeDefined()
    await iaToggle!.vm.$emit('update:modelValue', value)
    await wrapper.vm.$nextTick()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(avenirEsrApi, 'uploadAttachment').mockResolvedValue({} as FileDTO)
    mockCanLeave.mockResolvedValue(true)

    wrapper = mountComponent<typeof StudentToolsTracesAddTraceDrawer>(StudentToolsTracesAddTraceDrawer, {
      global: {
        stubs
      }
    })

    const store = useTracesStore()
    store.displayCreateTraceDrawer()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('50rem')
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.attributes('data-testid')).toBe('student-tools-traces-add-trace-drawer__title')
      expect(title.props('text')).toBe('Ajouter une trace')
    })

    BddTest().then('it should render accordion group with three accordions', () => {
      const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })

      expect(accordionsGroup.exists()).toBe(true)
      expect(accordions).toHaveLength(3)
    })

    BddTest().then('it should render the create trace form items in first accordion', () => {
      const createTraceFormItems = wrapper.find('.create-trace-form-trace-definition-items')
      expect(createTraceFormItems.exists()).toBe(true)
    })

    BddTest().then('it should render the create trace form declaration items in second accordion', () => {
      const declarationItems = wrapper.find('.create-trace-form-declaration-items')
      expect(declarationItems.exists()).toBe(true)
    })

    BddTest().then('it should render footer buttons', () => {
      const cancelButton = getCancelButton()
      expect(cancelButton.exists()).toBe(true)
      const saveButton = getSaveButton()
      expect(saveButton.exists()).toBe(true)

      expect(cancelButton.text()).toBe('Quitter')
      expect(saveButton.text()).toBe('Enregistrer')
    })

    BddTest().then('it should render form element', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })
  })

  BddTest().when('store showCreateTraceDrawer is false', () => {
    BddTest().then('it should pass false to drawer show prop', async () => {
      const store = useTracesStore()
      store.hideCreateTraceDrawer()
      await wrapper.vm.$nextTick()

      const drawer = wrapper.findComponent({ name: 'AvDrawer' })
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        await drawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        await drawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not hide the drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })
    })
  })

  BddTest().when('cancel button is clicked', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        await clickCancelButton()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        await fillFormFields()
        await clickCancelButton()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not hide the drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
          await confirmationModal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
          await confirmationModal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard cancel', () => {
          expect(mockCancel).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  BddTest().when('save button is clicked', () => {
    BddTest().then('it should show success message when form is valid', async () => {
      await fillFormFields()
      await setAuthorType(ETraceAuthorType.PERSONAL)
      await clickSaveButton()

      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith({
          timeout: 2000,
          description: 'Votre trace a été ajoutée à votre bibliothèque.'
        })
      }, { timeout: 5000 })
    })

    BddTest().then('it should show error message when trace creation fails', async () => {
      await fillFormFields('ERROR_TRACE')
      await setAuthorType(ETraceAuthorType.PERSONAL)
      await clickSaveButton()

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors de la création de la trace.',
          description: expect.any(String)
        })
      }, { timeout: 5000 })
    })

    BddTest().then('it should not submit when required fields are missing', async () => {
      await fillFormFields()
      await clickSaveButton()

      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not submit when IA is enabled but justification is empty', async () => {
      await fillFormFields()
      await setAuthorType(ETraceAuthorType.PERSONAL)
      await setIAToggle(true)
      await clickSaveButton()

      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('save button state', () => {
    BddTest().then('it should be disabled by default', async () => {
      const cancelConfirmButtons = getCancelConfirmButtons()

      expect(cancelConfirmButtons.props('confirmDisabled')).toBe(true)
    })
  })

  BddTest().when('component has accordion items', () => {
    BddTest().then('it should render add trace accordion with correct props', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const addTraceAccordion = accordions[0]

      expect(addTraceAccordion.props('title')).toBe('Ajouter ma trace')
      expect(addTraceAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render declarations accordion', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const declarationsAccordion = accordions[1]

      expect(declarationsAccordion.props('title')).toBe('Effectuer mes déclarations')
    })

    BddTest().then('it should render associate trace accordion', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associateTraceAccordion = accordions[2]

      expect(associateTraceAccordion.props('title')).toBe('Associer ma trace')
    })
  })

  BddTest().when('the association selection section is rendered', () => {
    BddTest().then('it should render the association selection section in the third accordion', () => {
      const associateTraceAccordion = wrapper.findAllComponents({ name: 'AvAccordion' })[2]
      const section = associateTraceAccordion.findComponent(AssociationSelectionSectionStub)

      expect(section.exists()).toBe(true)
      expect(section.attributes('data-testid')).toBe('associate-elements-section')
    })

    BddTest().then('it should pass the trace context type', () => {
      expect(getAssociationSelectionSection().props('contextType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should only allow to associate declared skills, activities and programs', () => {
      expect(getAssociationSelectionSection().props('associatedContextTypes')).toStrictEqual([
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_ACTIVITY,
        EAssociationContextType.DECLARED_PROGRAM
      ])
    })

    BddTest().then('it should use the default horizontal layout', () => {
      expect(getAssociationSelectionSection().props('layout')).toBe('horizontal')
    })

    BddTest().then('it should pass the empty association selections of the form', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
    })

    BddTest().then('it should not enable the search while the associate trace accordion is not active', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(false)
    })
  })

  BddTest().when('the associate trace accordion is activated', () => {
    beforeEach(async () => {
      await getAccordionsGroup().vm.$emit('update:activeAccordion', 2)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should enable the search of the association selection section', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(true)
    })

    BddTest().and('another accordion is activated', () => {
      beforeEach(async () => {
        await getAccordionsGroup().vm.$emit('update:activeAccordion', 1)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should disable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })

    BddTest().and('the drawer is cancelled', () => {
      beforeEach(async () => {
        await clickCancelButton()
        await flushPromises()
      })

      BddTest().then('it should reactivate the first accordion and disable the search', () => {
        expect(getAccordionsGroup().props('activeAccordion')).toBe(0)
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })
  })

  BddTest().when('the association selection section emits a selections update', () => {
    const selections: AssociationSelections = {
      [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
      [EAssociationContextType.DECLARED_ACTIVITY]: [{ id: 'activity-1', title: 'Activity 1' }]
    }

    beforeEach(async () => {
      await getAssociationSelectionSection().vm.$emit('update:selections', selections)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the association selections of the form', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual(selections)
    })

    BddTest().and('the drawer is cancelled', () => {
      beforeEach(async () => {
        await clickCancelButton()
        await flushPromises()
      })

      BddTest().then('it should reset the association selections of the form', () => {
        expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
      })
    })
  })
})
