import {
  createMockedDeclaredActivityAssociations,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredProgramAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedEmptyAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { type AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { AssociatedActivityCardStub } from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociatedDeclaredExperienceCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.stub'
import { AssociatedDeclaredProgramCardStub } from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.stub'
import AssociatedElementsCard, {
  type AssociatedElementsCardProps
} from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.vue'
import { AssociatedSkillCardStub } from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import { AssociatedTraceCardStub } from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.stub'
import { AssociationsCardStub } from '@/features/student/associations/components/cards/AssociationsCard/AssociationsCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
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

const associations: AssociationsDTO = {
  traceAssociations: createMockedTraceAssociations(2),
  declaredActivityAssociations: createMockedDeclaredActivityAssociations(3),
  declaredSkillAssociations: createMockedDeclaredSkillAssociations(2),
  declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(2),
  declaredProgramAssociations: createMockedDeclaredProgramAssociations(2)
}

function mountCard (props: AssociatedElementsCardProps) {
  return mountComponent(AssociatedElementsCard, { props, global: { stubs } })
}

BddTest().given('an associated elements card', () => {
  let wrapper: ReturnType<typeof mountCard>

  const findCard = () => wrapper.findComponent(AssociationsCardStub)

  function expectOnlyItemCards (itemCardStub: typeof itemCardStubs[number], count: number) {
    itemCardStubs.forEach((stub) => {
      expect(wrapper.findAllComponents(stub)).toHaveLength(stub === itemCardStub ? count : 0)
    })
  }

  BddTest().when('there is no association of the given context type', () => {
    beforeEach(() => {
      wrapper = mountCard({
        associatedContextType: EAssociationContextType.TRACE,
        associations: { ...associations, traceAssociations: [] }
      })
    })

    BddTest().then('it should not render anything', () => {
      expect(findCard().exists()).toBe(false)
      itemCardStubs.forEach(stub => expect(wrapper.findComponent(stub).exists()).toBe(false))
    })
  })

  BddTest().when('there are trace associations', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.TRACE, associations })
    })

    BddTest().then('it should render the card with the trace icon and test id', () => {
      expect(findCard().props('icon')).toBe(ICONS.TRACES)
      expect(findCard().attributes('data-testid')).toBe('associated-traces-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      expect(findCard().props('title')).toBe('Mes traces associées (2)')
    })

    BddTest().then('it should render an enabled trace card per trace association only', () => {
      expectOnlyItemCards(AssociatedTraceCardStub, 2)

      wrapper.findAllComponents(AssociatedTraceCardStub).forEach((card, index) => {
        expect(card.props('associatedTrace')).toEqual(associations.traceAssociations[index])
        expect(card.props('disabled')).toBe(false)
      })
    })
  })

  BddTest().when('there is a single trace association', () => {
    beforeEach(() => {
      wrapper = mountCard({
        associatedContextType: EAssociationContextType.TRACE,
        associations: { ...mockedEmptyAssociations, traceAssociations: createMockedTraceAssociations(1) }
      })
    })

    BddTest().then('it should display the singular title', () => {
      expect(findCard().props('title')).toBe('Ma trace associée (1)')
    })
  })

  BddTest().when('there are trace associations and a limit', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.TRACE, associations, limit: 5 })
    })

    BddTest().then('it should display the title with the count and the limit', () => {
      expect(findCard().props('title')).toBe('Mes traces associées (2/5)')
    })
  })

  BddTest().when('there are trace associations and a negative limit', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.TRACE, associations, limit: -1 })
    })

    BddTest().then('it should display the title without limit', () => {
      expect(findCard().props('title')).toBe('Mes traces associées (2)')
    })
  })

  BddTest().when('there are declared activity associations', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.DECLARED_ACTIVITY, associations, limit: 4 })
    })

    BddTest().then('it should render the card with the activity icon and test id', () => {
      expect(findCard().props('icon')).toBe(ICONS.ACTIVITY)
      expect(findCard().attributes('data-testid')).toBe('associated-declared-activities-card')
    })

    BddTest().then('it should display the translated title with the count and the limit', () => {
      expect(findCard().props('title')).toBe('Mes activités déclarées associées (3/4)')
    })

    BddTest().then('it should render an activity card per declared activity association only', () => {
      expectOnlyItemCards(AssociatedActivityCardStub, 3)

      wrapper.findAllComponents(AssociatedActivityCardStub).forEach((card, index) => {
        expect(card.props('declaredActivity')).toEqual(associations.declaredActivityAssociations[index].declaredActivity)
      })
    })
  })

  BddTest().when('there are declared skill associations', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.DECLARED_SKILL, associations })
    })

    BddTest().then('it should render the card with the skill icon and test id', () => {
      expect(findCard().props('icon')).toBe(ICONS.SKILLS)
      expect(findCard().attributes('data-testid')).toBe('associated-declared-skills-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      expect(findCard().props('title')).toBe('Mes compétences associées (2)')
    })

    BddTest().then('it should render a skill card per declared skill association only', () => {
      expectOnlyItemCards(AssociatedSkillCardStub, 2)

      wrapper.findAllComponents(AssociatedSkillCardStub).forEach((card, index) => {
        expect(card.props('declaredSkill')).toEqual(associations.declaredSkillAssociations[index].declaredSkill)
      })
    })
  })

  BddTest().when('there is a single declared skill association', () => {
    beforeEach(() => {
      wrapper = mountCard({
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        associations: { ...mockedEmptyAssociations, declaredSkillAssociations: createMockedDeclaredSkillAssociations(1) },
        limit: 3
      })
    })

    BddTest().then('it should display the singular title with the limit', () => {
      expect(findCard().props('title')).toBe('Ma compétence associée (1/3)')
    })
  })

  BddTest().when('there are declared experience associations', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE, associations })
    })

    BddTest().then('it should render the card with the experience icon and test id', () => {
      expect(findCard().props('icon')).toBe(ICONS.EXPERIENCES)
      expect(findCard().attributes('data-testid')).toBe('associated-declared-experiences-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      expect(findCard().props('title')).toBe('Mes expériences déclarées associées (2)')
    })

    BddTest().then('it should render an experience card per declared experience association only', () => {
      expectOnlyItemCards(AssociatedDeclaredExperienceCardStub, 2)

      wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub).forEach((card, index) => {
        expect(card.props('declaredExperience')).toEqual(associations.declaredExperienceAssociations[index].declaredExperience)
      })
    })
  })

  BddTest().when('there are declared program associations', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.DECLARED_PROGRAM, associations })
    })

    BddTest().then('it should render the card with the declared program icon and test id', () => {
      expect(findCard().props('icon')).toBe(ICONS.DECLARED_PROGRAMS)
      expect(findCard().attributes('data-testid')).toBe('associated-declared-programs-card')
    })

    BddTest().then('it should display the translated title with the count', () => {
      expect(findCard().props('title')).toBe('Mes formations déclarées associées (2)')
    })

    BddTest().then('it should render a declared program card per declared program association only', () => {
      expectOnlyItemCards(AssociatedDeclaredProgramCardStub, 2)

      wrapper.findAllComponents(AssociatedDeclaredProgramCardStub).forEach((card, index) => {
        expect(card.props('declaredProgram')).toEqual(associations.declaredProgramAssociations[index].declaredProgram)
      })
    })
  })

  BddTest().when('the card is disabled', () => {
    beforeEach(() => {
      wrapper = mountCard({ associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE, associations, disabled: true })
    })

    BddTest().then('it should disable every associated element card', () => {
      const cards = wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub)

      expect(cards).toHaveLength(2)
      cards.forEach(card => expect(card.props('disabled')).toBe(true))
    })
  })
})
