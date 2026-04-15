import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedTraceDeclaredActivityAssociations, mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode } from '@/common/exceptions'
import { AssociatedDeclaredActivitiesCardStub } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.stub'
import { AssociatedTracesCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import { AssociateActivitiesToDeclaredSkillModalStub } from '@/features/student/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.stub'
import { DeclaredSkillAssociateElementsDropdownStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/overlays/dropdowns/DeclaredSkillAssociateElementsDropdown/DeclaredSkillAssociateElementsDropdown.stub'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const declaredSkillId = 'declared-skill-progress-1'

const mockedAssociatedTraces: TraceAssociationDTO[] = mockedTraceOverview.map((trace, i) => ({
  associationId: `skill-trace-assoc-${i + 1}`,
  trace
}))

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  AssociatedTracesCard: AssociatedTracesCardStub,
  AssociatedDeclaredActivitiesCard: AssociatedDeclaredActivitiesCardStub,
  DeclaredSkillAssociateElementsDropdown: DeclaredSkillAssociateElementsDropdownStub,
  AssociateActivitiesToDeclaredSkillModal: AssociateActivitiesToDeclaredSkillModalStub
}

BddTest().given('a student declared skill associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillAssociations>>

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
          countAssociations: 3
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
      wrapper = mountComponent(StudentDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          associatedTraces: [],
          associatedDeclaredActivities: [],
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
          associationsError: {
            status: 404,
            code: BaseApiErrorCode.NOT_FOUND,
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
        code: BaseApiErrorCode.NOT_FOUND,
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
  })
})
