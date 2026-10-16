import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { AssociateModalProps } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import type { Association } from '@/features/student/associations/types/associations.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMockedTraceSearchResults } from '@/__mocks__/fixtures/student/associations.fixtures'
import { associateErrorHandler, createAssociateHandler, searchForAssociationErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import { ICONS } from '@/common/constants'
import { AssociationCompactCardStub } from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.stub'
import { AssociationSearchFilterSelectStub } from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.stub'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import { ConfirmAssociateModalStub } from '@/features/student/associations/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { getContextTypeSlug } from '@/features/student/associations/utils/associations.utils'

const ASSOCIATED_TRACES_PLACEHOLDER = 'Rechercher une trace associée...'
const DISABLED_TOOLTIP = 'Cet élément est déjà associé.'
const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const LIMIT_REACHED_TOOLTIP = 'Nombre maximal d\'associations autorisées atteint.'
const ROME4_LABEL = 'Rome 4.0'
const SELECTION_LIMIT_REACHED_TOOLTIP = 'Vous avez atteint le nombre maximal d\'éléments pouvant être sélectionnés.'
const SKILLS_CANCEL_CONFIRMATION = 'Êtes-vous certain(e) de vouloir abandonner l\'association de compétences\u00A0?'
const SKILLS_CONFIRM_BUTTON_DISABLED_TOOLTIP = 'Sélectionnez au moins une compétence à associer'
const SKILLS_PLACEHOLDER = 'Rechercher une compétence...'
const SKILLS_TITLE = 'Quelle(s) compétence(s) déclarée(s) souhaitez-vous associer\u00A0?'
const TRACES_CANCEL_CONFIRMATION = 'Êtes-vous certain(e) de vouloir abandonner l\'association de traces\u00A0?'
const TRACES_CONFIRM_BUTTON_DISABLED_TOOLTIP = 'Sélectionnez au moins une trace à associer'
const TRACES_PLACEHOLDER = 'Rechercher une trace...'
const TRACES_TITLE = 'Quelle(s) trace(s) souhaitez-vous associer\u00A0?'
const UNASSOCIATED_TRACES_PLACEHOLDER = 'Rechercher une trace non associée...'
const XXI_LABEL = 'XXIᵉ onisep'

const ONE_SKILL_ASSOCIATED_MESSAGE = '1 compétence associée avec succès'
const ONE_SKILL_CONFIRM_BUTTON_LABEL = 'Associer la compétence sélectionnée (1)'
const ONE_SKILL_CONFIRM_TITLE = 'Êtes-vous certain(e) de vouloir associer cette compétence\u00A0?'
const ONE_TRACE_CONFIRM_BUTTON_LABEL = 'Associer la trace sélectionnée (1)'
const ONE_TRACE_CONFIRM_TITLE = 'Êtes-vous certain(e) de vouloir associer cette trace\u00A0?'

const TWO_TRACES_ASSOCIATED_MESSAGE = 'Vous avez associé 2 traces. Retrouvez-les dans la catégorie « Mes traces associées ».'
const TWO_TRACES_CONFIRM_BUTTON_LABEL = 'Associer les traces sélectionnées (2)'
const TWO_TRACES_CONFIRM_TITLE = 'Êtes-vous certain(e) de vouloir associer ces traces\u00A0?'

const defaultProps: AssociateModalProps = {
  opened: true,
  contextType: EAssociationContextType.DECLARED_ACTIVITY,
  elementId: 'declared-activity-1',
  associatedContextType: EAssociationContextType.TRACE
}

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const unassociatedTraceOptions = createMockedTraceSearchResults(false).map(({ id, title, disabled }) => ({ label: title, value: id, disabled, disabledTooltip: DISABLED_TOOLTIP }))
const UNASSOCIATED_TRACE_IDS = unassociatedTraceOptions.map(({ value }) => value)
const ASSOCIATED_TRACE_IDS = createMockedTraceSearchResults(true).map(({ id }) => id)

BddTest().given('an associate modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateModal>>

  const stubs = {
    SearchAssociationLayout: SearchAssociationLayoutStub,
    AssociationSearchFilterSelect: AssociationSearchFilterSelectStub,
    AssociationCompactCard: AssociationCompactCardStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const mountWith = (props: Partial<AssociateModalProps> = {}) => {
    vi.clearAllMocks()
    wrapper = mountComponent(AssociateModal, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getSlug = () => getContextTypeSlug(wrapper.props('associatedContextType'), true)

  const getModal = () => wrapper.findComponent(`[data-testid="associate-${getSlug()}-modal"]`) as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
  const getCancelConfirmationModal = () => wrapper.findComponent(`[data-testid="associate-${getSlug()}-confirmation-modal"]`) as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
  const getLayout = () => wrapper.findComponent(SearchAssociationLayoutStub)
  const getFilterSelect = () => wrapper.findComponent(AssociationSearchFilterSelectStub)
  const getConfirmModal = () => wrapper.findComponent(ConfirmAssociateModalStub)
  const getCompactCard = () => wrapper.findComponent(AssociationCompactCardStub)
  const getCompactCards = () => wrapper.findAllComponents(AssociationCompactCardStub)
  const getHeader = () => wrapper.find('[data-testid="header"]')

  const getLayoutOptions = () => getLayout().props('options') as AvAutocompleteOption[]
  const getLayoutOptionIds = () => getLayoutOptions().map(({ value }) => value)
  const getLayoutOptionStates = () => getLayoutOptions().map(({ value, disabled, disabledTooltip }) => ({ value, disabled, disabledTooltip }))

  const waitForSearchResults = async () => {
    await vi.waitFor(() => {
      expect(getModal().props('isLoading')).toBe(false)
      expect(getLayoutOptions().length).toBeGreaterThan(0)
    })
  }

  const mountWithResults = async (props: Partial<AssociateModalProps> = {}) => {
    mountWith(props)
    await waitForSearchResults()
  }

  const selectOptions = async (count: number) => {
    getLayout().vm.$emit('update:modelValue', getLayoutOptions().slice(0, count))
    await nextTick()
  }

  const confirmAssociation = async () => {
    getModal().vm.$emit('confirm')
    await nextTick()
    getConfirmModal().vm.$emit('confirm')
    await nextTick()
  }

  const expectPlaceholder = (placeholder: string) => {
    expect(getLayout().props('inputOptions')).toEqual({ placeholder })
  }

  const expectSelection = (options: AvAutocompleteOption[], associations: Array<Partial<Association>>) => {
    const layout = getLayout()
    expect(layout.props('modelValue')).toEqual(options)
    expect(layout.props('items')).toEqual(associations)
  }

  const expectNoSelection = () => {
    expectSelection([], [])
  }

  const expectConfirmModalOpened = (opened: boolean) => {
    expect(getConfirmModal().props('opened')).toBe(opened)
  }

  const expectCancelConfirmationOpened = (opened: boolean) => {
    expect(getCancelConfirmationModal().props('opened')).toBe(opened)
  }

  const expectSearchAndFilterReset = () => {
    expect(getLayout().props('search')).toBe('')
    expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
  }

  BddTest().when('the modal is opened to associate traces', () => {
    beforeEach(async () => {
      await mountWithResults()
    })

    BddTest().then('it should render the opened modal with its test id', () => {
      const modal = getModal()
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the title of the associated context type', () => {
      expect(getHeader().text()).toBe(TRACES_TITLE)
    })

    BddTest().then('it should render the modal confirm button with correct icon', () => {
      expect(getModal().props('confirmButtonIcon')).toBe(ICONS.ASSOCIATE)
    })

    BddTest().then('it should disable the confirm button while nothing is selected', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should use the disabled confirm button tooltip of the associated context type', () => {
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe(TRACES_CONFIRM_BUTTON_DISABLED_TOOLTIP)
    })

    BddTest().then('it should render the search filter select with the unassociated filter by default', () => {
      const filterSelect = getFilterSelect()
      expect(filterSelect.exists()).toBe(true)
      expect(filterSelect.props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
      expect(filterSelect.props('contextType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should pass the unassociated traces found by the search to the layout options', () => {
      expect(getLayoutOptions()).toEqual(unassociatedTraceOptions)
    })

    BddTest().then('it should use the placeholder of the selected search filter', () => {
      expectPlaceholder(UNASSOCIATED_TRACES_PLACEHOLDER)
    })

    BddTest().then('it should start with an empty selection', () => {
      expectNoSelection()
      expect(getCompactCards()).toHaveLength(0)
    })

    BddTest().then('it should identify and label the options by their value and label', () => {
      const layout = getLayout()
      const getOptionKey = layout.props('getOptionKey') as (option: AvAutocompleteOption) => string | number
      const getOptionLabel = layout.props('getOptionLabel') as (option: AvAutocompleteOption) => string

      expect(getOptionKey(unassociatedTraceOptions[0])).toBe('trace-non-associee1')
      expect(getOptionLabel(unassociatedTraceOptions[0])).toBe('Ma super trace non associée numéro 1')
    })

    BddTest().then('it should render the confirm associate modal and the cancel confirmation modal closed', () => {
      const confirmModal = getConfirmModal()
      const cancelConfirmationModal = getCancelConfirmationModal()

      expect(confirmModal.props('opened')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
      expect(cancelConfirmationModal.props('opened')).toBe(false)
      expect(cancelConfirmationModal.props('description')).toBe(TRACES_CANCEL_CONFIRMATION)
    })

    BddTest().and('the user searches for a keyword', () => {
      beforeEach(async () => {
        getLayout().vm.$emit('update:search', 'numéro 3')
        await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(1))
      })

      BddTest().then('it should pass the search query to the layout', () => {
        expect(getLayout().props('search')).toBe('numéro 3')
      })

      BddTest().then('it should only pass the matching traces to the layout options', () => {
        expect(getLayoutOptions()).toEqual([
          { label: 'Ma super trace non associée numéro 3', value: 'trace-non-associee3', disabled: false, disabledTooltip: DISABLED_TOOLTIP }
        ])
      })
    })

    BddTest().and('the user searches in all the traces', () => {
      beforeEach(async () => {
        getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ALL)
        await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(10))
      })

      BddTest().then('it should update the search filter', () => {
        expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.ALL)
      })

      BddTest().then('it should pass the associated and unassociated traces to the layout options', () => {
        expect(getLayoutOptionIds()).toEqual([...ASSOCIATED_TRACE_IDS, ...UNASSOCIATED_TRACE_IDS])
      })

      BddTest().then('it should use the placeholder of the selected search filter', () => {
        expectPlaceholder(TRACES_PLACEHOLDER)
      })
    })

    BddTest().and('the user searches in the associated traces', () => {
      beforeEach(async () => {
        getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ASSOCIATED)
        await vi.waitFor(() => expect(getLayoutOptions()[0].value).toBe('trace-associee1'))
      })

      BddTest().then('it should only pass the associated traces to the layout options', () => {
        expect(getLayoutOptionIds()).toEqual(ASSOCIATED_TRACE_IDS)
      })

      BddTest().then('it should use the placeholder of the selected search filter', () => {
        expectPlaceholder(ASSOCIATED_TRACES_PLACEHOLDER)
      })
    })

    BddTest().and('the user closes the modal without any selection', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await nextTick()
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })

      BddTest().then('it should not ask for a cancel confirmation', () => {
        expectCancelConfirmationOpened(false)
      })
    })

    BddTest().and('the user selects two traces', () => {
      const selectedTraceAssociations = [
        { id: 'trace-non-associee1', title: 'Ma super trace non associée numéro 1' },
        { id: 'trace-non-associee2', title: 'Ma super trace non associée numéro 2' }
      ]

      beforeEach(async () => {
        await selectOptions(2)
      })

      BddTest().then('it should pass the selected traces to the layout', () => {
        expectSelection(unassociatedTraceOptions.slice(0, 2), selectedTraceAssociations)
      })

      BddTest().then('it should display each selected trace in a compact card', () => {
        const cards = getCompactCards()
        expect(cards).toHaveLength(2)
        expect(cards[0].props('contextType')).toBe(EAssociationContextType.TRACE)
        expect(cards[0].props('association')).toEqual(selectedTraceAssociations[0])
        expect(cards[1].props('contextType')).toBe(EAssociationContextType.TRACE)
        expect(cards[1].props('association')).toEqual(selectedTraceAssociations[1])
      })

      BddTest().then('it should enable the confirm button with a pluralized label', () => {
        const modal = getModal()
        expect(modal.props('confirmButtonDisabled')).toBe(false)
        expect(modal.props('confirmButtonLabel')).toBe(TWO_TRACES_CONFIRM_BUTTON_LABEL)
      })

      BddTest().then('it should pass the selected traces to the confirm associate modal', () => {
        const confirmModal = getConfirmModal()
        expect(confirmModal.props('items')).toEqual(selectedTraceAssociations)
        expect(confirmModal.props('title')).toBe(TWO_TRACES_CONFIRM_TITLE)
      })

      BddTest().and('the user removes one of the selected traces', () => {
        beforeEach(async () => {
          getLayout().vm.$emit('delete', 'trace-non-associee2')
          await nextTick()
        })

        BddTest().then('it should remove the trace from the selection', () => {
          expectSelection(unassociatedTraceOptions.slice(0, 1), selectedTraceAssociations.slice(0, 1))
          expect(getCompactCards()).toHaveLength(1)
        })

        BddTest().then('it should display a singular confirm button label', () => {
          expect(getModal().props('confirmButtonLabel')).toBe(ONE_TRACE_CONFIRM_BUTTON_LABEL)
        })

        BddTest().then('it should display a singular confirm associate modal title', () => {
          expect(getConfirmModal().props('title')).toBe(ONE_TRACE_CONFIRM_TITLE)
        })
      })

      BddTest().and('the user confirms the selection', () => {
        beforeEach(async () => {
          getModal().vm.$emit('confirm')
          await nextTick()
        })

        BddTest().then('it should open the confirm associate modal', () => {
          expectConfirmModalOpened(true)
        })

        BddTest().and('the user cancels the association', () => {
          beforeEach(async () => {
            getConfirmModal().vm.$emit('cancel')
            await nextTick()
          })

          BddTest().then('it should close the confirm associate modal', () => {
            expectConfirmModalOpened(false)
          })

          BddTest().then('it should keep the selection', () => {
            expect(getLayout().props('items')).toEqual(selectedTraceAssociations)
          })

          BddTest().then('it should not emit associated', () => {
            expect(wrapper.emitted('associated')).toBeUndefined()
          })
        })
      })

      BddTest().and('the user confirms the association', () => {
        const onAssociateRequest = vi.fn()

        beforeEach(async () => {
          server.use(createAssociateHandler(onAssociateRequest))
          await confirmAssociation()
          await vi.waitFor(() => expect(wrapper.emitted('associated')).toBeDefined())
        })

        BddTest().then('it should close the confirm associate modal', () => {
          expectConfirmModalOpened(false)
        })

        BddTest().then('it should associate the selected traces to the element', () => {
          expect(onAssociateRequest).toHaveBeenCalledTimes(1)
          expect(onAssociateRequest).toHaveBeenCalledWith(
            expect.objectContaining({ contextType: EAssociationContextType.DECLARED_ACTIVITY, elementId: 'declared-activity-1', associatedContextType: EAssociationContextType.TRACE }),
            { idsToAssociate: ['trace-non-associee1', 'trace-non-associee2'] }
          )
        })

        BddTest().then('it should display a success message', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({ timeout: 2000, description: TWO_TRACES_ASSOCIATED_MESSAGE })
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })

        BddTest().then('it should emit associated once', () => {
          expect(wrapper.emitted('associated')).toHaveLength(1)
          expect(wrapper.emitted('cancel')).toBeUndefined()
        })
      })

      BddTest().and('the association fails', () => {
        beforeEach(async () => {
          server.use(associateErrorHandler)
          await confirmAssociation()
          await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
          await flushPromises()
        })

        BddTest().then('it should display an error message', () => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({ title: GENERIC_ERROR_TITLE, description: expect.any(String) })
        })

        BddTest().then('it should neither display a success message nor emit associated', () => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(wrapper.emitted('associated')).toBeUndefined()
        })

        BddTest().then('it should keep the selection to let the user retry', () => {
          expectConfirmModalOpened(false)
          expect(getLayout().props('items')).toEqual(selectedTraceAssociations)
        })
      })

      BddTest().and('the user closes the modal', () => {
        beforeEach(async () => {
          getModal().vm.$emit('close')
          await nextTick()
        })

        BddTest().then('it should ask for a cancel confirmation', () => {
          expectCancelConfirmationOpened(true)
        })

        BddTest().then('it should not emit cancel yet', () => {
          expect(wrapper.emitted('cancel')).toBeUndefined()
        })

        BddTest().and('the user goes back to the selection', () => {
          beforeEach(async () => {
            getCancelConfirmationModal().vm.$emit('close')
            await nextTick()
          })

          BddTest().then('it should close the cancel confirmation modal', () => {
            expectCancelConfirmationOpened(false)
          })

          BddTest().then('it should keep the selection without emitting cancel', () => {
            expect(getLayout().props('items')).toEqual(selectedTraceAssociations)
            expect(wrapper.emitted('cancel')).toBeUndefined()
          })
        })

        BddTest().and('the user confirms the cancellation', () => {
          beforeEach(async () => {
            getCancelConfirmationModal().vm.$emit('confirm')
            await nextTick()
          })

          BddTest().then('it should close the cancel confirmation modal', () => {
            expectCancelConfirmationOpened(false)
          })

          BddTest().then('it should reset the selection', () => {
            expectNoSelection()
          })

          BddTest().then('it should emit cancel', () => {
            expect(wrapper.emitted('cancel')).toHaveLength(1)
          })
        })
      })

      BddTest().and('the user has filtered and searched the traces before confirming the association', () => {
        beforeEach(async () => {
          getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ALL)
          getLayout().vm.$emit('update:search', 'numéro')
          await nextTick()
          await confirmAssociation()
          await vi.waitFor(() => expect(wrapper.emitted('associated')).toBeDefined())
        })

        BddTest().then('it should clear the selection, the search and the filter before emitting associated', () => {
          const layout = getLayout()
          expect(layout.props('modelValue')).toEqual([])
          expect(layout.props('items')).toEqual([])
          expect(layout.props('search')).toBe('')

          expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
          expectConfirmModalOpened(false)
        })
      })
    })
  })

  BddTest().when('the modal is opened to associate traces and the user filters and searches them', () => {
    beforeEach(async () => {
      await mountWithResults()
      getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ASSOCIATED)
      getLayout().vm.$emit('update:search', 'numéro')
      await nextTick()
    })

    BddTest().and('the user closes the modal without any selection', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await nextTick()
      })

      BddTest().then('it should clear the search and the filter before emitting cancel', () => {
        expectSearchAndFilterReset()
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the declared activity can only receive two more traces', () => {
    beforeEach(async () => {
      await mountWithResults()
      await selectOptions(2)
      await vi.waitFor(() => expect(getLayoutOptions()[2].disabled).toBe(true))
    })

    BddTest().then('it should keep the selected traces selectable and block the others, with the reason', () => {
      expect(getLayoutOptionStates()).toEqual(UNASSOCIATED_TRACE_IDS.map((value, index) => (
        index < 2
          ? { value, disabled: false, disabledTooltip: DISABLED_TOOLTIP }
          : { value, disabled: true, disabledTooltip: SELECTION_LIMIT_REACHED_TOOLTIP }
      )))
    })

    BddTest().and('the user removes one of the selected traces', () => {
      beforeEach(async () => {
        getLayout().vm.$emit('delete', 'trace-non-associee2')
        await nextTick()
      })

      BddTest().then('it should let the student select the other traces again', () => {
        expect(getLayoutOptionStates()).toEqual(UNASSOCIATED_TRACE_IDS.map(value => ({ value, disabled: false, disabledTooltip: DISABLED_TOOLTIP })))
      })
    })
  })

  BddTest().when('the modal is opened to associate activities with a trace', () => {
    beforeEach(async () => {
      await mountWithResults({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_ACTIVITY
      })
    })

    BddTest().then('it should explain why each unavailable activity cannot be selected', () => {
      expect(getLayoutOptionStates()).toEqual([
        { value: 'activity-search-1', disabled: false, disabledTooltip: DISABLED_TOOLTIP },
        { value: 'activity-search-2', disabled: false, disabledTooltip: DISABLED_TOOLTIP },
        { value: 'activity-search-3', disabled: true, disabledTooltip: DISABLED_TOOLTIP },
        { value: 'activity-search-4', disabled: true, disabledTooltip: LIMIT_REACHED_TOOLTIP }
      ])
    })
  })

  BddTest().when('the modal is reused to associate another context type', () => {
    beforeEach(async () => {
      await mountWithResults()
      await wrapper.setProps({ associatedContextType: EAssociationContextType.DECLARED_SKILL })
      await vi.waitFor(() => expect(getLayoutOptions()[0].value).toBe('skill-search-1'))
    })

    BddTest().then('it should search the elements of the new context type', () => {
      expect(getLayoutOptionIds()).toEqual(['skill-search-1', 'skill-search-2', 'skill-search-3'])
    })

    BddTest().then('it should use the texts of the new context type', () => {
      const modal = getModal()
      expect(modal.exists()).toBe(true)
      expect(modal.props('confirmButtonDisabledTooltip')).toBe(SKILLS_CONFIRM_BUTTON_DISABLED_TOOLTIP)

      expect(getFilterSelect().exists()).toBe(false)
      expectPlaceholder(SKILLS_PLACEHOLDER)
    })
  })

  BddTest().when('the modal is opened to associate declared skills', () => {
    const selectedSkillAssociation = { id: 'skill-search-1', title: 'Gestion de projet agile', description: ROME4_LABEL, category: 'ROME4' }

    beforeEach(async () => {
      await mountWithResults({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL
      })
    })

    BddTest().then('it should render the modal with the test id of the associated context type', () => {
      expect(getModal().exists()).toBe(true)
    })

    BddTest().then('it should display the title of the associated context type', () => {
      expect(getHeader().text()).toBe(SKILLS_TITLE)
    })

    BddTest().then('it should use the disabled confirm button tooltip of the associated context type', () => {
      const modal = getModal()
      expect(modal.props('confirmButtonDisabled')).toBe(true)
      expect(modal.props('confirmButtonDisabledTooltip')).toBe(SKILLS_CONFIRM_BUTTON_DISABLED_TOOLTIP)
    })

    BddTest().then('it should not render the search filter select since declared skills are not filterable', () => {
      expect(getFilterSelect().exists()).toBe(false)
    })

    BddTest().then('it should use the placeholder of the associated context type', () => {
      expectPlaceholder(SKILLS_PLACEHOLDER)
    })

    BddTest().then('it should pass the declared skills found by the search to the layout options, with their translated category', () => {
      expect(getLayoutOptions()).toEqual([
        { label: 'Gestion de projet agile', value: 'skill-search-1', description: ROME4_LABEL, category: 'ROME4', disabled: false, disabledTooltip: DISABLED_TOOLTIP },
        { label: 'Communication interpersonnelle', value: 'skill-search-2', description: XXI_LABEL, category: 'XXI', disabled: false, disabledTooltip: DISABLED_TOOLTIP },
        { label: 'Analyse de données', value: 'skill-search-3', description: ROME4_LABEL, category: 'ROME4', disabled: true, disabledTooltip: DISABLED_TOOLTIP }
      ])
    })

    BddTest().and('the user selects a declared skill', () => {
      beforeEach(async () => {
        await selectOptions(1)
      })

      BddTest().then('it should display the selected declared skill in a compact card', () => {
        const card = getCompactCard()
        expect(card.props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
        expect(card.props('association')).toEqual(selectedSkillAssociation)
      })

      BddTest().then('it should display a singular confirm button label', () => {
        expect(getModal().props('confirmButtonLabel')).toBe(ONE_SKILL_CONFIRM_BUTTON_LABEL)
      })

      BddTest().then('it should pass the selected declared skill to the confirm associate modal', () => {
        const confirmModal = getConfirmModal()
        expect(confirmModal.props('items')).toEqual([selectedSkillAssociation])
        expect(confirmModal.props('title')).toBe(ONE_SKILL_CONFIRM_TITLE)
      })

      BddTest().then('it should use the cancel confirmation of the associated context type', () => {
        expect(getCancelConfirmationModal().props('description')).toBe(SKILLS_CANCEL_CONFIRMATION)
      })

      BddTest().and('the user confirms the association', () => {
        const onAssociateRequest = vi.fn()

        beforeEach(async () => {
          server.use(createAssociateHandler(onAssociateRequest))
          await confirmAssociation()
          await vi.waitFor(() => expect(wrapper.emitted('associated')).toBeDefined())
        })

        BddTest().then('it should associate the selected declared skill to the element', () => {
          expect(onAssociateRequest).toHaveBeenCalledWith(
            expect.objectContaining({ contextType: EAssociationContextType.TRACE, elementId: 'trace-1', associatedContextType: EAssociationContextType.DECLARED_SKILL }),
            { idsToAssociate: ['skill-search-1'] }
          )
        })

        BddTest().then('it should display the success message of the associated context type', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({ timeout: 2000, description: ONE_SKILL_ASSOCIATED_MESSAGE })
        })

        BddTest().then('it should emit associated', () => {
          expect(wrapper.emitted('associated')).toHaveLength(1)
        })
      })
    })
  })

  BddTest().when('the modal is closed', () => {
    beforeEach(async () => {
      mountWith({ opened: false })
      await flushPromises()
    })

    BddTest().then('it should render the modal closed', () => {
      expect(getModal().props('opened')).toBe(false)
    })

    BddTest().then('it should neither search for traces nor read the limits', () => {
      expect(getModal().props('isLoading')).toBe(false)
      expect(getLayoutOptions()).toEqual([])
    })

    BddTest().and('the modal gets opened', () => {
      beforeEach(async () => {
        await wrapper.setProps({ opened: true })
        await waitForSearchResults()
      })

      BddTest().then('it should search for the traces to associate', () => {
        expect(getLayoutOptions()).toEqual(unassociatedTraceOptions)
      })
    })
  })

  BddTest().when('the modal is opened and the search is pending', () => {
    beforeEach(() => {
      mountWith()
    })

    afterEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should display the modal and the layout as loading', () => {
      expect(getModal().props('isLoading')).toBe(true)
      expect(getLayout().props('loading')).toBe(true)
    })
  })

  BddTest().when('the search fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationErrorHandler)
      mountWith()
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({ title: GENERIC_ERROR_TITLE, description: expect.any(String) })
    })

    BddTest().then('it should not pass any option to the layout', () => {
      expect(getLayoutOptions()).toEqual([])
    })
  })
})
