import type { VueWrapper } from '@vue/test-utils'
import { type DeclaredSkillAssociationDTO, EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
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

}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>
  const traceId = '123e4567-e89b-12d3-a456-426614174000'
  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      const associationsProps = { declaredActivityAssociations: [], declaredSkillAssociations: [] }
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

    BddTest().then('it should not render any association cards', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards).toHaveLength(0)
    })

    BddTest().then('it should render the delete trace associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      // TODO: #1155 - test that dropdown has correct props for disabled state once implemented
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
    const declaredSkillAssociations: DeclaredSkillAssociationDTO[] = [
      {
        id: 'declared-1',
        title: 'Compétence complémentaire 1',
        level: EDeclaredSkillLevel.BEGINNER,
        pathSegments: [],
        type: EExternalSkillType.ROME4
      }
    ]

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
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to declared skill card', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards[0].props('declaredSkill')).toEqual(declaredSkillAssociations[0])
    })
  })
})
