import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type {
  AssociationElementsDropdownVariant
} from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mockedTraceDeclaredActivityAssociations, mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { createMockedDeclaredExperiencesAssociations } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { createMockedDeclaredActivitiesAssociations } from '@/__mocks__/fixtures/student/skills.fixtures'
import { EAssociationContextType, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { AssociationElementsDropdownStub }
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ErrorCodes } from '@/common/constants'
import { AssociatedDeclaredActivitiesCardStub } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.stub'
import { AssociatedTracesCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import { AssociateActivitiesToDeclaredSkillModalStub } from '@/features/student/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.stub'
import { AssociateDeclaredExperiencesToDeclaredSkillModalStub } from '@/features/student/declaredSkills/components/overlays/modals/AssociateDeclaredExperiencesToDeclaredSkillModal/AssociateDeclaredExperiencesToDeclaredSkillModal.stub'
import { DeleteDeclaredSkillAssociatedActivitiesModalStub } from '@/features/student/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedActivitiesModal/DeleteDeclaredSkillAssociatedActivitiesModal.stub'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { AssociatedDeclaredExperiencesCardStub }
  from '@/features/student/personalCareer/components/cards/AssociatedDeclaredExperiencesCard/AssociatedDeclaredExperiencesCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const declaredSkillId = 'declared-skill-progress-1'

const mockedAssociatedDeclaredExperiences = createMockedDeclaredExperiencesAssociations(2)

const mockedAssociatedTraces: TraceAssociationDTO[] = mockedTraceOverview.map((trace, i) => ({
  associationId: `skill-trace-assoc-${i + 1}`,
  trace
}))

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  AssociatedTracesCard: AssociatedTracesCardStub,
  AssociatedDeclaredActivitiesCard: AssociatedDeclaredActivitiesCardStub,
  AssociatedDeclaredExperiencesCard: AssociatedDeclaredExperiencesCardStub,
  AssociationElementsDropdown: AssociationElementsDropdownStub,
  AssociateActivitiesToDeclaredSkillModal: AssociateActivitiesToDeclaredSkillModalStub,
  AssociateDeclaredExperiencesToDeclaredSkillModal: AssociateDeclaredExperiencesToDeclaredSkillModalStub,
  DeleteDeclaredSkillAssociatedActivitiesModal: DeleteDeclaredSkillAssociatedActivitiesModalStub
}

