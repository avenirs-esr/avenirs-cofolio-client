import type { AssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { VueWrapper } from '@vue/test-utils'
import {
  createMockedTraceAssociations,
  mockedDeclaredActivityAssociations,
  mockedDeclaredProgramAssociations,
  mockedEmptyAssociations,
  mockedTraceAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
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
import { beforeEach, expect } from 'vitest'

BddTest().given('an element associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ElementAssociations>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AssociationElementsDropdown: AssociationElementsDropdownStub,
    AssociatedElementsCard: AssociatedElementsCardStub,
  }

  const slots = {
    footer: '<div data-testid="footer-slot">Footer</div>',
    header: '<div data-testid="header-slot">Header</div>'
  }

  const declaredActivityProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    associations: mockedDeclaredActivityAssociations
  }

  const traceProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.TRACE,
    associations: mockedTraceAssociations
  }

  const declaredProgramProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.DECLARED_PROGRAM,
    associations: mockedDeclaredProgramAssociations
  }

  const getAssociateModals = () => wrapper.findAllComponents(AssociateModalStub)
  const getDeleteModals = () => wrapper.findAllComponents(DeleteAssociationsModalStub)
  const getCards = () => wrapper.findAllComponents(AssociatedElementsCardStub)

  function mountElementAssociations (props: ElementAssociationsProps) {
    wrapper = mountComponent(ElementAssociations, { props, slots, global: { stubs } })
  }

  BddTest().when('the associations of a declared activity are displayed', () => {
    beforeEach(() => {
      mountElementAssociations(declaredActivityProps)
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-activity-associations"]').exists()).toBe(true)
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

      expect(cards).toHaveLength(4)
      expect(cards.map(card => card.props('associatedContextType'))).toEqual([
        EAssociationContextType.TRACE,
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_EXPERIENCE,
        EAssociationContextType.DECLARED_PROGRAM
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

    BddTest().then('it should pass the limit of each context type to its card', () => {
      expect(getCards().map(card => card.props('limit'))).toEqual([6, 0, undefined, undefined])
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

    BddTest().then('it should pass the limit of each context type to its card', () => {
      expect(getCards().map(card => card.props('limit'))).toEqual([7, -1, undefined, undefined])
    })
  })

  BddTest().when('the component is readonly', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, readonly: true })
    })

    BddTest().then('it should still render the header slot', () => {
      expect(wrapper.find('[data-testid="header-slot"]').exists()).toBe(true)
    })

    BddTest().then('it should render disabled associated elements cards', () => {
      expect(getCards()).toHaveLength(4)
      getCards().forEach(card => expect(card.props('disabled')).toBe(true))
    })

    BddTest().then('it should not render any modal', () => {
      expect(getAssociateModals()).toHaveLength(0)
      expect(getDeleteModals()).toHaveLength(0)
    })
  })

  BddTest().when('the association actions are enabled with an explanation for when they are disabled', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps })
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
  })

  BddTest().when('the associations are loading', () => {
    beforeEach(() => {
      mountElementAssociations({ ...declaredActivityProps, associations: undefined, isLoading: true })
    })

    BddTest().then('it should display the loading state', () => {
      expect(wrapper.find('[data-testid="query-suspense-loading"]').exists()).toBe(true)
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

  BddTest().when('associations are displayed for a context type', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      traceAssociations: createMockedTraceAssociations(2)
    }

    beforeEach(() => {
      mountElementAssociations({
        contextType: EAssociationContextType.DECLARED_SKILL,
        associations,
      })
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(
        wrapper.find('[data-testid="declared-skill-associations"]').exists()
      ).toBe(true)
    })
  })

  BddTest().when('the associations of a trace are displayed', () => {
    beforeEach(() => {
      mountElementAssociations(traceProps)
    })

    BddTest().then('it should render a card for the associated declared programs', () => {
      const card = getCards().find(card => card.props('associatedContextType') === EAssociationContextType.DECLARED_PROGRAM)

      expect(card).toBeDefined()
      expect(card!.props('associations')).toEqual(mockedTraceAssociations)
    })
  })

  BddTest().when('the associations of a declared program are displayed', () => {
    beforeEach(() => {
      mountElementAssociations(declaredProgramProps)
    })

    BddTest().then('it should render a card per context type associable with a declared program', () => {
      const cards = getCards()

      expect(cards.map(card => card.props('associatedContextType'))).toEqual([
        EAssociationContextType.TRACE,
        EAssociationContextType.DECLARED_ACTIVITY,
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_EXPERIENCE
      ])
      cards.forEach(card => expect(card.props('associations')).toEqual(mockedDeclaredProgramAssociations))
    })
  })
})
