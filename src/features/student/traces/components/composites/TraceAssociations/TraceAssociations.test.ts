import type { VueWrapper } from '@vue/test-utils'
import {
  mockedEmptyTraceAssociations,
  mockedTraceDeclaredActivityAssociations,
  mockedTraceDeclaredSkillAssociations
} from '@/__mocks__/fixtures/student'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociatedSkillCardStub } from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import TraceAssociations
  from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { DeleteTraceAssociatedElementsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.stub'
import { TraceAssociateElementsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.stub'
import { AssociateActivitiesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.stub'
import { AssociateDeclaredSkillsToTracesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.stub'
import { DeleteTraceAssociatedActivitiesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.stub'
import { DeleteTraceAssociatedSkillsModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  DeleteTraceAssociatedElementsDropdown: DeleteTraceAssociatedElementsDropdownStub,
  TraceAssociateElementsDropdown: TraceAssociateElementsDropdownStub,
  DeleteTraceAssociatedSkillsModal: DeleteTraceAssociatedSkillsModalStub,
  DeleteTraceAssociatedActivitiesModal: DeleteTraceAssociatedActivitiesModalStub,
  AssociateDeclaredSkillsToTracesModal: AssociateDeclaredSkillsToTracesModalStub,
  AssociateActivitiesModal: AssociateActivitiesModalStub,
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

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated skills modal', () => {
      const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
      expect(skillsModal.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated activities modal', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
      expect(activitiesModal.exists()).toBe(true)
    })

    BddTest().then('it should render the associate declared skills modal', () => {
      const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
      expect(associateDeclaredSkillsModal.exists()).toBe(true)
      expect(associateDeclaredSkillsModal.props('show')).toBe(false)
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

    BddTest().and('the trace associate elements dropdown emits skillsSelected', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the associate declared skills modal should be shown', () => {
        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)

        expect(associateDeclaredSkillsModal.props('show')).toBe(true)
      })
    })

    BddTest().and('the associate declared skills modal emits cancel', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')

        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
        associateDeclaredSkillsModal.vm.$emit('cancel')
      })

      BddTest().then('the associate declared skills modal should be hidden', () => {
        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)

        expect(associateDeclaredSkillsModal.props('show')).toBe(false)
      })
    })

    BddTest().and('the associate declared skills modal emits associated', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')

        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
        associateDeclaredSkillsModal.vm.$emit('associated')
      })

      BddTest().then('the associate declared skills modal should be hidden', () => {
        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)

        expect(associateDeclaredSkillsModal.props('show')).toBe(false)
      })
    })

    BddTest().and('TraceAssociateElementsDropdown emits activitiesSelected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('activitiesSelected')
      })

      BddTest().then('the AssociateActivitiesModal should be shown', () => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('AssociateActivitiesModal emits cancel', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('activitiesSelected')
        const modal = wrapper.findComponent(AssociateActivitiesModalStub)
        await modal.vm.$emit('cancel')
      })

      BddTest().then('the AssociateActivitiesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('AssociateActivitiesModal emits associated', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('activitiesSelected')
        const modal = wrapper.findComponent(AssociateActivitiesModalStub)
        await modal.vm.$emit('associated')
      })

      BddTest().then('the AssociateActivitiesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub)
        expect(modal.props('show')).toBe(false)
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

    BddTest().then('it should render 3 declared skill association card', () => {
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

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with only declared activity associations', () => {
    const declaredActivityAssociations = [
      ...mockedTraceDeclaredActivityAssociations,
      {
        associationId: '8cb6cff4-2419-4b22-8c44-a92022a2423a',
        declaredActivity: {
          id: 'c1c9f6d2-6c2b-4a5e-9c4f-8e2a6b1d3f01',
          activityId: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
          title: 'Renforcer sa capacité d’adaptation',
          thematic: EActivityThematic.RESUMES,
          summary: 'Activité visant à analyser sa capacité à s’adapter à des contextes variés et à gérer les changements. L’étudiant.e identifie des situations concrètes illustrant sa flexibilité et sa résilience.',
          executionPeriodInfoSummary: 'Avant entretien professionnel',
          status: EDeclaredActivityStatus.COMPLETED,
          startDate: '2027-01-10',
          endDate: '2027-01-20',
          updatedAt: '2026-03-30T15:43:46.438115Z'
        }
      }
    ]
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

    BddTest().then('it should render 3 declared activity association cards', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards).toHaveLength(3)
    })

    BddTest().then('it should render only the declared activity associations container', () => {
      const activityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      const skillContainer = wrapper.find('[data-testid="declared-skill-associations-container"]')

      expect(activityContainer.exists()).toBe(true)
      expect(skillContainer.exists()).toBe(false)
    })

    BddTest().then('it should pass correct props to declared activity card', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards[0].props('declaredActivity')).toEqual(declaredActivityAssociations[0].declaredActivity)
    })

    BddTest().then('it should render the delete trace associated elements dropdown with correct disabled state', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props().skillsDisabled).toBe(true)
      expect(dropdown.props().activitiesDisabled).toBe(false)
    })

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should pass declared activity associations to the delete activities modal', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
      const expectedAssociations = declaredActivityAssociations.filter(association => association.declaredActivity.status !== EDeclaredActivityStatus.COMPLETED)
      expect(activitiesModal.props('associations')).toEqual(expectedAssociations)
      expect(activitiesModal.props('traceId')).toBe(traceId)
    })
  })
})