BddTest().given('a student declared skill associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillAssociations>>

  const findDropdown = (variant: AssociationElementsDropdownVariant) =>
    wrapper.findAllComponents(AssociationElementsDropdownStub)
      .filter(dropdown => dropdown.props('variant') === variant)[0]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is rendered with associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: mockedAssociatedTraces,
          associatedDeclaredActivities: mockedTraceDeclaredActivityAssociations,
          associatedDeclaredExperiences: mockedAssociatedDeclaredExperiences,
          countAssociations: 5
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-skill-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render QuerySuspense with correct props', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('error')).toBeFalsy()
      expect(querySuspense.props('isEmpty')).toBe(false)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune association pour cette compétence déclarée')
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors du chargement des associations')
    })

    BddTest().then('it should not render the query suspense empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should not render the query suspense error', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(false)
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

    BddTest().then('it should render AssociatedDeclaredExperiencesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should pass associatedDeclaredExperiences prop to AssociatedDeclaredExperiencesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(card.props('associatedExperiences')).toEqual(mockedAssociatedDeclaredExperiences)
    })

    BddTest().then('it should render the declared skill associate elements dropdown', () => {
      const dropdown = findDropdown('associate')
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should provide declared activity and declared experience associate items', () => {
      const dropdown = findDropdown('associate')
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY },
        { type: EAssociationContextType.DECLARED_EXPERIENCE }
      ])
    })

    BddTest().then('it should render the associate activities modal hidden by default', () => {
      const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('declaredSkillId')).toBe(declaredSkillId)
    })

    BddTest().then('it should render the associate declared experiences modal hidden by default', () => {
      const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('declaredSkillId')).toBe(declaredSkillId)
    })

    BddTest().and('the associate dropdown selects the activity type', () => {
      beforeEach(() => {
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)
      })

      BddTest().then('the associate activities modal should be shown', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('the associate activities modal emits cancel', () => {
      beforeEach(() => {
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)

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
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)

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

    BddTest().and('the associate dropdown selects the declared experience type', () => {
      beforeEach(() => {
        const dropdown = findDropdown('associate')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_EXPERIENCE)
      })

      BddTest().then('the associate declared experiences modal should be shown', () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(true)
      })

      BddTest().then('the associate activities modal should remain hidden', () => {
        const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
        expect(modal.props('show')).toBe(false)
      })

      BddTest().and('the associate declared experiences modal emits cancel', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
          modal.vm.$emit('cancel')
        })

        BddTest().then('the associate declared experiences modal should be hidden', () => {
          const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })

      BddTest().and('the associate declared experiences modal emits associated', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
          modal.vm.$emit('associated')
        })

        BddTest().then('the associate declared experiences modal should be hidden', () => {
          const modal = wrapper.findComponent(AssociateDeclaredExperiencesToDeclaredSkillModalStub)
          expect(modal.props('show')).toBe(false)
        })

        BddTest().then('it should emit associated', () => {
          expect(wrapper.emitted('associated')).toBeTruthy()
          expect(wrapper.emitted('associated')).toHaveLength(1)
        })
      })
    })
  })

  BddTest().when('the component is rendered with deletable declared activities', () => {
    const associatedDeclaredActivities = createMockedDeclaredActivitiesAssociations(3)
    associatedDeclaredActivities[1].declaredActivity.status = EDeclaredActivityStatus.SUBMITTED
    associatedDeclaredActivities[2].declaredActivity.status = EDeclaredActivityStatus.COMPLETED

    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: mockedAssociatedTraces,
          associatedDeclaredActivities,
          associatedDeclaredExperiences: [],
          countAssociations: 3
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the delete declared skill associated elements dropdown', () => {
      const dropdown = findDropdown('delete')
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should enable the delete dropdown activities when a deletable activity exists', () => {
      const dropdown = findDropdown('delete')
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: false }
      ])
    })

    BddTest().then('it should render the delete activities modal hidden by default', () => {
      const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('declaredSkillProgressId')).toBe(declaredSkillId)
      expect(modal.props('associations')).toEqual(associatedDeclaredActivities)
    })

    BddTest().and('the delete dropdown selects the activity type', () => {
      beforeEach(() => {
        const dropdown = findDropdown('delete')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)
      })

      BddTest().then('the delete activities modal should be shown', () => {
        const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('the delete activities modal emits cancel', () => {
      beforeEach(() => {
        const dropdown = findDropdown('delete')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)

        const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
        modal.vm.$emit('cancel')
      })

      BddTest().then('the delete activities modal should be hidden', () => {
        const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('the delete activities modal emits deleted', () => {
      beforeEach(() => {
        const dropdown = findDropdown('delete')
        dropdown.vm.$emit('select', EAssociationContextType.DECLARED_ACTIVITY)

        const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
        modal.vm.$emit('deleted')
      })

      BddTest().then('the delete activities modal should be hidden', () => {
        const modal = wrapper.findComponent(DeleteDeclaredSkillAssociatedActivitiesModalStub)
        expect(modal.props('show')).toBe(false)
      })
    })
  })

  BddTest().when('the component is rendered with only non-deletable declared activities', () => {
    const associatedDeclaredActivities = createMockedDeclaredActivitiesAssociations(2)
    associatedDeclaredActivities[0].declaredActivity.status = EDeclaredActivityStatus.SUBMITTED
    associatedDeclaredActivities[1].declaredActivity.status = EDeclaredActivityStatus.COMPLETED

    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: [],
          associatedDeclaredActivities,
          associatedDeclaredExperiences: [],
          countAssociations: 2
        },
        global: { stubs }
      })
    })

    BddTest().then('it should disable the delete dropdown activities', () => {
      const dropdown = findDropdown('delete')
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: true }
      ])
    })
  })

  BddTest().when('the component is rendered with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: [],
          associatedDeclaredActivities: [],
          associatedDeclaredExperiences: [],
          countAssociations: 0
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-skill-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render QuerySuspense as empty', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('isEmpty')).toBe(true)
      expect(querySuspense.props('error')).toBeFalsy()
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune association pour cette compétence déclarée')
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors du chargement des associations')
    })

    BddTest().then('it should render the query suspense empty fallback', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the query suspense error fallback', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedDeclaredActivitiesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(card.exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedDeclaredExperiencesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(card.exists()).toBe(false)
    })

    BddTest().then('it should render the associate activities modal with the declared skill id', () => {
      const modal = wrapper.findComponent(AssociateActivitiesToDeclaredSkillModalStub)
      expect(modal.props('declaredSkillId')).toBe(declaredSkillId)
    })
  })

  BddTest().when('the component is rendered with an associations error', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: [],
          associatedDeclaredActivities: [],
          associatedDeclaredExperiences: [],
          associationsError: {
            status: 404,
            code: ErrorCodes.ASSOCIATION_NOT_FOUND,
            name: 'Not Found',
            message: 'Boom'
          },
          countAssociations: 0
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render QuerySuspense with the associations error', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('error')).toEqual({
        status: 404,
        code: ErrorCodes.ASSOCIATION_NOT_FOUND,
        name: 'Not Found',
        message: 'Boom'
      })
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors du chargement des associations')
      expect(querySuspense.props('isEmpty')).toBe(true)
    })

    BddTest().then('it should render the query suspense error fallback', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the query suspense empty fallback because error has priority', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedDeclaredActivitiesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredActivitiesCardStub)
      expect(card.exists()).toBe(false)
    })

    BddTest().then('it should not render AssociatedDeclaredExperiencesCard', () => {
      const card = wrapper.findComponent(AssociatedDeclaredExperiencesCardStub)
      expect(card.exists()).toBe(false)
    })
  })
})
