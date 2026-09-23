import type { AssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationElementsDropdownVariant } from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import {
  createMockedTraceAssociations,
  mockedDeclaredActivityAssociations,
  mockedEmptyAssociations,
  mockedTraceAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode } from '@/common/exceptions'
import { AssociatedElementsCardStub } from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.stub'
import ElementAssociations, {
  type ElementAssociationsProps
} from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.vue'
import {
  AssociationElementsDropdownStub
} from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.stub'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import {
  DeleteAssociationsModalStub
} from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const UNASSOCIATE_DISABLED_TOOLTIPS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'Aucune trace associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'Aucune activité associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_SKILL]: 'Aucune compétence associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'Aucune expérience associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_PROGRAM]: 'Aucune formation associée ne peut être dissociée.'
}

function unassociateItem (type: EAssociationContextType, disabled: boolean) {
  return { type, disabled, disabledTooltip: UNASSOCIATE_DISABLED_TOOLTIPS[type] }
}

BddTest().given('an element associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ElementAssociations>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AssociationElementsDropdown: AssociationElementsDropdownStub,
    AssociatedElementsCard: AssociatedElementsCardStub,
    AssociateModal: AssociateModalStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub
  }

  const slots = {
    footer: '<div data-testid="footer-slot">Footer</div>',
    header: '<div data-testid="header-slot">Header</div>'
  }

  const declaredActivityProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: 'declared-activity-1',
    associations: mockedDeclaredActivityAssociations
  }

  const traceProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.TRACE,
    elementId: 'trace-1',
    associations: mockedTraceAssociations
  }

  const getDropdown = (variant: AssociationElementsDropdownVariant) => wrapper.findAllComponents(AssociationElementsDropdownStub)
    .find(dropdown => dropdown.props('variant') === variant)
  const getAssociateModals = () => wrapper.findAllComponents(AssociateModalStub)
  const getDeleteModals = () => wrapper.findAllComponents(DeleteAssociationsModalStub)
  const getAssociateModal = (associatedContextType: EAssociationContextType) => getAssociateModals()
    .find(modal => modal.props('associatedContextType') === associatedContextType)!
  const getDeleteModal = (associatedContextType: EAssociationContextType) => getDeleteModals()
    .find(modal => modal.props('associatedContextType') === associatedContextType)!
  const getCards = () => wrapper.findAllComponents(AssociatedElementsCardStub)
  const getOpenedModals = () => [
    ...getAssociateModals()
      .filter(modal => modal.props('opened'))
      .map(modal => ({ modal: 'associate', associatedContextType: modal.props('associatedContextType') })),
    ...getDeleteModals()
      .filter(modal => modal.props('opened'))
      .map(modal => ({ modal: 'delete', associatedContextType: modal.props('associatedContextType') }))
  ]

  function mountElementAssociations (props: ElementAssociationsProps) {
    wrapper = mountComponent(ElementAssociations, { props, slots, global: { stubs } })
  }

  async function selectDropdownItem (variant: AssociationElementsDropdownVariant, associatedContextType: EAssociationContextType) {
    getDropdown(variant)!.vm.$emit('select', associatedContextType)
    await nextTick()
  }

  BddTest().when('the associations of a declared activity are displayed', () => {
    beforeEach(() => {
      mountElementAssociations(declaredActivityProps)
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-activity-associations"]').exists()).toBe(true)
    })

    BddTest().then('it should render the delete dropdown with an enabled item per associated context type', () => {
      const dropdown = getDropdown('delete')!

      expect(dropdown.attributes('data-testid')).toBe('delete-declared-activity-associated-elements-dropdown')
      expect(dropdown.props('disabled')).toBe(false)
      expect(dropdown.props('items')).toEqual([
        unassociateItem(EAssociationContextType.TRACE, false),
        unassociateItem(EAssociationContextType.DECLARED_SKILL, false)
      ])
    })

    BddTest().then('it should render the associate dropdown with an enabled item per associable context type', () => {
      const dropdown = getDropdown('associate')!

      expect(dropdown.attributes('data-testid')).toBe('declared-activity-associate-elements-dropdown')
      expect(dropdown.props('disabled')).toBe(false)
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.TRACE, disabled: false },
        { type: EAssociationContextType.DECLARED_SKILL, disabled: false }
      ])
    })

    BddTest().then('it should render the footer and the header slots', () => {
      expect(wrapper.find('[data-testid="footer-slot"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="header-slot"]').exists()).toBe(true)
    })

    BddTest().then('it should render the query suspense with the texts of the context type', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('isEmpty')).toBe(false)
      expect(querySuspense.props('error')).toBeNull()
      expect(querySuspense.props('errorTitle'))
        .toBe('Une erreur est survenue lors de la récupération des éléments associés à l\'activité.')
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune association pour cette activité.')
    })

    BddTest().then('it should render an enabled associated elements card per associated context type', () => {
      const cards = getCards()

      expect(cards).toHaveLength(2)
      expect(cards.map(card => card.props('associatedContextType'))).toEqual([
        EAssociationContextType.TRACE,
        EAssociationContextType.DECLARED_SKILL
      ])
      cards.forEach((card) => {
        expect(card.props('associations')).toEqual(mockedDeclaredActivityAssociations)
        expect(card.props('limit')).toBeUndefined()
        expect(card.props('disabled')).toBe(false)
      })
    })

    BddTest().then('it should not render any modal before an association action is chosen', () => {
      expect(getAssociateModals()).toHaveLength(0)
      expect(getDeleteModals()).toHaveLength(0)
    })

    BddTest().and('the user chooses to associate traces', () => {
      beforeEach(async () => {
        await selectDropdownItem('associate', EAssociationContextType.TRACE)
      })

      BddTest().then('it should only open the associate traces modal', () => {
        expect(getOpenedModals()).toEqual([{ modal: 'associate', associatedContextType: EAssociationContextType.TRACE }])
      })

      BddTest().then('it should render a single associate modal and a single delete associations modal for the element', () => {
        expect(getAssociateModals()).toHaveLength(1)
        expect(getDeleteModals()).toHaveLength(1)
        expect(getAssociateModals()[0].props()).toMatchObject({
          contextType: EAssociationContextType.DECLARED_ACTIVITY,
          elementId: 'declared-activity-1'
        })
        expect(getDeleteModals()[0].props()).toMatchObject({
          contextType: EAssociationContextType.DECLARED_ACTIVITY,
          elementId: 'declared-activity-1',
          associations: mockedDeclaredActivityAssociations
        })
      })

      BddTest().and('the user cancels the association', () => {
        beforeEach(async () => {
          getAssociateModal(EAssociationContextType.TRACE).vm.$emit('cancel')
          await nextTick()
        })

        BddTest().then('it should close the associate traces modal', () => {
          expect(getOpenedModals()).toHaveLength(0)
        })
      })

      BddTest().and('the traces get associated', () => {
        beforeEach(async () => {
          getAssociateModal(EAssociationContextType.TRACE).vm.$emit('associated')
          await nextTick()
        })

        BddTest().then('it should close the associate traces modal', () => {
          expect(getOpenedModals()).toHaveLength(0)
        })
      })

      BddTest().and('the user cancels, then chooses to delete declared skill associations', () => {
        beforeEach(async () => {
          getAssociateModal(EAssociationContextType.TRACE).vm.$emit('cancel')
          await nextTick()
          await selectDropdownItem('delete', EAssociationContextType.DECLARED_SKILL)
        })

        BddTest().then('it should only open the delete associations modal, for the declared skills', () => {
          expect(getOpenedModals()).toEqual([{ modal: 'delete', associatedContextType: EAssociationContextType.DECLARED_SKILL }])
        })

        BddTest().then('it should reuse the associate modal for the newly selected context type', () => {
          expect(getAssociateModals()).toHaveLength(1)
          expect(getAssociateModals()[0].props('associatedContextType')).toBe(EAssociationContextType.DECLARED_SKILL)
        })
      })
    })

    BddTest().and('the user chooses to associate declared skills', () => {
      beforeEach(async () => {
        await selectDropdownItem('associate', EAssociationContextType.DECLARED_SKILL)
      })

      BddTest().then('it should only open the associate declared skills modal', () => {
        expect(getOpenedModals()).toEqual([{ modal: 'associate', associatedContextType: EAssociationContextType.DECLARED_SKILL }])
      })
    })

    BddTest().and('the user chooses to delete declared skill associations', () => {
      beforeEach(async () => {
        await selectDropdownItem('delete', EAssociationContextType.DECLARED_SKILL)
      })

      BddTest().then('it should only open the delete declared skill associations modal', () => {
        expect(getOpenedModals()).toEqual([{ modal: 'delete', associatedContextType: EAssociationContextType.DECLARED_SKILL }])
      })

      BddTest().and('the user cancels the deletion', () => {
        beforeEach(async () => {
          getDeleteModal(EAssociationContextType.DECLARED_SKILL).vm.$emit('cancel')
          await nextTick()
        })

        BddTest().then('it should close the delete declared skill associations modal', () => {
          expect(getOpenedModals()).toHaveLength(0)
        })
      })

      BddTest().and('the associations get deleted', () => {
        beforeEach(async () => {
          getDeleteModal(EAssociationContextType.DECLARED_SKILL).vm.$emit('deleted')
          await nextTick()
        })

        BddTest().then('it should close the delete declared skill associations modal', () => {
          expect(getOpenedModals()).toHaveLength(0)
        })
      })
    })
  })

  BddTest().when('the association limit of traces is reached and declared skills cannot be associated', () => {
    beforeEach(() => {
      mountElementAssociations({
        ...declaredActivityProps,
        limits: {
          [EAssociationContextType.TRACE]: 6,
          [EAssociationContextType.DECLARED_SKILL]: 0
        }
      })
    })

    BddTest().then('it should disable the associate items of the limited context types', () => {
      expect(getDropdown('associate')!.props('items')).toEqual([
        { type: EAssociationContextType.TRACE, disabled: true },
        { type: EAssociationContextType.DECLARED_SKILL, disabled: true }
      ])
    })

    BddTest().then('it should only disable the delete item of the context type whose limit is 0', () => {
      expect(getDropdown('delete')!.props('disabled')).toBe(false)
      expect(getDropdown('delete')!.props('items')).toEqual([
        unassociateItem(EAssociationContextType.TRACE, false),
        unassociateItem(EAssociationContextType.DECLARED_SKILL, true)
      ])
    })

    BddTest().then('it should pass the limit of each context type to its card', () => {
      expect(getCards().map(card => card.props('limit'))).toEqual([6, 0])
    })
  })

  BddTest().when('the association limits are not reached', () => {
    beforeEach(() => {
      mountElementAssociations({
        ...declaredActivityProps,
        limits: {
          [EAssociationContextType.TRACE]: 7,
          [EAssociationContextType.DECLARED_SKILL]: -1
        }
      })
    })

    BddTest().then('it should enable every associate item', () => {
      expect(getDropdown('associate')!.props('items')).toEqual([
        { type: EAssociationContextType.TRACE, disabled: false },
        { type: EAssociationContextType.DECLARED_SKILL, disabled: false }
      ])
    })

    BddTest().then('it should pass the limit of each context type to its card', () => {
      expect(getCards().map(card => card.props('limit'))).toEqual([7, -1])
    })
  })

  BddTest().when('the only associations belong to a context type that cannot be associated', () => {
    beforeEach(() => {
      mountElementAssociations({
        ...declaredActivityProps,
        associations: { ...mockedEmptyAssociations, declaredSkillAssociations: mockedDeclaredActivityAssociations.declaredSkillAssociations },
        limits: { [EAssociationContextType.DECLARED_SKILL]: 0 }
      })
    })

    BddTest().then('it should disable the delete dropdown', () => {
      expect(getDropdown('delete')!.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is readonly', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, readonly: true })
    })

    BddTest().then('it should not render the association actions nor the footer slot', () => {
      expect(wrapper.findAllComponents(AssociationElementsDropdownStub)).toHaveLength(0)
      expect(wrapper.find('[data-testid="footer-slot"]').exists()).toBe(false)
    })

    BddTest().then('it should still render the header slot', () => {
      expect(wrapper.find('[data-testid="header-slot"]').exists()).toBe(true)
    })

    BddTest().then('it should render disabled associated elements cards', () => {
      expect(getCards()).toHaveLength(2)
      getCards().forEach(card => expect(card.props('disabled')).toBe(true))
    })

    BddTest().then('it should not render any modal', () => {
      expect(getAssociateModals()).toHaveLength(0)
      expect(getDeleteModals()).toHaveLength(0)
    })
  })

  BddTest().when('the association actions are disabled', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, actionsDisabled: true })
    })

    BddTest().then('it should disable both dropdowns', () => {
      expect(getDropdown('associate')!.props('disabled')).toBe(true)
      expect(getDropdown('delete')!.props('disabled')).toBe(true)
    })

    BddTest().then('it should not pass any disabled tooltip to the dropdowns without explanation', () => {
      expect(getDropdown('associate')!.props('disabledTooltip')).toBeUndefined()
      expect(getDropdown('delete')!.props('disabledTooltip')).toBeUndefined()
    })
  })

  BddTest().when('the association actions are disabled with an explanation', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, actionsDisabled: true, actionsDisabledTooltip: 'Actions indisponibles' })
    })

    BddTest().then('it should pass the explanation as disabled tooltip to both dropdowns', () => {
      expect(getDropdown('associate')!.props('disabledTooltip')).toBe('Actions indisponibles')
      expect(getDropdown('delete')!.props('disabledTooltip')).toBe('Actions indisponibles')
    })
  })

  BddTest().when('the association actions are enabled with an explanation for when they are disabled', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, actionsDisabledTooltip: 'Actions indisponibles' })
    })

    BddTest().then('it should not pass the explanation to the dropdowns', () => {
      expect(getDropdown('associate')!.props('disabledTooltip')).toBeUndefined()
      expect(getDropdown('delete')!.props('disabledTooltip')).toBeUndefined()
    })

    BddTest().then('it should keep the associated elements cards enabled', () => {
      getCards().forEach(card => expect(card.props('disabled')).toBe(false))
    })
  })

  BddTest().when('the element has no association', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, associations: mockedEmptyAssociations })
    })

    BddTest().then('it should display the empty state of the context type', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').text()).toBe('Aucune association pour cette activité.')
      expect(getCards()).toHaveLength(0)
    })

    BddTest().then('it should disable the delete dropdown and its items', () => {
      expect(getDropdown('delete')!.props('disabled')).toBe(true)
      expect(getDropdown('delete')!.props('items')).toEqual([
        unassociateItem(EAssociationContextType.TRACE, true),
        unassociateItem(EAssociationContextType.DECLARED_SKILL, true)
      ])
    })

    BddTest().then('it should keep the associate dropdown enabled', () => {
      expect(getDropdown('associate')!.props('disabled')).toBe(false)
    })
  })

  BddTest().when('the associations are loading', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, associations: undefined, isLoading: true })
    })

    BddTest().then('it should display the loading state', () => {
      expect(wrapper.find('[data-testid="query-suspense-loading"]').exists()).toBe(true)
    })

    BddTest().and('the user chooses to delete trace associations', () => {
      beforeEach(async () => {
        await selectDropdownItem('delete', EAssociationContextType.TRACE)
      })

      BddTest().then('it should pass empty associations to the delete associations modal', () => {
        expect(getDeleteModal(EAssociationContextType.TRACE).props('associations')).toEqual(mockedEmptyAssociations)
      })
    })
  })

  BddTest().when('the associations failed to load', () => {
    const error: BaseApiException = {
      name: 'mockError',
      message: 'error',
      status: 500,
      code: BaseApiErrorCode.SERVER
    }

    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, associations: undefined, error })
    })

    BddTest().then('it should display the error of the context type', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toEqual(error)
      expect(wrapper.find('[data-testid="query-suspense-error"]').text())
        .toContain('Une erreur est survenue lors de la récupération des éléments associés à l\'activité.')
    })
  })

  BddTest().when('only some of the associable context types are displayed', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      traceAssociations: createMockedTraceAssociations(2)
    }

    beforeEach(() => {
      mountElementAssociations({
        contextType: EAssociationContextType.DECLARED_SKILL,
        elementId: 'declared-skill-1',
        associations,
        associatedContextTypes: [EAssociationContextType.DECLARED_ACTIVITY]
      })
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-skill-associations"]').exists()).toBe(true)
    })

    BddTest().then('it should only manage the given context types', () => {
      expect(getDropdown('associate')!.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: false }
      ])
      expect(getDropdown('delete')!.props('items')).toEqual([
        unassociateItem(EAssociationContextType.DECLARED_ACTIVITY, true)
      ])
    })

    BddTest().then('it should ignore the associations of the other context types to display the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').text()).toBe('Aucune association pour cette compétence déclarée')
    })
  })

  BddTest().when('the associations of a trace are displayed', () => {
    beforeEach(() => {
      mountElementAssociations(traceProps)
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="trace-associations"]').exists()).toBe(true)
      expect(getDropdown('associate')!.attributes('data-testid')).toBe('trace-associate-elements-dropdown')
      expect(getDropdown('delete')!.attributes('data-testid')).toBe('delete-trace-associated-elements-dropdown')
    })

    BddTest().then('it should propose to associate every context type associable with a trace', () => {
      expect(getDropdown('associate')!.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: false },
        { type: EAssociationContextType.DECLARED_SKILL, disabled: false },
        { type: EAssociationContextType.DECLARED_EXPERIENCE, disabled: false }
      ])
    })

    BddTest().then('it should only enable the delete items of the context types having associations', () => {
      expect(getDropdown('delete')!.props('items')).toEqual([
        unassociateItem(EAssociationContextType.DECLARED_ACTIVITY, false),
        unassociateItem(EAssociationContextType.DECLARED_SKILL, false),
        unassociateItem(EAssociationContextType.DECLARED_EXPERIENCE, true)
      ])
    })

    BddTest().and('the user chooses to associate declared experiences', () => {
      beforeEach(async () => {
        await selectDropdownItem('associate', EAssociationContextType.DECLARED_EXPERIENCE)
      })

      BddTest().then('it should only open the associate declared experiences modal', () => {
        const modal = getAssociateModal(EAssociationContextType.DECLARED_EXPERIENCE)

        expect(getOpenedModals()).toEqual([{ modal: 'associate', associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE }])
        expect(modal.props('contextType')).toBe(EAssociationContextType.TRACE)
        expect(modal.props('elementId')).toBe('trace-1')
      })
    })
  })

  BddTest().when('the associations of a trace are displayed in demo mode', () => {
    beforeEach(() => {
      vi.stubGlobal('__DEMO_MODE__', true)
      mountElementAssociations(traceProps)
    })

    afterEach(() => {
      vi.stubGlobal('__DEMO_MODE__', false)
    })

    BddTest().then('it should not propose to associate the context types unavailable in demo mode', () => {
      expect(getDropdown('associate')!.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: false },
        { type: EAssociationContextType.DECLARED_SKILL, disabled: false }
      ])
    })

    BddTest().then('it should still propose to delete the associations of every context type', () => {
      expect(getDropdown('delete')!.props('items').map(({ type }: { type: EAssociationContextType }) => type)).toEqual([
        EAssociationContextType.DECLARED_ACTIVITY,
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_EXPERIENCE
      ])
    })
  })
})
