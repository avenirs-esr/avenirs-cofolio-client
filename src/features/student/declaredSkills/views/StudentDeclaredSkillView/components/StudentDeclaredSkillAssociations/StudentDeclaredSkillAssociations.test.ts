import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { mockedTraceDeclaredActivityAssociations, mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { AssociatedDeclaredActivitiesCardStub } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.stub'
import { AssociatedTracesCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
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

    BddTest().then('it should render the declared skill associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeclaredSkillAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the associate activities modal hidden by default', () => {
      const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('declaredSkillId')).toBe(declaredSkillId)
    })

    BddTest().then('it should not render associated activity cards', () => {
      const cards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(cards).toHaveLength(0)
    })

    BddTest().then('it should not render the declared activity associations container', () => {
      const container = wrapper.find('[data-testid="declared-activity-associations-container"]')
      expect(container.exists()).toBe(false)
    })

    BddTest().and('the dropdown emits activitiesSelected', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeclaredSkillAssociateElementsDropdownStub)
        dropdown.vm.$emit('activitiesSelected')
      })

      BddTest().then('the associate activities modal should be shown', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('the associate activities modal emits cancel', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeclaredSkillAssociateElementsDropdownStub)
        dropdown.vm.$emit('activitiesSelected')

        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        modal.vm.$emit('cancel')
      })

      BddTest().then('the associate activities modal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('the associate activities modal emits associated', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeclaredSkillAssociateElementsDropdownStub)
        dropdown.vm.$emit('activitiesSelected')

        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        modal.vm.$emit('associated')
      })

      BddTest().then('the associate activities modal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(false)
      })

      BddTest().then('it should emit associated', () => {
        expect(wrapper.emitted('associated')).toBeTruthy()
        expect(wrapper.emitted('associated')).toHaveLength(1)
      })
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

  BddTest().when('the component is rendered with declared activity associations', () => {
    const associations = createDeclaredSkillAssociationResponseFixture({
      idsToAssociate: ['activity-search-1', 'activity-search-2']
    })

    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations,
          associations
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the declared activity associations container', () => {
      const container = wrapper.find('[data-testid="declared-activity-associations-container"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the correct number of associated activity cards', () => {
      const cards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(cards).toHaveLength(2)
    })

    BddTest().then('it should pass the correct props to associated activity cards', () => {
      const cards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(cards[0].props('declaredActivity')).toEqual(
        associations.declaredActivityAssociations[0].declaredActivity
      )
      expect(cards[1].props('declaredActivity')).toEqual(
        associations.declaredActivityAssociations[1].declaredActivity
      )
    })
  })
})
