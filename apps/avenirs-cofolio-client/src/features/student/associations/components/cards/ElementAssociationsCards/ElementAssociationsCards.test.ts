import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { AssociationsDTO } from '@/api/avenir-esr'
import type { ElementAssociationsCardsProps } from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS, QuerySuspenseStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  createMockedDeclaredActivityAssociations,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredProgramAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedDeclaredActivityAssociations,
  mockedEmptyAssociations,
  mockedTraceAssociations,
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociatedActivityCardStub } from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociatedDeclaredExperienceCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.stub'
import { AssociatedDeclaredProgramCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.stub'
import { AssociatedSkillCardStub } from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import { AssociatedTraceCardStub } from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.stub'
import { AssociationsCardStub } from '@/features/student/associations/components/cards/AssociationsCard/AssociationsCard.stub'
import ElementAssociationsCards from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { getContextTypeSlug, } from '@/features/student/associations/utils/associations.utils'

vi.mock('@/features/student/associations/composables/use-association-limit/use-association-limit', () => ({
  useAssociationLimits: vi.fn()
}))

BddTest().given('an element associations component', () => {
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

  const itemCardStubs = [
    AssociatedTraceCardStub,
    AssociatedActivityCardStub,
    AssociatedSkillCardStub,
    AssociatedDeclaredExperienceCardStub,
    AssociatedDeclaredProgramCardStub
  ]

  const traceProps: ElementAssociationsCardsProps = {
    contextType: EAssociationContextType.TRACE,
    elementId: 'trace-1',
    associations: mockedTraceAssociations
  }

  const getCards = () => wrapper.findAllComponents(AssociationsCardStub)
  const getCard = () => wrapper.findComponent(AssociationsCardStub)

  const findCardFor = (target: EAssociationContextType) =>
    getCards().find(
      card => card.attributes('data-testid')
        === `associated-${getContextTypeSlug(target, true)}-card`
    )!

  type MountingOptions = ComponentMountingOptions<typeof ElementAssociationsCards>

  const defaultProps: MountingOptions['props'] = {
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: mockedDeclaredActivityDetails.id,
    associations: mockedDeclaredActivityAssociations
  }

  const headerSlot = {
    header: `<template #header="{ getLimit }">
      <div data-testid="header-limit">{{ getLimit('${EAssociationContextType.TRACE}').isLoaded }}|{{ getLimit('${EAssociationContextType.TRACE}').max }}
      </div>
      </template>`
  }

  const getHeaderLimit = () => wrapper.find('[data-testid="header-limit"]')

  const mockLimits = (limitsByType: Partial<Record<EAssociationContextType, number>> = {}, isLoaded = true) => {
    vi.mocked(useAssociationLimits).mockReturnValue({
      getLimit: (type: EAssociationContextType) => ({
        isLoaded,
        max: limitsByType[type],
        remaining: limitsByType[type]
      }),
    } as unknown as ReturnType<typeof useAssociationLimits>)
  }

  const mountWith = (
    props: ElementAssociationsCardsProps,
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

  const elementContextTypeFor: Record<EAssociationContextType, EAssociationContextType> = {
    [EAssociationContextType.TRACE]: EAssociationContextType.DECLARED_ACTIVITY,
    [EAssociationContextType.DECLARED_ACTIVITY]: EAssociationContextType.TRACE,
    [EAssociationContextType.DECLARED_SKILL]: EAssociationContextType.TRACE,
    [EAssociationContextType.DECLARED_EXPERIENCE]: EAssociationContextType.TRACE,
    [EAssociationContextType.DECLARED_PROGRAM]: EAssociationContextType.TRACE
  }

  const mountSingle = (
    associatedContextType: EAssociationContextType,
    overrides: Partial<AssociationsDTO>,
    limit?: number
  ) => {
    if (limit !== undefined) {
      mockLimits({ [associatedContextType]: limit })
    }
    mountWith({
      contextType: elementContextTypeFor[associatedContextType],
      elementId: 'element-1',
      associations: { ...mockedEmptyAssociations, ...overrides }
    })
  }

  beforeEach(() => {
    mockLimits()
  })

  function expectOnlyItemCards (itemCardStub: typeof itemCardStubs[number], count: number) {
    itemCardStubs.forEach((stub) => {
      expect(wrapper.findAllComponents(stub)).toHaveLength(stub === itemCardStub ? count : 0)
    })
  }

  BddTest().when('there is no association of the given context type', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.TRACE, { traceAssociations: [] })
    })

    BddTest().then('it should not render any card', () => {
      expect(getCards()).toHaveLength(0)
      itemCardStubs.forEach(stub => expect(wrapper.findComponent(stub).exists()).toBe(false))
    })
  })

  BddTest().when('there are trace associations', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.TRACE, { traceAssociations: createMockedTraceAssociations(2) })
    })

    BddTest().then('it should render the card with the trace icon and test id', () => {
      expect(getCard().props('icon')).toBe(ICONS.TRACES)
      expect(getCard().attributes('data-testid')).toBe('associated-traces-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      expect(getCard().props('title')).toBe('Mes traces associées (2)')
    })

    BddTest().then('it should render an enabled trace card per trace association only', () => {
      expectOnlyItemCards(AssociatedTraceCardStub, 2)
      wrapper
        .findAllComponents(AssociatedTraceCardStub)
        .forEach((card) => {
          expect(card.props('disabled')).toBe(false)
        })
    })
  })

  BddTest().when(' there is a single trace association', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.TRACE, { traceAssociations: createMockedTraceAssociations(1) })
    })
    BddTest().then('it should display the singular title', () => {
      expect(getCard().props('title')).toBe('Ma trace associée (1)')
    })
  })

  BddTest().when('there are trace associations and a limit', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.TRACE, { traceAssociations: createMockedTraceAssociations(2) }, 5)
    })

    BddTest().then('it should display the title with the count and the limit', () => {
      expect(getCard().props('title')).toBe('Mes traces associées (2/5)')
    })
  })

  BddTest().when('there are declared activity associations', () => {
    beforeEach(() => {
      mountSingle(
        EAssociationContextType.DECLARED_ACTIVITY,
        { declaredActivityAssociations: createMockedDeclaredActivityAssociations(3) },
        4
      )
    })

    BddTest().then('it should render the card with the activity icon and test id', () => {
      expect(getCard().props('icon')).toBe(ICONS.ACTIVITY)
      expect(getCard().attributes('data-testid')).toBe('associated-declared-activities-card')
    })

    BddTest().then('it should render an activity card per declared activity association only', () => {
      expectOnlyItemCards(AssociatedActivityCardStub, 3)
    })
  })

  BddTest().when('there are declared skill associations', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.DECLARED_SKILL, { skillProgressAssociations: createMockedDeclaredSkillAssociations(2) })
    })

    BddTest().then('it should render the card with the skill icon and test id', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_SKILL)
      expect(card.props('icon')).toBe(ICONS.SKILLS)
      expect(card.attributes('data-testid')).toBe('associated-declared-skills-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_SKILL)
      expect(card.props('title')).toBe('Mes compétences associées (2)')
    })

    BddTest().then('it should render a skill card per declared skill association only', () => {
      expectOnlyItemCards(AssociatedSkillCardStub, 2)
    })
  })

  BddTest().when('there is a single declared skill association', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.DECLARED_SKILL, { skillProgressAssociations: createMockedDeclaredSkillAssociations(1) }, 3)
    })

    BddTest().then('it should display the singular title with the limit', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_SKILL)
      expect(card.props('title')).toBe('Ma compétence associée (1/3)')
    })
  })

  BddTest().when('there are declared experience associations', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.DECLARED_EXPERIENCE, { declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(2) })
    })

    BddTest().then('it should render the card with the experience icon and test id', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_EXPERIENCE)
      expect(card.props('icon')).toBe(ICONS.EXPERIENCES)
      expect(card.attributes('data-testid')).toBe('associated-declared-experiences-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_EXPERIENCE)
      expect(card.props('title')).toBe('Mes expériences déclarées associées (2)')
    })

    BddTest().then('it should render an experience card per declared experience association only', () => {
      expectOnlyItemCards(AssociatedDeclaredExperienceCardStub, 2)
    })
  })

  BddTest().when('there are declared program associations', () => {
    beforeEach(() => {
      mountSingle(EAssociationContextType.DECLARED_PROGRAM, { declaredProgramAssociations: createMockedDeclaredProgramAssociations(2) })
    })

    BddTest().then('it should render the card with the declared program icon and test id', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_PROGRAM)
      expect(card.props('icon')).toBe(ICONS.DECLARED_PROGRAMS)
      expect(card.attributes('data-testid')).toBe('associated-declared-programs-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      const card = findCardFor(EAssociationContextType.DECLARED_PROGRAM)
      expect(card.props('title')).toBe('Mes formations déclarées associées (2)')
    })

    BddTest().then('it should render a declared program card per declared program association only', () => {
      expectOnlyItemCards(AssociatedDeclaredProgramCardStub, 2)
    })
  })

  BddTest().when('a header slot is provided', () => {
    beforeEach(() => {
      mockLimits({ [EAssociationContextType.TRACE]: 5 })
      mountWith(traceProps, headerSlot)
    })

    BddTest().then('it should expose getLimit to the header slot', () => {
      expect(getHeaderLimit().text()).toContain('true|5')
    })
  })
})
