import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { AssociateElementsDrawerSectionStub } from '@/features/student/global/components/sections/AssociateElementsDrawerSection/AssociateElementsDrawerSection.stub'
import { DeclaredExperienceActivitySectorFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.stub'
import { DeclaredExperienceDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.stub'
import { DeclaredExperienceExternalLinkFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.stub'
import { DeclaredExperienceLocationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.stub'
import { DeclaredExperienceOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.stub'
import { DeclaredExperiencePeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.stub'
import { DeclaredExperienceSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.stub'
import { DeclaredExperienceSummaryFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.stub'
import { DeclaredExperienceTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.stub'
import { DeclaredExperienceTypeFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.stub'
import AddDeclaredExperienceDrawer from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/AddDeclaredExperienceDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { TraceAssociationTypes } from '@/features/student/traces/types/trace-association.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvAccordionStub, AvCancelConfirmButtonsStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    ConfirmationModal: ConfirmationModalStub,
    DeclaredExperienceTitleFormField: DeclaredExperienceTitleFormFieldStub,
    DeclaredExperienceTypeFormField: DeclaredExperienceTypeFormFieldStub,
    DeclaredExperienceOrganizationFormField: DeclaredExperienceOrganizationFormFieldStub,
    DeclaredExperienceActivitySectorFormField: DeclaredExperienceActivitySectorFormFieldStub,
    DeclaredExperienceLocationFormField: DeclaredExperienceLocationFormFieldStub,
    DeclaredExperiencePeriodFormField: DeclaredExperiencePeriodFormFieldStub,
    DeclaredExperienceSourceOfInformationFormField: DeclaredExperienceSourceOfInformationFormFieldStub,
    DeclaredExperienceDescriptionFormField: DeclaredExperienceDescriptionFormFieldStub,
    DeclaredExperienceSummaryFormField: DeclaredExperienceSummaryFormFieldStub,
    DeclaredExperienceExternalLinkFormField: DeclaredExperienceExternalLinkFormFieldStub,
    AssociateElementsDrawerSection: AssociateElementsDrawerSectionStub
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

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
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the title', () => {
      const avIconText = wrapper.findComponent({ name: 'AvIconText' })

      expect(avIconText.props('text')).toBe('Ajouter une expérience déclarée')
      expect(avIconText.props('icon')).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
    })

    BddTest().then('it should render accordion group with two accordions', () => {
      const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })

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
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const addExperienceAccordion = accordions[0]

      expect(addExperienceAccordion.props('title')).toBe('Ajouter mon expérience')
      expect(addExperienceAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render association accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associationAccordion = accordions[1]

      expect(associationAccordion.props('title')).toBe('Associer mon expérience')
    })

    BddTest().then('it should render the associate elements drawer section', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.exists()).toBe(true)
    })

    BddTest().then('it should pass typeConfigs for declared skills and traces', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      const typeConfigs = section.props('typeConfigs') as AssociateElementTypeConfig[]

      expect(typeConfigs).toHaveLength(2)
      expect(typeConfigs).toStrictEqual([
        {
          key: EAssociationContextType.DECLARED_SKILL,
          label: 'Mes compétences',
          searchPlaceholder: 'Rechercher une compétence...'
        },
        {
          key: EAssociationContextType.TRACE,
          label: 'Mes traces',
          subConfigs: [
            {
              key: TraceAssociationTypes.ASSOCIATED,
              label: 'associées',
              searchPlaceholder: 'Rechercher une trace associée...'
            },
            {
              key: TraceAssociationTypes.UNASSOCIATED,
              label: 'non associées',
              searchPlaceholder: 'Rechercher une trace non associée...'
            }
          ]
        }
      ])
    })

    BddTest().then('it should default the active sub type key to associated traces', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.props('activeSubTypeKey')).toBe(TraceAssociationTypes.ASSOCIATED)
    })

    BddTest().and('the associate elements section emits an active sub type update', () => {
      beforeEach(async () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        section.vm.$emit('update:activeSubTypeKey', TraceAssociationTypes.UNASSOCIATED)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the active sub type key to unassociated traces', () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        expect(section.props('activeSubTypeKey')).toBe(TraceAssociationTypes.UNASSOCIATED)
      })
    })

    BddTest().and('the associate elements section resets the active sub type key', () => {
      beforeEach(async () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        section.vm.$emit('update:activeSubTypeKey', undefined)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should leave the active sub type key ASSOCIATED', () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        expect(section.props('activeSubTypeKey')).toBe(TraceAssociationTypes.ASSOCIATED)
      })
    })

    BddTest().then('it should default the active type key to declared skills', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.props('activeTypeKey')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().and('the associate elements section emits an active type update', () => {
      beforeEach(async () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        await section.vm.$emit('update:activeTypeKey', EAssociationContextType.TRACE)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the active type key to traces', () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        expect(section.props('activeTypeKey')).toBe(EAssociationContextType.TRACE)
      })
    })

    BddTest().then('it should render the associate elements section in vertical layout', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.props('layout')).toBe('vertical')
    })

    BddTest().and('the associate elements section emits a search query update', () => {
      beforeEach(async () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        await section.vm.$emit('update:searchQuery', 'skill')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should forward the search query back to the section', () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)

        expect(section.props('searchQuery')).toBe('skill')
      })
    })

    BddTest().and('the associate elements section emits a selections update', () => {
      const newSelections = {
        [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
        [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
      }

      beforeEach(async () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
        await section.vm.$emit('update:selectionsByType', newSelections)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the associationSelections form field', () => {
        const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)

        expect(section.props('selectionsByType')).toStrictEqual(newSelections)
      })
    })

    BddTest().then('it should have confirmation modal rendered', () => {
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmationModal.exists()).toBe(true)
    })

    BddTest().and('store showAddDeclaredExperienceDrawer is false', () => {
      beforeEach(async () => {
        const store = usePersonalCareerStore()
        store.hideAddDeclaredExperienceDrawer()
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
          expect(store.showAddDeclaredExperienceDrawer).toBe(false)
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
