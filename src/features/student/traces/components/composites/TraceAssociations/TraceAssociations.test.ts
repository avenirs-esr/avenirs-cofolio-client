import type { VueWrapper } from '@vue/test-utils'
import {
  mockedEmptyTraceAssociations,
  mockedTraceDeclaredActivityAssociations,
  mockedTraceDeclaredSkillAssociations
} from '@/__mocks__/fixtures/student'
import { type DeclaredActivityAssociationDTO, EActivityThematic, EDeclaredActivityStatus, type TraceAssociationsDTO } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AssociatedDeclaredActivitiesCard } from '@/features/student/buildProject'
import { AssociatedDeclaredSkillsCardStub } from '@/features/student/declaredSkills/components/cards/AssociatedDeclaredSkillsCard/AssociatedDeclaredSkillsCard.stub'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import TraceAssociations
  from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { DeleteTraceAssociatedElementsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.stub'
import { TraceAssociateElementsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.stub'
import {
  AssociateActivitiesToTracesModalStub
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesToTracesModal/AssociateActivitiesToTracesModal.stub'
import { AssociateDeclaredExperiencesToTracesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredExperiencesToTracesModal/AssociateDeclaredExperiencesToTracesModal.stub'
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
  AssociateDeclaredExperiencesToTracesModal: AssociateDeclaredExperiencesToTracesModalStub,
  AssociateActivitiesToTracesModal: AssociateActivitiesToTracesModalStub,
  AssociatedDeclaredSkillsCard: AssociatedDeclaredSkillsCardStub,
  AssociatedActivityCard: AssociatedActivityCardStub,
  QuerySuspense: QuerySuspenseStub,
}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>
  const traceId = '123e4567-e89b-12d3-a456-426614174000'

  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: mockedEmptyTraceAssociations,
          traceId,
          countAssociations: 0,
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(true)
    })

    BddTest().then('it should render no associated activity cards', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards).toHaveLength(0)
    })

    BddTest().then('it should not render the associated declared skills card', () => {
      const declaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(declaredSkillsCard.exists()).toBe(false)
    })

    BddTest().then('it should not render the declared activity associations container', () => {
      const declaredActivityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      expect(declaredActivityContainer.exists()).toBe(false)
    })

    BddTest().then('it should render the delete trace associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteTraceAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated skills modal', () => {
      const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
      expect(skillsModal.exists()).toBe(true)
      expect(skillsModal.props('show')).toBe(false)
      expect(skillsModal.props('traceId')).toBe(traceId)
      expect(skillsModal.props('associations')).toEqual([])
    })

    BddTest().then('it should render the delete trace associated activities modal', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
      expect(activitiesModal.exists()).toBe(true)
      expect(activitiesModal.props('show')).toBe(false)
      expect(activitiesModal.props('traceId')).toBe(traceId)
      expect(activitiesModal.props('associations')).toEqual([])
    })

    BddTest().then('it should render the associate declared skills modal', () => {
      const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
      expect(associateDeclaredSkillsModal.exists()).toBe(true)
      expect(associateDeclaredSkillsModal.props('show')).toBe(false)
    })

    BddTest().then('it should render the associate activities modal', () => {
      const associateActivitiesModal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
      expect(associateActivitiesModal.exists()).toBe(true)
      expect(associateActivitiesModal.props('show')).toBe(false)
      expect(associateActivitiesModal.props('traceId')).toBe(traceId)
    })

    BddTest().then('it should render the associate experiences modal', () => {
      const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('traceId')).toBe(traceId)
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

      BddTest().then('the AssociateActivitiesToTracesModal should be shown', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('AssociateActivitiesToTracesModal emits cancel', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('activitiesSelected')
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        await modal.vm.$emit('cancel')
      })

      BddTest().then('the AssociateActivitiesToTracesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('AssociateActivitiesToTracesModal emits associated', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('activitiesSelected')
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        await modal.vm.$emit('associated')
      })

      BddTest().then('the AssociateActivitiesToTracesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('TraceAssociateElementsDropdown emits experiencesSelected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('experiencesSelected')
      })

      BddTest().then('the AssociateDeclaredExperiencesToTracesModal should be shown', () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('AssociateDeclaredExperiencesToTracesModal emits cancel', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('experiencesSelected')
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
        await modal.vm.$emit('cancel')
      })

      BddTest().then('the AssociateDeclaredExperiencesToTracesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('AssociateDeclaredExperiencesToTracesModal emits associated', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(TraceAssociateElementsDropdownStub)
        await dropdown.vm.$emit('experiencesSelected')
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
        await modal.vm.$emit('associated')
      })

      BddTest().then('the AssociateDeclaredExperiencesToTracesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
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
          traceId,
          countAssociations: declaredSkillAssociations.length
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should render the associated declared skills card with the correct associations', () => {
      const declaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(declaredSkillsCard.exists()).toBe(true)
      expect(declaredSkillsCard.props('associatedDeclaredSkills')).toEqual(declaredSkillAssociations)
    })

    BddTest().then('it should not render the declared activity associations container', () => {
      const activityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      expect(activityContainer.exists()).toBe(false)
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

    BddTest().then('it should pass declared skill associations to the delete skills modal', () => {
      const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
      expect(skillsModal.props('associations')).toEqual(declaredSkillAssociations)
      expect(skillsModal.props('traceId')).toBe(traceId)
    })
  })

  BddTest().when('the component is mounted with only declared activity associations', () => {
    const declaredActivityAssociations: DeclaredActivityAssociationDTO[] = [
      ...mockedTraceDeclaredActivityAssociations,
      {
        associationId: '8cb6cff4-2419-4b22-8c44-a92022a2423a',
        declaredActivity: {
          id: 'c1c9f6d2-6c2b-4a5e-9c4f-8e2a6b1d3f01',
          activityId: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
          title: 'Renforcer sa capacité d’adaptation',
          thematic: EActivityThematic.RESUMES,
          summary: 'Activité visant à analyser sa capacité à s’adapter à des contextes variés et à gérer les changements. L’étudiant.e identifie des situations concrètes illustrant sa flexibilité et sa résilience.',
          description: '<h3>Objectifs</h3><ul><li>Analyser sa capacité à s’adapter à des contextes variés et à gérer les changements</li><li>Identifier des situations concrètes illustrant sa flexibilité et sa résilience</li><li>Utiliser cette analyse pour renforcer sa capacité d’adaptation dans son projet professionnel</li></ul>',
          executionPeriodInfoSummary: 'Avant entretien professionnel',
          status: EDeclaredActivityStatus.COMPLETED,
          startDate: '2027-01-10',
          endDate: '2027-01-20',
          updatedAt: '2026-03-30T15:43:46.438115Z'
        }
      }
    ]
    const associationsProps: TraceAssociationsDTO = { declaredActivityAssociations, declaredSkillAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId,
          countAssociations: declaredActivityAssociations.length
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should render the associated declared skills card with empty associations', () => {
      const declaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(declaredSkillsCard.exists()).toBe(true)
      expect(declaredSkillsCard.props('associatedDeclaredSkills')).toEqual([])
    })

    BddTest().then('it should render 3 declared activity association cards', () => {
      const declaredActivityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(declaredActivityCards).toHaveLength(3)
    })

    BddTest().then('it should render only the declared activity associations container', () => {
      const activityContainer = wrapper.findComponent(AssociatedDeclaredActivitiesCard)
      expect(activityContainer.exists()).toBe(true)
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

    BddTest().then('it should pass only deletable declared activity associations to the delete activities modal', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)
      const expectedAssociations = declaredActivityAssociations.filter(
        association => association.declaredActivity.status !== EDeclaredActivityStatus.COMPLETED
      )

      expect(activitiesModal.props('associations')).toEqual(expectedAssociations)
      expect(activitiesModal.props('traceId')).toBe(traceId)
    })
  })
})
