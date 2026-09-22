import type { AssociationSelections } from '@/features/student/associations'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { AssociationSelectionSectionStub } from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.stub'
import { DeclaredExperienceActivitySectorFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.stub'
import { DeclaredExperienceDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.stub'
import { DeclaredExperienceExternalLinkFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.stub'
import { DeclaredExperienceLocationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.stub'
import { DeclaredExperienceOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.stub'
import { DeclaredExperiencePeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.stub'
import { DeclaredExperienceResultFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceResultFormField/DeclaredExperienceResultFormField.stub'
import { DeclaredExperienceSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.stub'
import { DeclaredExperienceSummaryFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.stub'
import { DeclaredExperienceTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.stub'
import { DeclaredExperienceTypeFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.stub'
import AddDeclaredExperienceDrawer from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/AddDeclaredExperienceDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvAccordionsGroupStub, AvAccordionStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
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

BddTest().given('an add declared experience drawer avIconText', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof AddDeclaredExperienceDrawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvAccordion: AvAccordionStub,
    AvAccordionsGroup: AvAccordionsGroupStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    AvIconText: AvIconTextStub,
    ConfirmationModal: ConfirmationModalStub,
    DeclaredExperienceTitleFormField: DeclaredExperienceTitleFormFieldStub,
    DeclaredExperienceTypeFormField: DeclaredExperienceTypeFormFieldStub,
    DeclaredExperienceOrganizationFormField: DeclaredExperienceOrganizationFormFieldStub,
    DeclaredExperienceActivitySectorFormField: DeclaredExperienceActivitySectorFormFieldStub,
    DeclaredExperienceLocationFormField: DeclaredExperienceLocationFormFieldStub,
    DeclaredExperienceResultFormField: DeclaredExperienceResultFormFieldStub,
    DeclaredExperiencePeriodFormField: DeclaredExperiencePeriodFormFieldStub,
    DeclaredExperienceSourceOfInformationFormField: DeclaredExperienceSourceOfInformationFormFieldStub,
    DeclaredExperienceDescriptionFormField: DeclaredExperienceDescriptionFormFieldStub,
    DeclaredExperienceSummaryFormField: DeclaredExperienceSummaryFormFieldStub,
    DeclaredExperienceExternalLinkFormField: DeclaredExperienceExternalLinkFormFieldStub,
    AssociationSelectionSection: AssociationSelectionSectionStub
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getAvAccordions = () => wrapper.findAllComponents(AvAccordionStub)
  const getAccordionsGroup = () => wrapper.findComponent(AvAccordionsGroupStub)
  const getAssociationSelectionSection = () => wrapper.findComponent(AssociationSelectionSectionStub)
  const getAvDrawer = () => wrapper.findComponent(AvDrawerStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)
    setActivePinia(createPinia())

    const store = usePersonalCareerStore()
    store.displayAddDeclaredExperienceDrawer()

    wrapper = mountComponent<typeof AddDeclaredExperienceDrawer>(
      AddDeclaredExperienceDrawer,
      { global: { stubs } },
      { usePinia: false }
    )

    await wrapper.vm.$nextTick()
  })

  BddTest().when('the avIconText is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = getAvDrawer()

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the title', () => {
      const avIconText = wrapper.findComponent(AvIconTextStub)

      expect(avIconText.props('text')).toBe('Ajouter une expérience déclarée')
      expect(avIconText.props('icon')).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
    })

    BddTest().then('it should render accordion group with two accordions', () => {
      const accordionsGroup = wrapper.findComponent(AvAccordionsGroupStub)
      const accordions = getAvAccordions()

      expect(accordionsGroup.exists()).toBe(true)
      expect(accordions).toHaveLength(2)
    })

    BddTest().then('it should render all form field components in first accordion', () => {
      expect(wrapper.find('[data-testid="experience-title-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-type-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-organization-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-activity-sector-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-location-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-period-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-source-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-description-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-summary-form-field"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="experience-external-link-form-field"]').exists()).toBe(true)
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

    BddTest().then('it should render add experience accordion with correct title', () => {
      const accordions = getAvAccordions()
      const addExperienceAccordion = accordions[0]

      expect(addExperienceAccordion.props('title')).toBe('Ajouter mon expérience')
      expect(addExperienceAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render association accordion with correct title', () => {
      const accordions = getAvAccordions()
      const associationAccordion = accordions[1]

      expect(associationAccordion.props('title')).toBe('Associer mon expérience')
    })

    BddTest().then('it should render the association selection section in the associations accordion', () => {
      const associationAccordion = getAvAccordions()[1]
      const section = associationAccordion.findComponent(AssociationSelectionSectionStub)

      expect(section.exists()).toBe(true)
      expect(section.attributes('data-testid')).toBe('associate-elements-section')
    })

    BddTest().then('it should pass the declared experience context type', () => {
      expect(getAssociationSelectionSection().props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
    })

    BddTest().then('it should not restrict the associated context types', () => {
      expect(getAssociationSelectionSection().props('associatedContextTypes')).toBeUndefined()
    })

    BddTest().then('it should render the association selection section in vertical layout', () => {
      expect(getAssociationSelectionSection().props('layout')).toBe('vertical')
    })

    BddTest().then('it should pass the empty association selections of the form', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
    })

    BddTest().then('it should not enable the search while the associations accordion is not active', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(false)
    })

    BddTest().and('the associations accordion is activated', () => {
      beforeEach(async () => {
        await getAccordionsGroup().vm.$emit('update:activeAccordion', 1)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should enable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(true)
      })

      BddTest().and('the experience details accordion is activated', () => {
        beforeEach(async () => {
          await getAccordionsGroup().vm.$emit('update:activeAccordion', 0)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should disable the search of the association selection section', () => {
          expect(getAssociationSelectionSection().props('enabled')).toBe(false)
        })
      })

      BddTest().and('every accordion is collapsed', () => {
        beforeEach(async () => {
          await getAccordionsGroup().vm.$emit('update:activeAccordion', undefined)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should disable the search of the association selection section', () => {
          expect(getAssociationSelectionSection().props('enabled')).toBe(false)
        })
      })
    })

    BddTest().and('the association selection section emits a selections update', () => {
      const newSelections: AssociationSelections = {
        [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
        [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
      }

      beforeEach(async () => {
        await getAssociationSelectionSection().vm.$emit('update:selections', newSelections)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the associationSelections form field', () => {
        expect(getAssociationSelectionSection().props('selections')).toStrictEqual(newSelections)
      })

      BddTest().and('the drawer is cancelled', () => {
        beforeEach(async () => {
          await getCancelConfirmButtons().vm.$emit('cancel')
          await flushPromises()
        })

        BddTest().then('it should reset the associationSelections form field', () => {
          expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
        })
      })
    })

    BddTest().then('it should have confirmation modal rendered', () => {
      const confirmationModal = getConfirmationModal()
      expect(confirmationModal.exists()).toBe(true)
    })

    BddTest().and('store showAddDeclaredExperienceDrawer is false', () => {
      beforeEach(async () => {
        const store = usePersonalCareerStore()
        store.hideAddDeclaredExperienceDrawer()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should pass false to drawer show prop', async () => {
        const drawer = getAvDrawer()
        expect(drawer.props('show')).toBe(false)
      })
    })

    BddTest().and('escape is pressed on drawer', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          const drawer = getAvDrawer()
          await drawer.vm.$emit('escape-pressed')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should hide the drawer', () => {
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredExperienceDrawer).toBe(false)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          const drawer = getAvDrawer()
          await drawer.vm.$emit('escape-pressed')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should not hide the drawer', () => {
          const store = usePersonalCareerStore()
          expect(store.showAddDeclaredExperienceDrawer).toBe(true)
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
          expect(store.showAddDeclaredExperienceDrawer).toBe(false)
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
          expect(store.showAddDeclaredExperienceDrawer).toBe(true)
        })

        BddTest().and('confirming the modal', () => {
          beforeEach(async () => {
            const confirmationModal = getConfirmationModal()
            await confirmationModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should call guard confirm', () => {
            expect(mockConfirm).toHaveBeenCalledTimes(1)
          })
        })

        BddTest().and('closing the modal', () => {
          beforeEach(async () => {
            const confirmationModal = getConfirmationModal()
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
