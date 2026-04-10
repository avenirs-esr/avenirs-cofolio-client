import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { mockedTraceDeclaredActivityAssociations, mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { AssociatedDeclaredActivitiesCardStub } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.stub'
import { AssociatedTracesCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockedAssociatedTraces: TraceAssociationDTO[] = mockedTraceOverview.map((trace, i) => ({
  associationId: `skill-trace-assoc-${i + 1}`,
  trace
}))

const stubs = {
  AssociatedTracesCard: AssociatedTracesCardStub,
  AssociatedDeclaredActivitiesCard: AssociatedDeclaredActivitiesCardStub
}

BddTest().given('a student declared skill associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillAssociations>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is rendered with associations', () => {
    beforeEach(() => {
      wrapper = mount(StudentDeclaredSkillAssociations, {
        props: {
          associatedTraces: mockedAssociatedTraces,
          associatedDeclaredActivities: mockedTraceDeclaredActivityAssociations
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-skill-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should pass associatedTraces prop to AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.props('associatedTraces')).toEqual(mockedAssociatedTraces)
    })

    BddTest().then('it should render AssociatedDeclaredActivitiesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should pass associatedDeclaredActivities prop to AssociatedDeclaredActivitiesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(card.props('associatedActivities')).toEqual(mockedTraceDeclaredActivityAssociations)
    })
  })

  BddTest().when('the component is rendered with empty associations', () => {
    beforeEach(() => {
      wrapper = mount(StudentDeclaredSkillAssociations, {
        props: {
          associatedTraces: [],
          associatedDeclaredActivities: []
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-skill-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should pass empty arrays to AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.props('associatedTraces')).toEqual([])
    })

    BddTest().then('it should pass empty arrays to AssociatedDeclaredActivitiesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(card.props('associatedActivities')).toEqual([])
    })
  })
})
