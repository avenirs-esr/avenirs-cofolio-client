import type { BaseApiException } from '@avenirs-esr/shared'
import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { AssociationsDTO } from '@/api/avenir-esr'
import type { ElementAssociationsProps } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  createMockedTraceAssociations,
  mockedDeclaredActivityAssociations,
  mockedDeclaredProgramAssociations,
  mockedEmptyAssociations,
  mockedTraceAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { AssociatedElementsCardStub } from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.stub'
import ElementAssociations from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

const DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS = 'Aucune association pour cette activité.'
const DECLARED_ACTIVITY_FETCH_ERROR_TITLE = 'Une erreur est survenue lors de la récupération des éléments associés à l\'activité.'

vi.mock('@/features/student/associations/composables/use-association-limit/use-association-limit', () => ({
  useAssociationLimits: vi.fn()
}))

BddTest().given('an element associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ElementAssociations>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AssociatedElementsCard: AssociatedElementsCardStub,
  }

  type MountingOptions = ComponentMountingOptions<typeof ElementAssociations>

  const defaultProps: MountingOptions['props'] = {
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: mockedDeclaredActivityDetails.id,
    associations: mockedDeclaredActivityAssociations
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

  const declaredProgramProps: ElementAssociationsProps = {
    contextType: EAssociationContextType.DECLARED_PROGRAM,
    elementId: 'declared-program-1',
    associations: mockedDeclaredProgramAssociations
  }

  const mockLimits = (limitsByType: Partial<Record<EAssociationContextType, number>> = {}, isLoaded = true) => {
    vi.mocked(useAssociationLimits).mockReturnValue({
      getLimit: (type: EAssociationContextType) => ({
        isLoaded,
        max: limitsByType[type],
        remaining: limitsByType[type]
      }),
    } as unknown as ReturnType<typeof useAssociationLimits>)
  }

  const headerSlot = {
    header: `<template #header="{ getLimit }">
      <div data-testid="header-limit">{{ getLimit('${EAssociationContextType.TRACE}').isLoaded }}|{{ getLimit('${EAssociationContextType.TRACE}').max }}
      </div>
      </template>`
  }

  const getCards = () => wrapper.findAllComponents(AssociatedElementsCardStub)
  const getHeaderLimit = () => wrapper.find('[data-testid="header-limit"]')

  const mountWith = (
    props: Partial<typeof defaultProps> = {},
    slots: MountingOptions['slots'] = {}
  ) => {
    wrapper = mountComponent(ElementAssociations, {
      props: {
        ...defaultProps,
        ...props
      },
      slots,
      global: { stubs }
    })
  }
  beforeEach(() => {
    mockLimits()
  })

  BddTest().when('the associations of a declared activity are displayed', () => {
    beforeEach(() => {
      mountWith (declaredActivityProps)
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-activity-associations"]').exists()).toBe(true)
    })

    BddTest().then('it should render the query suspense with the texts of the context type', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('isEmpty')).toBe(false)
      expect(querySuspense.props('error')).toBeNull()
      expect(querySuspense.props('errorTitle')).toBe(DECLARED_ACTIVITY_FETCH_ERROR_TITLE)
      expect(querySuspense.props('emptyStateMessage')).toBe(DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS)
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
  })

  BddTest().when('the header slot is provided', () => {
    beforeEach(() => {
      mockLimits({ [EAssociationContextType.TRACE]: 6 })
      mountWith(declaredActivityProps, headerSlot)
    })

    BddTest().then('it should expose getLimit to the header slot', () => {
      expect(getHeaderLimit().text()).toBe('true|6')
    })
  })

  BddTest().when('limits are provide by the composable', () => {
    beforeEach(() => {
      mockLimits({
        [EAssociationContextType.TRACE]: 6,
        [EAssociationContextType.DECLARED_SKILL]: 0
      })
      mountWith (declaredActivityProps)
    })

    BddTest().then('it should pass the limit of each context type to its card', () => {
      expect(getCards().map(card => card.props('limit'))).toEqual([6, 0, undefined, undefined])
    })
  })

  BddTest().when('the component is readonly', () => {
    beforeEach(() => {
      mountWith ({ ...declaredActivityProps, readonly: true }, headerSlot)
    })

    BddTest().then('it should still render the header slot', () => {
      expect(getHeaderLimit().exists()).toBe(true)
    })
  })

  BddTest().when('the element has no association', () => {
    beforeEach(() => {
      mountWith({ ...declaredActivityProps, associations: mockedEmptyAssociations })
    })

    BddTest().then('it should mark the suspense as empty and render no card', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isEmpty')).toBe(true)
      expect(getCards()).toHaveLength(0)
    })
  })

  BddTest().when('the associations are loading', () => {
    beforeEach(() => {
      mountWith ({ ...declaredActivityProps, associations: undefined, isLoading: true })
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
      mountWith ({ ...declaredActivityProps, associations: undefined, error })
    })

    BddTest().then('it should display the error of the context type', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toEqual(error)
    })
  })

  BddTest().when('associations are displayed for a context type', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      traceAssociations: createMockedTraceAssociations(2)
    }

    beforeEach(() => {
      mountWith ({
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
      mountWith (traceProps)
    })

    BddTest().then('it should render a card for the associated declared programs', () => {
      const card = getCards().find(card => card.props('associatedContextType') === EAssociationContextType.DECLARED_PROGRAM)

      expect(card).toBeDefined()
      expect(card!.props('associations')).toEqual(mockedTraceAssociations)
    })
  })

  BddTest().when('the associations of a declared program are displayed', () => {
    beforeEach(() => {
      mountWith (declaredProgramProps)
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
