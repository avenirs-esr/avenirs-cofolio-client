import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { MockInstance } from 'vitest'
import { createMockedTraceSearchResults } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  associateErrorHandler,
  createAssociateHandler,
  searchForAssociationErrorHandler
} from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ICONS } from '@/common/constants'
import { AssociationCompactCardStub } from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.stub'
import {
  AssociationSearchFilterSelectStub
} from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.stub'
import AssociateModal, { type AssociateModalProps } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import {
  ConfirmAssociateModalStub
} from '@/features/student/associations/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient } from '@tanstack/vue-query'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

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

/**
 * Same as the shared layout stub, but also renders the selected items slot
 * to check how the modal displays the selected elements.
 */
const SearchAssociationLayoutWithItemsStub = defineComponent({
  ...SearchAssociationLayoutStub,
  template: `
    <div data-testid="search-association-layout-stub">
      <slot name="beforeSearch" />
      <div
        v-for="item in items"
        :key="item.id"
        data-testid="search-association-layout-selected-item-stub"
      >
        <slot name="selectedItem" :item="item" />
      </div>
    </div>
  `
})

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'

const unassociatedTraceOptions = createMockedTraceSearchResults(false)
  .map(({ id, title, disabled }) => ({ label: title, value: id, disabled }))

BddTest().given('an associate modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateModal>>
  let invalidateQueriesSpy: MockInstance

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutWithItemsStub,
    AssociationSearchFilterSelect: AssociationSearchFilterSelectStub,
    AssociationCompactCard: AssociationCompactCardStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const traceProps: AssociateModalProps = {
    opened: true,
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: 'declared-activity-1',
    associatedContextType: EAssociationContextType.TRACE
  }

  const skillProps: AssociateModalProps = {
    opened: true,
    contextType: EAssociationContextType.TRACE,
    elementId: 'trace-1',
    associatedContextType: EAssociationContextType.DECLARED_SKILL
  }

  const getModal = () => wrapper.findComponent(AvModalStub)
  const getLayout = () => wrapper.findComponent(SearchAssociationLayoutWithItemsStub)
  const getFilterSelect = () => wrapper.findComponent(AssociationSearchFilterSelectStub)
  const getConfirmModal = () => wrapper.findComponent(ConfirmAssociateModalStub)
  const getCancelConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getLayoutOptions = () => getLayout().props('options') as AvAutocompleteOption[]

  async function waitForSearchResults () {
    await vi.waitFor(() => {
      expect(getModal().props('isLoading')).toBe(false)
      expect(getLayoutOptions().length).toBeGreaterThan(0)
    })
  }

  async function mountModal (props: AssociateModalProps) {
    wrapper = mountComponent(AssociateModal, { props, global: { stubs } })
    await waitForSearchResults()
  }

  async function selectOptions (count: number) {
    getLayout().vm.$emit('update:modelValue', getLayoutOptions().slice(0, count))
    await nextTick()
  }

  async function confirmAssociation () {
    getModal().vm.$emit('confirm')
    await nextTick()
    getConfirmModal().vm.$emit('confirm')
    await nextTick()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    invalidateQueriesSpy = vi.spyOn(QueryClient.prototype, 'invalidateQueries')
  })

  afterEach(() => {
    invalidateQueriesSpy.mockRestore()
  })

  BddTest().when('the modal is opened to associate traces', () => {
    beforeEach(async () => {
      await mountModal(traceProps)
    })

    BddTest().then('it should render the opened modal with its test id', () => {
      expect(getModal().props('opened')).toBe(true)
      expect(wrapper.find('[data-testid="associate-traces-modal"]').exists()).toBe(true)
    })

    BddTest().then('it should display the title of the associated context type', () => {
      expect(wrapper.find('[data-testid="header"]').text()).toBe('Quelle(s) trace(s) souhaitez-vous associer\u00A0?')
    })

    BddTest().then('it should render the modal buttons', () => {
      expect(getModal().props('closeButtonLabel')).toBe('Annuler')
      expect(getModal().props('confirmButtonIcon')).toBe(ICONS.ASSOCIATIONS)
    })

    BddTest().then('it should disable the confirm button while nothing is selected', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should use the disabled confirm button tooltip of the associated context type', () => {
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe('Sélectionnez au moins une trace à associer')
    })

    BddTest().then('it should render the search filter select with the unassociated filter by default', () => {
      expect(getFilterSelect().exists()).toBe(true)
      expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
      expect(getFilterSelect().props('contextType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should pass the unassociated traces found by the search to the layout options', () => {
      expect(getLayoutOptions()).toEqual(unassociatedTraceOptions)
    })

    BddTest().then('it should use the placeholder of the selected search filter', () => {
      expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une trace non associée...' })
    })

    BddTest().then('it should start with an empty selection', () => {
      expect(getLayout().props('modelValue')).toEqual([])
      expect(getLayout().props('items')).toEqual([])
      expect(wrapper.findAllComponents(AssociationCompactCardStub)).toHaveLength(0)
    })

    BddTest().then('it should identify and label the options by their value and label', () => {
      const getOptionKey = getLayout().props('getOptionKey') as (option: AvAutocompleteOption) => string | number
      const getOptionLabel = getLayout().props('getOptionLabel') as (option: AvAutocompleteOption) => string

      expect(getOptionKey(unassociatedTraceOptions[0])).toBe('trace-non-associee1')
      expect(getOptionLabel(unassociatedTraceOptions[0])).toBe('Ma super trace non associée numéro 1')
    })

    BddTest().then('it should render the confirm associate modal and the cancel confirmation modal closed', () => {
      expect(getConfirmModal().props('opened')).toBe(false)
      expect(getConfirmModal().props('items')).toEqual([])
      expect(getCancelConfirmationModal().props('opened')).toBe(false)
      expect(getCancelConfirmationModal().props('description'))
        .toBe('Êtes-vous certain(e) de vouloir abandonner l\'association de traces\u00A0?')
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
          { label: 'Ma super trace non associée numéro 3', value: 'trace-non-associee3', disabled: false }
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
        expect(getLayoutOptions().map(({ value }) => value)).toEqual([
          ...createMockedTraceSearchResults(true).map(({ id }) => id),
          ...createMockedTraceSearchResults(false).map(({ id }) => id)
        ])
      })

      BddTest().then('it should use the placeholder of the selected search filter', () => {
        expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une trace...' })
      })
    })

    BddTest().and('the user searches in the associated traces', () => {
      beforeEach(async () => {
        getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ASSOCIATED)
        await vi.waitFor(() => expect(getLayoutOptions()[0].value).toBe('trace-associee1'))
      })

      BddTest().then('it should only pass the associated traces to the layout options', () => {
        expect(getLayoutOptions().map(({ value }) => value))
          .toEqual(createMockedTraceSearchResults(true).map(({ id }) => id))
      })

      BddTest().then('it should use the placeholder of the selected search filter', () => {
        expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une trace associée...' })
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
        expect(getCancelConfirmationModal().props('opened')).toBe(false)
      })
    })

    BddTest().and('the user selects two traces', () => {
      const expectedSelectedAssociations = [
        { id: 'trace-non-associee1', title: 'Ma super trace non associée numéro 1' },
        { id: 'trace-non-associee2', title: 'Ma super trace non associée numéro 2' }
      ]

      beforeEach(async () => {
        await selectOptions(2)
      })

      BddTest().then('it should pass the selected traces to the layout', () => {
        expect(getLayout().props('modelValue')).toEqual(unassociatedTraceOptions.slice(0, 2))
        expect(getLayout().props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should display each selected trace in a compact card', () => {
        const cards = wrapper.findAllComponents(AssociationCompactCardStub)

        expect(cards).toHaveLength(2)
        expect(cards[0].props('contextType')).toBe(EAssociationContextType.TRACE)
        expect(cards[0].props('association')).toEqual(expectedSelectedAssociations[0])
        expect(cards[1].props('association')).toEqual(expectedSelectedAssociations[1])
      })

      BddTest().then('it should enable the confirm button with a pluralized label', () => {
        expect(getModal().props('confirmButtonDisabled')).toBe(false)
        expect(getModal().props('confirmButtonLabel')).toBe('Associer les traces sélectionnées (2)')
      })

      BddTest().then('it should pass the selected traces to the confirm associate modal', () => {
        expect(getConfirmModal().props('items')).toEqual(expectedSelectedAssociations)
        expect(getConfirmModal().props('title')).toBe('Êtes-vous certain(e) de vouloir associer ces traces\u00A0?')
      })

      BddTest().and('the user removes one of the selected traces', () => {
        beforeEach(async () => {
          getLayout().vm.$emit('delete', 'trace-non-associee2')
          await nextTick()
        })

        BddTest().then('it should remove the trace from the selection', () => {
          expect(getLayout().props('modelValue')).toEqual(unassociatedTraceOptions.slice(0, 1))
          expect(getLayout().props('items')).toEqual(expectedSelectedAssociations.slice(0, 1))
          expect(wrapper.findAllComponents(AssociationCompactCardStub)).toHaveLength(1)
        })

        BddTest().then('it should display a singular confirm button label', () => {
          expect(getModal().props('confirmButtonLabel')).toBe('Associer la trace sélectionnée (1)')
        })

        BddTest().then('it should display a singular confirm associate modal title', () => {
          expect(getConfirmModal().props('title')).toBe('Êtes-vous certain(e) de vouloir associer cette trace\u00A0?')
        })
      })

      BddTest().and('the user confirms the selection', () => {
        beforeEach(async () => {
          getModal().vm.$emit('confirm')
          await nextTick()
        })

        BddTest().then('it should open the confirm associate modal', () => {
          expect(getConfirmModal().props('opened')).toBe(true)
        })

        BddTest().and('the user cancels the association', () => {
          beforeEach(async () => {
            getConfirmModal().vm.$emit('cancel')
            await nextTick()
          })

          BddTest().then('it should close the confirm associate modal', () => {
            expect(getConfirmModal().props('opened')).toBe(false)
          })

          BddTest().then('it should keep the selection', () => {
            expect(getLayout().props('items')).toEqual(expectedSelectedAssociations)
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
          expect(getConfirmModal().props('opened')).toBe(false)
        })

        BddTest().then('it should associate the selected traces to the element', () => {
          expect(onAssociateRequest).toHaveBeenCalledTimes(1)
          expect(onAssociateRequest).toHaveBeenCalledWith(
            expect.objectContaining({
              contextType: EAssociationContextType.DECLARED_ACTIVITY,
              elementId: 'declared-activity-1',
              associatedContextType: EAssociationContextType.TRACE
            }),
            { idsToAssociate: ['trace-non-associee1', 'trace-non-associee2'] }
          )
        })

        BddTest().then('it should invalidate the queries impacted by the association', () => {
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'associations'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'activity-progress'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'traces'] })
        })

        BddTest().then('it should display a success message', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Vous avez associé 2 traces. Retrouvez-les dans la catégorie « Mes traces associées ».'
          })
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
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: GENERIC_ERROR_TITLE,
            description: expect.any(String)
          })
        })

        BddTest().then('it should neither display a success message nor emit associated', () => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(wrapper.emitted('associated')).toBeUndefined()
        })

        BddTest().then('it should keep the selection to let the user retry', () => {
          expect(getConfirmModal().props('opened')).toBe(false)
          expect(getLayout().props('items')).toEqual(expectedSelectedAssociations)
        })
      })

      BddTest().and('the user closes the modal', () => {
        beforeEach(async () => {
          getModal().vm.$emit('close')
          await nextTick()
        })

        BddTest().then('it should ask for a cancel confirmation', () => {
          expect(getCancelConfirmationModal().props('opened')).toBe(true)
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
            expect(getCancelConfirmationModal().props('opened')).toBe(false)
          })

          BddTest().then('it should keep the selection without emitting cancel', () => {
            expect(getLayout().props('items')).toEqual(expectedSelectedAssociations)
            expect(wrapper.emitted('cancel')).toBeUndefined()
          })
        })

        BddTest().and('the user confirms the cancellation', () => {
          beforeEach(async () => {
            getCancelConfirmationModal().vm.$emit('confirm')
            await nextTick()
          })

          BddTest().then('it should close the cancel confirmation modal', () => {
            expect(getCancelConfirmationModal().props('opened')).toBe(false)
          })

          BddTest().then('it should reset the selection', () => {
            expect(getLayout().props('modelValue')).toEqual([])
            expect(getLayout().props('items')).toEqual([])
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
          expect(getLayout().props('modelValue')).toEqual([])
          expect(getLayout().props('items')).toEqual([])
          expect(getLayout().props('search')).toBe('')
          expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
          expect(getConfirmModal().props('opened')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the modal is opened to associate traces and the user filters and searches them', () => {
    beforeEach(async () => {
      await mountModal(traceProps)
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
        expect(getLayout().props('search')).toBe('')
        expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the modal is reused to associate another context type', () => {
    beforeEach(async () => {
      await mountModal(traceProps)
      await wrapper.setProps({ associatedContextType: EAssociationContextType.DECLARED_SKILL })
      await vi.waitFor(() => expect(getLayoutOptions()[0].value).toBe('skill-search-1'))
    })

    BddTest().then('it should search the elements of the new context type', () => {
      expect(getLayoutOptions().map(({ value }) => value)).toEqual(['skill-search-1', 'skill-search-2', 'skill-search-3'])
    })

    BddTest().then('it should use the texts of the new context type', () => {
      expect(wrapper.find('[data-testid="associate-declared-skills-modal"]').exists()).toBe(true)
      expect(getFilterSelect().exists()).toBe(false)
      expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une compétence...' })
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe('Sélectionnez au moins une compétence à associer')
    })
  })

  BddTest().when('the modal is opened to associate declared skills', () => {
    const expectedSkillOptions = [
      { label: 'Gestion de projet agile', value: 'skill-search-1', description: 'Rome 4.0', category: 'ROME4', disabled: false },
      { label: 'Communication interpersonnelle', value: 'skill-search-2', description: 'XXIᵉ onisep', category: 'XXI', disabled: false },
      { label: 'Analyse de données', value: 'skill-search-3', description: 'Rome 4.0', category: 'ROME4', disabled: true }
    ]

    beforeEach(async () => {
      await mountModal(skillProps)
    })

    BddTest().then('it should render the modal with the test id of the associated context type', () => {
      expect(wrapper.find('[data-testid="associate-declared-skills-modal"]').exists()).toBe(true)
    })

    BddTest().then('it should display the title of the associated context type', () => {
      expect(wrapper.find('[data-testid="header"]').text()).toBe('Quelle(s) compétence(s) déclarée(s) souhaitez-vous associer\u00A0?')
    })

    BddTest().then('it should use the disabled confirm button tooltip of the associated context type', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe('Sélectionnez au moins une compétence à associer')
    })

    BddTest().then('it should not render the search filter select since declared skills are not filterable', () => {
      expect(getFilterSelect().exists()).toBe(false)
    })

    BddTest().then('it should use the placeholder of the associated context type', () => {
      expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une compétence...' })
    })

    BddTest().then('it should pass the declared skills found by the search to the layout options, with their translated category', () => {
      expect(getLayoutOptions()).toEqual(expectedSkillOptions)
    })

    BddTest().and('the user selects a declared skill', () => {
      const expectedSelectedAssociation = {
        id: 'skill-search-1',
        title: 'Gestion de projet agile',
        description: 'Rome 4.0',
        category: 'ROME4'
      }

      beforeEach(async () => {
        await selectOptions(1)
      })

      BddTest().then('it should display the selected declared skill in a compact card', () => {
        const card = wrapper.findComponent(AssociationCompactCardStub)

        expect(card.props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
        expect(card.props('association')).toEqual(expectedSelectedAssociation)
      })

      BddTest().then('it should display a singular confirm button label', () => {
        expect(getModal().props('confirmButtonLabel')).toBe('Associer la compétence sélectionnée (1)')
      })

      BddTest().then('it should pass the selected declared skill to the confirm associate modal', () => {
        expect(getConfirmModal().props('items')).toEqual([expectedSelectedAssociation])
        expect(getConfirmModal().props('title')).toBe('Êtes-vous certain(e) de vouloir associer cette compétence\u00A0?')
      })

      BddTest().then('it should use the cancel confirmation of the associated context type', () => {
        expect(getCancelConfirmationModal().props('description'))
          .toBe('Êtes-vous certain(e) de vouloir abandonner l\'association de compétences\u00A0?')
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
            expect.objectContaining({
              contextType: EAssociationContextType.TRACE,
              elementId: 'trace-1',
              associatedContextType: EAssociationContextType.DECLARED_SKILL
            }),
            { idsToAssociate: ['skill-search-1'] }
          )
        })

        BddTest().then('it should invalidate the queries impacted by the association', () => {
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'associations'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'traces'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'declared', 'skill-progress'] })
        })

        BddTest().then('it should display the success message of the associated context type', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: '1 compétence associée avec succès'
          })
        })

        BddTest().then('it should emit associated', () => {
          expect(wrapper.emitted('associated')).toHaveLength(1)
        })
      })
    })
  })

  BddTest().when('the modal is closed', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateModal, { props: { ...traceProps, opened: false }, global: { stubs } })
      await flushPromises()
    })

    BddTest().then('it should render the modal closed', () => {
      expect(getModal().props('opened')).toBe(false)
    })

    BddTest().then('it should not search for traces', () => {
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
      wrapper = mountComponent(AssociateModal, { props: traceProps, global: { stubs } })
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
      wrapper = mountComponent(AssociateModal, { props: traceProps, global: { stubs } })
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: expect.any(String)
      })
    })

    BddTest().then('it should not pass any option to the layout', () => {
      expect(getLayoutOptions()).toEqual([])
    })
  })
})
