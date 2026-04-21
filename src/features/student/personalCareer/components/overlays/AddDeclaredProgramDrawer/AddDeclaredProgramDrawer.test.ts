import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { DeclaredProgramDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.stub'
import { DeclaredProgramOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.stub'
import { DeclaredProgramPeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.stub'
import { DeclaredProgramResultFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.stub'
import { DeclaredProgramSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.stub'
import { DeclaredProgramTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.stub'
import AddDeclaredProgramDrawer from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/AddDeclaredProgramDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { AvAccordionStub, AvCancelConfirmButtonsStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'

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

BddTest().given('an add declared program drawer component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof AddDeclaredProgramDrawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvAccordion: AvAccordionStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    ConfirmationModal: ConfirmationModalStub,
    DeclaredProgramTitleFormField: DeclaredProgramTitleFormFieldStub,
    DeclaredProgramDescriptionFormField: DeclaredProgramDescriptionFormFieldStub,
    DeclaredProgramOrganizationFormField: DeclaredProgramOrganizationFormFieldStub,
    DeclaredProgramPeriodFormField: DeclaredProgramPeriodFormFieldStub,
    DeclaredProgramResultFormField: DeclaredProgramResultFormFieldStub,
    DeclaredProgramSourceOfInformationFormField: DeclaredProgramSourceOfInformationFormFieldStub,
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)
    setActivePinia(createPinia())

    const store = usePersonalCareerStore()
    store.displayAddDeclaredProgramDrawer()

    wrapper = mountComponent<typeof AddDeclaredProgramDrawer>(
      AddDeclaredProgramDrawer,
      { global: { stubs } },
      { usePinia: false }
    )

    await wrapper.vm.$nextTick()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.find('span')

      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Ajouter une formation déclarée')
    })

    BddTest().then('it should render accordion group with three accordions', () => {
      const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })

      expect(accordionsGroup.exists()).toBe(true)
      expect(accordions).toHaveLength(3)
    })

    BddTest().then('it should render all form field components in first accordion', () => {
      expect(wrapper.find('[data-testid="title-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="description-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="organization-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="period-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="result-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="source-form-field"]').exists()).toBe(true)
    })

    BddTest().then('it should render footer buttons', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()

      expect(cancelConfirmButtons.exists()).toBe(true)
      expect(cancelConfirmButtons.props('cancelLabel')).toBe('Annuler')
      expect(cancelConfirmButtons.props('confirmLabel')).toBe('Enregistrer')
    })

    BddTest().then('it should render form element', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })

    BddTest().then('it should be disabled initially when form is invalid', async () => {
      const cancelConfirmButtons = getCancelConfirmButtons()
      expect(cancelConfirmButtons.props('confirmDisabled')).toBe(true)
    })

    BddTest().then('it should render add program accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const addProgramAccordion = accordions[0]

      expect(addProgramAccordion.props('title')).toBe('Ajouter ma formation')
      expect(addProgramAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render specify program accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const specifyAccordion = accordions[1]

      expect(specifyAccordion.props('title')).toBe('Préciser ma formation')
    })

    BddTest().then('it should render associate program accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associateAccordion = accordions[2]

      expect(associateAccordion.props('title')).toBe('Associer ma formation')
    })

    BddTest().then('it should have confirmation modal rendered', () => {
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmationModal.exists()).toBe(true)
    })

    BddTest().and('store showAddDeclaredProgramDrawer is false', () => {
      beforeEach(async () => {
        const store = usePersonalCareerStore()
        store.hideAddDeclaredProgramDrawer()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should pass false to drawer show prop', async () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        expect(drawer.props('show')).toBe(false)
      })
    })

    BddTest().and('escape is pressed on drawer', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          const drawer = wrapper.findComponent({ name: 'AvDrawer' })
          await drawer.vm.$emit('escape-pressed')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should hide the drawer', () => {
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredProgramDrawer).toBe(false)
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
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredProgramDrawer).toBe(true)
        })
      })
    })

    BddTest().and('cancel button is clicked', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          const cancelConfirmButtons = getCancelConfirmButtons()
          await cancelConfirmButtons.vm.$emit('cancel')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should hide the drawer', () => {
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredProgramDrawer).toBe(false)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          const cancelConfirmButtons = getCancelConfirmButtons()
          await cancelConfirmButtons.vm.$emit('cancel')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should not hide the drawer', () => {
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredProgramDrawer).toBe(true)
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
  })
})
