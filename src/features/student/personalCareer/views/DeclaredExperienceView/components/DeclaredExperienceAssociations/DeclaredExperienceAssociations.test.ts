import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociationElementsDropdownStub }
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode } from '@/common/exceptions'
import { AssociatedTracesCardStub }
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import DeclaredExperienceAssociations
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.vue'
import { AssociateTracesToDeclaredExperienceModalStub }
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/AssociateTracesToDeclaredExperienceModal/AssociateTracesToDeclaredExperienceModal.stub'
import { DeleteDeclaredExperienceAssociatedTracesModalStub }
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/DeleteDeclaredExperienceAssociatedTracesModal/DeleteDeclaredExperienceAssociatedTracesModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockedAssociatedTraces: TraceAssociationDTO[] = mockedTraceOverview.map((trace, index) => ({
  associationId: `declared-experience-trace-association-${index + 1}`,
  trace
}))

const declaredExperienceId = 'experience-1'

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  AssociatedTracesCard: AssociatedTracesCardStub,
  AssociationElementsDropdown: AssociationElementsDropdownStub,
  DeleteDeclaredExperienceAssociatedTracesModal: DeleteDeclaredExperienceAssociatedTracesModalStub,
  AssociateTracesToDeclaredExperienceModal: AssociateTracesToDeclaredExperienceModalStub
}

BddTest().given('a declared experience associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceAssociations>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is rendered with associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations, {
        props: {
          declaredExperienceId,
          traceAssociations: mockedAssociatedTraces
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-experience-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render QuerySuspense with correct props', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('error')).toBeFalsy()
      expect(querySuspense.props('isEmpty')).toBe(false)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune association pour cette expérience déclarée')
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors de la récupération des associations de l\'expérience déclarée.')
    })

    BddTest().then('it should not render the query suspense empty fallback', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(false)
    })

    BddTest().then('it should not render the query suspense error fallback', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(false)
    })

    BddTest().then('it should render AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should pass associated traces to AssociatedTracesCard', () => {
      const card = wrapper.findComponent(AssociatedTracesCardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('associatedTraces')).toEqual(mockedAssociatedTraces)
    })

    BddTest().then('it should render the delete associated elements dropdown with the traces entry enabled', () => {
      const dropdown = wrapper.findComponent(AssociationElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('variant')).toBe('delete')
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.TRACE, disabled: false }
      ])
    })

    BddTest().then('it should render the delete traces modal hidden with the right props', () => {
      const modal = wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('experienceId')).toBe(declaredExperienceId)
      expect(modal.props('associations')).toEqual(mockedAssociatedTraces)
    })

    BddTest().then('it should render the associate elements dropdown with the traces entry', () => {
      const dropdowns = wrapper.findAllComponents(AssociationElementsDropdownStub)
      const dropdown = dropdowns.find(candidate => candidate.props('variant') === 'associate')

      expect(dropdown?.exists()).toBe(true)
      expect(dropdown?.props('items')).toEqual([
        { type: EAssociationContextType.TRACE }
      ])
    })

    BddTest().then('it should render the associate traces modal hidden with the right props', () => {
      const modal = wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('declaredExperienceId')).toBe(declaredExperienceId)
    })

    BddTest().and('the associate dropdown emits select', () => {
      beforeEach(async () => {
        const dropdowns = wrapper.findAllComponents(AssociationElementsDropdownStub)
        const associateDropdown = dropdowns.find(candidate => candidate.props('variant') === 'associate')

        await associateDropdown?.vm.$emit('select', EAssociationContextType.TRACE)
      })

      BddTest().then('it should display the associate traces modal', () => {
        expect(wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub).props('show')).toBe(true)
      })

      BddTest().and('the associate traces modal emits cancel', () => {
        beforeEach(async () => {
          await wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub).vm.$emit('cancel')
        })

        BddTest().then('it should hide the associate traces modal', () => {
          expect(wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the associate traces modal emits associated', () => {
        beforeEach(async () => {
          await wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub).vm.$emit('associated')
        })

        BddTest().then('it should hide the associate traces modal', () => {
          expect(wrapper.findComponent(AssociateTracesToDeclaredExperienceModalStub).props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the dropdown selects the trace type', () => {
      beforeEach(async () => {
        await wrapper.findComponent(AssociationElementsDropdownStub).vm.$emit('select', EAssociationContextType.TRACE)
      })

      BddTest().then('it should display the delete traces modal', () => {
        expect(wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub).props('show')).toBe(true)
      })

      BddTest().and('the delete traces modal emits cancel', () => {
        beforeEach(async () => {
          await wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub).vm.$emit('cancel')
        })

        BddTest().then('it should hide the delete traces modal', () => {
          expect(wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the delete traces modal emits deleted', () => {
        beforeEach(async () => {
          await wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub).vm.$emit('deleted')
        })

        BddTest().then('it should hide the delete traces modal', () => {
          expect(wrapper.findComponent(DeleteDeclaredExperienceAssociatedTracesModalStub).props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is rendered with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations, {
        props: {
          declaredExperienceId,
          traceAssociations: []
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the associations container', () => {
      const container = wrapper.find('[data-testid="declared-experience-associations"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render QuerySuspense as empty', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('isEmpty')).toBe(true)
      expect(querySuspense.props('error')).toBeFalsy()
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune association pour cette expérience déclarée')
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors de la récupération des associations de l\'expérience déclarée.')
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

    BddTest().then('it should disable the traces entry of the delete dropdown', () => {
      const dropdown = wrapper.findComponent(AssociationElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toEqual([
        { type: EAssociationContextType.TRACE, disabled: true }
      ])
    })
  })

  BddTest().when('the component is rendered with an associations error', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations, {
        props: {
          declaredExperienceId,
          traceAssociations: [],
          associationsError: {
            status: 500,
            code: BaseApiErrorCode.SERVER,
            name: 'Internal Server Error',
            message: 'Internal Server Error'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render QuerySuspense with the associations error', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('error')).toEqual({
        status: 500,
        code: BaseApiErrorCode.SERVER,
        name: 'Internal Server Error',
        message: 'Internal Server Error'
      })
      expect(querySuspense.props('errorTitle')).toBe('Une erreur est survenue lors de la récupération des associations de l\'expérience déclarée.')
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
  })
})
