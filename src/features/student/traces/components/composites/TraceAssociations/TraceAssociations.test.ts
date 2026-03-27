import type { VueWrapper } from '@vue/test-utils'
import {
  mockedEmptyTraceAssociations,
  mockedTraceDeclaredActivityAssociations,
  mockedTraceDeclaredSkillAssociations
} from '@/__mocks__/fixtures/student'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociatedSkillCardStub } from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import TraceAssociations
  from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { DeleteTraceAssociatedElementsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.stub'
import { DeleteTraceAssociatedActivitiesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.stub'
import { DeleteTraceAssociatedSkillsModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  StudentTraceDeclaredSkillAssociationCard: {
    name: 'StudentTraceDeclaredSkillAssociationCard',
    template: '<div class="student-trace-declared-skill-association-card" />',
    props: {
      declaredSkill: Object
    }
  },
  DeleteTraceAssociatedElementsDropdown: DeleteTraceAssociatedElementsDropdownStub,
  DeleteTraceAssociatedSkillsModal: DeleteTraceAssociatedSkillsModalStub,
  DeleteTraceAssociatedActivitiesModal: DeleteTraceAssociatedActivitiesModalStub,
  AssociatedSkillCard: AssociatedSkillCardStub,
  AssociatedActivityCard: AssociatedActivityCardStub,

}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>
  const traceId = '123e4567-e89b-12d3-a456-426614174000'
  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: mockedEmptyTraceAssociations,
          traceId
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render any association cards', () => {
      const declaredSkillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)

      expect(declaredSkillCards).toHaveLength(0)
      expect(declaredActivityCards).toHaveLength(0)
    })

    BddTest().then('it should render the delete trace associated elements dropdown with disabled items', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props().skillsDisabled).toBe(true)
      expect(dropdown.props().activitiesDisabled).toBe(true)
    })

    BddTest().then('it should render the delete trace associated skills modal', () => {
      const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
      expect(skillsModal.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated activities modal', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
      expect(activitiesModal.exists()).toBe(true)
    })

    BddTest().and('the delete trace associated elements dropdown emits skillsSelected', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the delete trace associated skills modal should be shown', () => {
        const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
        expect(skillsModal.props('show')).toBe(true)
      })
    })

    BddTest().and('the delete trace associated elements dropdown emits activitiesSelected', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
        dropdown.vm.$emit('activitiesSelected')
      })

      BddTest().then('the delete trace associated activities modal should be shown', () => {
        const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
        expect(activitiesModal.props('show')).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted with only declared skill associations', () => {
    const declaredSkillAssociations = mockedTraceDeclaredSkillAssociations

    const associationsProps = { declaredActivityAssociations: [], declaredSkillAssociations }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render 1 declared skill association card', () => {
      const declaredSkillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      expect(declaredSkillCards).toHaveLength(3)
    })

    BddTest().then('it should pass correct props to declared skill card', () => {
      const declaredSkillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      expect(declaredSkillCards[0].props('declaredSkill')).toEqual(declaredSkillAssociations[0].declaredSkill)
    })

    BddTest().then('it should not render skill associations container', () => {
      const activityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      const skillContainer = wrapper.find('[data-testid="declared-skill-associations-container"]')

      expect(activityContainer.exists()).toBe(false)
      expect(skillContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props().skillsDisabled).toBe(false)
      expect(dropdown.props().activitiesDisabled).toBe(true)
    })
  })

  BddTest().when('the component is mounted with only declared activity associations', () => {
    const declaredActivityAssociations = mockedTraceDeclaredActivityAssociations

    const associationsProps = { declaredActivityAssociations, declaredSkillAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render 1 declared activity association card', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards).toHaveLength(2)
    })

    BddTest().then('it should not render skill associations container', () => {
      const activityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      const skillContainer = wrapper.find('[data-testid="declared-skill-associations-container"]')

      expect(activityContainer.exists()).toBe(true)
      expect(skillContainer.exists()).toBe(false)
    })

    BddTest().then('it should pass correct props to declared activity card', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards[0].props('declaredActivity')).toEqual(declaredActivityAssociations[0].declaredActivity)
    })

    BddTest().then('it should render the delete trace associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props().skillsDisabled).toBe(true)
      expect(dropdown.props().activitiesDisabled).toBe(false)
    })
  })
})
