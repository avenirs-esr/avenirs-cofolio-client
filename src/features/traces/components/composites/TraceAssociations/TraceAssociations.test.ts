import type {
  AssociationElementsDropdownVariant
} from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import {
  createMockedDeclaredExperiencesAssociations,
  mockedEmptyTraceAssociations,
  mockedTraceDeclaredActivityAssociations,
  mockedTraceDeclaredSkillAssociations
} from '@/__mocks__/fixtures/student'
import {
  type DeclaredActivityAssociationDTO,
  EActivityThematic,
  EAssociationContextType,
  EDeclaredActivityStatus,
  type TraceAssociationsDTO
} from '@/api/avenir-esr'
import { AssociationElementsDropdownStub }
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AssociatedDeclaredActivitiesCard } from '@/features/buildProject'
import { AssociatedDeclaredActivitiesCardStub } from '@/features/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.stub'
import { AssociatedDeclaredSkillsCardStub } from '@/features/declaredSkills/components/cards/AssociatedDeclaredSkillsCard/AssociatedDeclaredSkillsCard.stub'
import { AssociatedDeclaredExperiencesCardStub } from '@/features/personalCareer/components/cards/AssociatedDeclaredExperiencesCard/AssociatedDeclaredExperiencesCard.stub'
import TraceAssociations
  from '@/features/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import {
  AssociateActivitiesToTracesModalStub
} from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesToTracesModal/AssociateActivitiesToTracesModal.stub'
import { AssociateDeclaredExperiencesToTracesModalStub } from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredExperiencesToTracesModal/AssociateDeclaredExperiencesToTracesModal.stub'
import { AssociateDeclaredSkillsToTracesModalStub } from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.stub'
import { DeleteTraceAssociatedActivitiesModalStub } from '@/features/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.stub'
import { DeleteTraceAssociatedSkillsModalStub } from '@/features/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AssociatedDeclaredActivitiesCard: AssociatedDeclaredActivitiesCardStub,
  AssociationElementsDropdown: AssociationElementsDropdownStub,
  DeleteTraceAssociatedSkillsModal: DeleteTraceAssociatedSkillsModalStub,
  DeleteTraceAssociatedActivitiesModal: DeleteTraceAssociatedActivitiesModalStub,
  AssociateDeclaredSkillsToTracesModal: AssociateDeclaredSkillsToTracesModalStub,
  AssociateDeclaredExperiencesToTracesModal: AssociateDeclaredExperiencesToTracesModalStub,
  AssociateActivitiesToTracesModal: AssociateActivitiesToTracesModalStub,
  AssociatedDeclaredSkillsCard: AssociatedDeclaredSkillsCardStub,
  AssociatedDeclaredExperiencesCard: AssociatedDeclaredExperiencesCardStub,
  QuerySuspense: QuerySuspenseStub,
}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>
  const traceId = '123e4567-e89b-12d3-a456-426614174000'

  const findDropdown = (variant: AssociationElementsDropdownVariant) =>
    wrapper.findAllComponents(AssociationElementsDropdownStub)
      .filter(dropdown => dropdown.props('variant') === variant)[0]

  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: mockedEmptyTraceAssociations,
          traceId,
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
      const declaredActivityCards = wrapper.findAll('[data-testid="associated-declared-activity"]')
      expect(declaredActivityCards).toHaveLength(0)
    })

    BddTest().then('it should not render the associated declared skills card', () => {
      const declaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(declaredSkillsCard.exists()).toBe(false)
    })

    BddTest().then('it should not render the associated declared experiences card', () => {
      const declaredExperiencesCard = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(declaredExperiencesCard.exists()).toBe(false)
    })

    BddTest().then('it should not render the declared activity associations container', () => {
      const declaredActivityContainer = wrapper.find('[data-testid="declared-activity-associations-container"]')
      expect(declaredActivityContainer.exists()).toBe(false)
    })

    BddTest().then('it should render the delete trace associated elements dropdown', () => {
      const dropdown = findDropdown('delete')
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = findDropdown('associate')
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

    BddTest().and('the trace associate elements dropdown selects the DECLARED_SKILL type', () => {
      beforeEach(() => {
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_SKILL)
      })

      BddTest().then('the associate declared skills modal should be shown', () => {
        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)

        expect(associateDeclaredSkillsModal.props('show')).toBe(true)
      })
    })

    BddTest().and('the associate declared skills modal emits cancel', () => {
      beforeEach(() => {
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_SKILL)

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
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_SKILL)

        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
        associateDeclaredSkillsModal.vm.$emit('associated')
      })

      BddTest().then('the associate declared skills modal should be hidden', () => {
        const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)

        expect(associateDeclaredSkillsModal.props('show')).toBe(false)
      })
    })

    BddTest().and('the trace associate elements dropdown selects the DECLARED_ACTIVITY type', () => {
      beforeEach(async () => {
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)
      })

      BddTest().then('the AssociateActivitiesToTracesModal should be shown', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('AssociateActivitiesToTracesModal emits cancel', () => {
      beforeEach(async () => {
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)
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
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        await modal.vm.$emit('associated')
      })

      BddTest().then('the AssociateActivitiesToTracesModal should be hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToTracesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('the trace associate elements dropdown selects the DECLARED_EXPERIENCE type', () => {
      beforeEach(async () => {
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_EXPERIENCE)
      })

      BddTest().then('the AssociateDeclaredExperiencesToTracesModal should be shown', () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToTracesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('AssociateDeclaredExperiencesToTracesModal emits cancel', () => {
      beforeEach(async () => {
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_EXPERIENCE)
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
        const dropdown = findDropdown('associate')
        await dropdown.vm.$emit('select', EAssociationContextType.DECLARED_EXPERIENCE)
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
    const associationsProps = { declaredActivityAssociations: [], declaredSkillAssociations, declaredExperienceAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId,
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
      const dropdown = findDropdown('delete')
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_SKILL, disabled: false },
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: true },
      ])
    })

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = findDropdown('associate')
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should pass declared skill associations to the delete skills modal', () => {
      const skillsModal = wrapper.findComponent(DeleteTraceAssociatedSkillsModalStub)
      expect(skillsModal.props('associations')).toEqual(declaredSkillAssociations)
      expect(skillsModal.props('traceId')).toBe(traceId)
    })
  })

  BddTest().when('the component is mounted with only declared experience associations', () => {
    const declaredExperienceAssociations = createMockedDeclaredExperiencesAssociations(2)
    const associationsProps: TraceAssociationsDTO = { declaredActivityAssociations: [], declaredSkillAssociations: [], declaredExperienceAssociations }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId,
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should render the associated declared experiences card with the correct associations', () => {
      const declaredExperiencesCard = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(declaredExperiencesCard.exists()).toBe(true)
      expect(declaredExperiencesCard.props('associatedExperiences')).toEqual(declaredExperienceAssociations)
    })

    BddTest().then('it should render the associated declared skills card with empty associations', () => {
      const declaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(declaredSkillsCard.exists()).toBe(true)
      expect(declaredSkillsCard.props('associatedDeclaredSkills')).toEqual([])
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: {
            declaredSkillAssociations: mockedTraceDeclaredSkillAssociations,
            declaredActivityAssociations: mockedTraceDeclaredActivityAssociations,
            declaredExperienceAssociations: createMockedDeclaredExperiencesAssociations(1)
          },
          traceId,
          disabled: true,
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass disabled=true to AssociatedDeclaredSkillsCard', () => {
      const skillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(skillsCard.props('disabled')).toBe(true)
    })

    BddTest().then('it should pass disabled=true to AssociatedDeclaredActivitiesCard', () => {
      const activitiesCard = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(activitiesCard.props('disabled')).toBe(true)
    })

    BddTest().then('it should pass disabled=true to AssociatedDeclaredExperiencesCard', () => {
      const experiencesCard = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(experiencesCard.props('disabled')).toBe(true)
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
          title: 'Renforcer sa capacité d\'adaptation',
          thematic: EActivityThematic.RESUMES,
          summary: 'Activité visant à analyser sa capacité à s\'adapter à des contextes variés et à gérer les changements. L\'étudiant.e identifie des situations concrètes illustrant sa flexibilité et sa résilience.',
          description: '<h3>Objectifs</h3><ul><li>Analyser sa capacité à s\'adapter à des contextes variés et à gérer les changements</li><li>Identifier des situations concrètes illustrant sa flexibilité et sa résilience</li><li>Utiliser cette analyse pour renforcer sa capacité d\'adaptation dans son projet professionnel</li></ul>',
          status: EDeclaredActivityStatus.COMPLETED,
          startDate: '2027-01-10',
          endDate: '2027-01-20',
          updatedAt: '2026-03-30T15:43:46.438115Z'
        }
      }
    ]
    const associationsProps: TraceAssociationsDTO = { declaredActivityAssociations, declaredSkillAssociations: [], declaredExperienceAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps,
          traceId,
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
      const declaredActivityCards = wrapper.findAll('[data-testid="associated-declared-activity"]')
      expect(declaredActivityCards).toHaveLength(3)
    })

    BddTest().then('it should render only the declared activity associations container', () => {
      const activityContainer = wrapper.findComponent(AssociatedDeclaredActivitiesCard)
      expect(activityContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the delete trace associated elements dropdown with correct disabled state', () => {
      const dropdown = findDropdown('delete')
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_SKILL, disabled: true },
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: false },
      ])
    })

    BddTest().then('it should render the trace associate elements dropdown', () => {
      const dropdown = findDropdown('associate')
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should pass all declared activity associations to the delete activities modal without filtering', () => {
      const activitiesModal = wrapper.findComponent(DeleteTraceAssociatedActivitiesModalStub)

      expect(activitiesModal.props('associations')).toEqual(declaredActivityAssociations)
      expect(activitiesModal.props('traceId')).toBe(traceId)
    })
  })
})
