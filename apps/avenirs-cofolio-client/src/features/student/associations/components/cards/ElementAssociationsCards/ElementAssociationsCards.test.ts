import type { BaseApiException } from '@avenirs-esr/shared'
import type { AssociationsDTO, EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { ElementAssociationsCardsProps } from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode, ICONS, QuerySuspenseStub } from '@avenirs-esr/shared'
import { EAssociationContextType as AssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import {
  createMockedDeclaredActivityAssociations,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredProgramAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedDeclaredActivityAssociations,
  mockedDeclaredProgramAssociations,
  mockedEmptyAssociations,
  mockedTraceAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { AssociatedActivityCardStub } from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociatedDeclaredExperienceCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.stub'
import { AssociatedDeclaredProgramCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.stub'
import { AssociatedSkillCardStub } from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import { AssociatedTraceCardStub } from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.stub'
import { AssociationsCardStub } from '@/features/student/associations/components/cards/AssociationsCard/AssociationsCard.stub'
import ElementAssociationsCards from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

const DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS = 'Aucune association pour cette activité.'
const DECLARED_ACTIVITY_FETCH_ERROR_TITLE = 'Une erreur est survenue lors de la récupération des éléments associés à l\'activité.'

vi.mock('@/features/student/associations/composables/use-association-limit/use-association-limit', () => ({
  useAssociationLimits: vi.fn()
}))

BddTest().given('an element associations cards component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ElementAssociationsCards>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AssociationsCard: AssociationsCardStub,
    AssociatedTraceCard: AssociatedTraceCardStub,
    AssociatedActivityCard: AssociatedActivityCardStub,
    AssociatedSkillCard: AssociatedSkillCardStub,
    AssociatedDeclaredExperienceCard: AssociatedDeclaredExperienceCardStub,
    AssociatedDeclaredProgramCard: AssociatedDeclaredProgramCardStub
  }

  type MountingOptions = ComponentMountingOptions<typeof ElementAssociationsCards>

  const defaultProps: MountingOptions['props'] = {
    contextType: AssociationContextType.DECLARED_ACTIVITY,
    elementId: 'declared-activity-1',
    associations: mockedDeclaredActivityAssociations
  }

  const declaredActivityProps: ElementAssociationsCardsProps = {
    contextType: AssociationContextType.DECLARED_ACTIVITY,
    elementId: 'declared-activity-1',
    associations: mockedDeclaredActivityAssociations
  }

  const traceProps: ElementAssociationsCardsProps = {
    contextType: AssociationContextType.TRACE,
    elementId: 'trace-1',
    associations: mockedTraceAssociations
  }

  const declaredProgramProps: ElementAssociationsCardsProps = {
    contextType: AssociationContextType.DECLARED_PROGRAM,
    elementId: 'declared-program-1',
    associations: mockedDeclaredProgramAssociations
  }

  const itemCardStubs = [
    AssociatedTraceCardStub,
    AssociatedActivityCardStub,
    AssociatedSkillCardStub,
    AssociatedDeclaredExperienceCardStub,
    AssociatedDeclaredProgramCardStub
  ]

  const mockLimits = (
    limitsByType: Partial<Record<EAssociationContextType, number>> = {},
    isLoaded = true
  ) => {
    vi.mocked(useAssociationLimits).mockReturnValue({
      getLimit: (type: EAssociationContextType) => ({
        isLoaded,
        max: limitsByType[type],
        remaining: limitsByType[type]
      })
    } as unknown as ReturnType<typeof useAssociationLimits>)
  }

  const headerSlot = {
    header: `<template #header="{ getLimit }">
      <div data-testid="header-limit">
        {{ getLimit('${AssociationContextType.TRACE}').isLoaded }}|{{ getLimit('${AssociationContextType.TRACE}').max }}
      </div>
    </template>`
  }

  const getCards = () => wrapper.findAllComponents(AssociationsCardStub)
  const getHeaderLimit = () => wrapper.find('[data-testid="header-limit"]')

  const mountWith = (
    props: Partial<typeof defaultProps> = {},
    slots: MountingOptions['slots'] = {}
  ) => {
    wrapper = mountComponent(ElementAssociationsCards, {
      props: {
        ...defaultProps,
        ...props
      },
      slots,
      global: { stubs }
    })
  }

  function expectItemCards (
    itemCardStub: typeof itemCardStubs[number],
    count: number
  ) {
    expect(wrapper.findAllComponents(itemCardStub)).toHaveLength(count)
  }

  beforeEach(() => {
    mockLimits()
  })

  BddTest().when('the associations of a declared activity are displayed', () => {
    beforeEach(() => {
      mountWith(declaredActivityProps)
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

    BddTest().then('it should render an associations card per associated context type', () => {
      expect(getCards()).toHaveLength(2)

      expect(getCards().map(card => card.attributes('data-testid'))).toEqual([
        'associated-traces-card',
        'associated-declared-skills-card'
      ])
    })

    BddTest().then('it should render the associated cards with their associations', () => {
      expectItemCards(AssociatedTraceCardStub, mockedDeclaredActivityAssociations.traceAssociations.length)
      expectItemCards(AssociatedSkillCardStub, mockedDeclaredActivityAssociations.skillProgressAssociations.length)
      expectItemCards(AssociatedDeclaredProgramCardStub, mockedDeclaredActivityAssociations.declaredProgramAssociations.length)
      expectItemCards(AssociatedDeclaredExperienceCardStub, mockedDeclaredActivityAssociations.declaredExperienceAssociations.length)

      wrapper.findAllComponents(AssociatedTraceCardStub).forEach((card, index) => {
        expect(card.props('associatedTrace')).toEqual(mockedDeclaredActivityAssociations.traceAssociations[index])
      })

      wrapper.findAllComponents(AssociatedSkillCardStub).forEach((card, index) => {
        expect(card.props('declaredSkill')).toEqual(mockedDeclaredActivityAssociations.skillProgressAssociations[index].skillProgress)
      })

      wrapper.findAllComponents(AssociatedDeclaredProgramCardStub).forEach((card, index) => {
        expect(card.props('declaredProgram')).toEqual(mockedDeclaredActivityAssociations.declaredProgramAssociations[index].declaredProgram)
      })

      wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub).forEach((card, index) => {
        expect(card.props('declaredExperience')).toEqual(mockedDeclaredActivityAssociations.declaredExperienceAssociations[index].declaredExperience)
      })
    })
  })

  BddTest().when('the header slot is provided', () => {
    beforeEach(() => {
      mockLimits({ [AssociationContextType.TRACE]: 6 })
      mountWith(declaredActivityProps, headerSlot)
    })

    BddTest().then('it should expose getLimit to the header slot', () => {
      expect(getHeaderLimit().text()).toBe('true|6')
    })
  })

  BddTest().when('limits are provided by the composable', () => {
    beforeEach(() => {
      mockLimits({
        [AssociationContextType.TRACE]: 6,
        [AssociationContextType.DECLARED_EXPERIENCE]: 0
      })
      mountWith(declaredActivityProps)
    })

    BddTest().then('it should use the limit in the associated card title', () => {
      const cards = getCards()

      expect(cards.find(card => card.attributes('data-testid') === 'associated-traces-card')?.props('title'))
        .toBe('Mes traces associées (6/6)')

      expect(cards.find(card => card.attributes('data-testid') === 'associated-declared-experiences-card'))
        .toBeUndefined()
    })
  })

  BddTest().when('there are no associations', () => {
    beforeEach(() => {
      mountWith({
        ...declaredActivityProps,
        associations: mockedEmptyAssociations
      })
    })

    BddTest().then('it should mark the suspense as empty and render no association card', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isEmpty')).toBe(true)
      expect(getCards()).toHaveLength(0)
      itemCardStubs.forEach(stub => expect(wrapper.findAllComponents(stub)).toHaveLength(0))
    })
  })

  BddTest().when('the associations are loading', () => {
    beforeEach(() => {
      mountWith({
        ...declaredActivityProps,
        associations: undefined,
        isLoading: true
      })
    })

    BddTest().then('it should display the loading state', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(true)
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
      mountWith({
        ...declaredActivityProps,
        associations: undefined,
        error
      })
    })

    BddTest().then('it should display the error of the context type', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('error')).toEqual(error)
      expect(querySuspense.props('errorTitle')).toBe(DECLARED_ACTIVITY_FETCH_ERROR_TITLE)
    })
  })

  BddTest().when('the associations of a trace are displayed', () => {
    beforeEach(() => {
      mountWith(traceProps)
    })

    BddTest().then('it should render the associated declared program cards', () => {
      const card = getCards().find(
        card => card.attributes('data-testid') === 'associated-declared-programs-card'
      )

      expect(card).toBeDefined()
      expect(card?.props('title')).toBe('Mes formations déclarées associées (2)')
      expectItemCards(AssociatedDeclaredProgramCardStub, 2)

      wrapper.findAllComponents(AssociatedDeclaredProgramCardStub).forEach((itemCard, index) => {
        expect(itemCard.props('declaredProgram')).toEqual(mockedTraceAssociations.declaredProgramAssociations[index].declaredProgram)
      })
    })
  })

  BddTest().when('the associations of a declared program are displayed', () => {
    beforeEach(() => {
      mountWith(declaredProgramProps)
    })

    BddTest().then('it should render a card per context type associable with a declared program', () => {
      expect(getCards().map(card => card.attributes('data-testid'))).toEqual([
        'associated-traces-card',
        'associated-declared-activities-card',
        'associated-declared-skills-card',
        'associated-declared-experiences-card'
      ])
    })

    BddTest().then('it should render the corresponding associated elements', () => {
      expectItemCards(AssociatedTraceCardStub, mockedDeclaredProgramAssociations.traceAssociations.length)
      expectItemCards(AssociatedActivityCardStub, mockedDeclaredProgramAssociations.declaredActivityAssociations.length)
      expectItemCards(AssociatedSkillCardStub, mockedDeclaredProgramAssociations.skillProgressAssociations.length)
      expectItemCards(AssociatedDeclaredExperienceCardStub, mockedDeclaredProgramAssociations.declaredExperienceAssociations.length)
    })
  })

  BddTest().when('the associations are displayed for a declared skill', () => {
    beforeEach(() => {
      mountWith({
        ...declaredActivityProps,
        contextType: AssociationContextType.DECLARED_SKILL
      })
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-skill-associations"]').exists()).toBe(true)
    })
  })

  BddTest().when('the associations are displayed for a declared experience', () => {
    beforeEach(() => {
      mountWith({
        ...declaredActivityProps,
        contextType: AssociationContextType.DECLARED_EXPERIENCE
      })
    })

    BddTest().then('it should render the component with the test id of the context type', () => {
      expect(wrapper.find('[data-testid="declared-experience-associations"]').exists()).toBe(true)
    })
  })

  BddTest().when('the associations of a declared activity are displayed with all association types', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      traceAssociations: createMockedTraceAssociations(2),
      declaredActivityAssociations: createMockedDeclaredActivityAssociations(3),
      skillProgressAssociations: createMockedDeclaredSkillAssociations(2),
      declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(2),
      declaredProgramAssociations: createMockedDeclaredProgramAssociations(2)
    }

    beforeEach(() => {
      mountWith({
        ...declaredActivityProps,
        associations
      })
    })

    BddTest().then('it should render all associated cards with their corresponding icons', () => {
      const cards = getCards()

      expect(cards).toHaveLength(4)
      expect(cards.map(card => card.props('icon'))).toEqual([
        ICONS.TRACES,
        ICONS.SKILLS,
        ICONS.EXPERIENCES,
        ICONS.DECLARED_PROGRAMS
      ])
    })

    BddTest().then('it should render the correct number of each associated element card', () => {
      expectItemCards(AssociatedTraceCardStub, 2)
      expectItemCards(AssociatedSkillCardStub, 2)
      expectItemCards(AssociatedDeclaredExperienceCardStub, 2)
      expectItemCards(AssociatedDeclaredProgramCardStub, 2)
    })
  })
})
