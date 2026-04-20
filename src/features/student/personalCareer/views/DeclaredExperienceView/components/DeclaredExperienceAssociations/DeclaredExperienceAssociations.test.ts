import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode } from '@/common/exceptions'
import { AssociatedTracesCardStub }
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import DeclaredExperienceAssociations
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockedAssociatedTraces: TraceAssociationDTO[] = mockedTraceOverview.map((trace, index) => ({
  associationId: `declared-experience-trace-association-${index + 1}`,
  trace
}))

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  AssociatedTracesCard: AssociatedTracesCardStub
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
  })

  BddTest().when('the component is rendered with empty associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations, {
        props: {
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
  })

  BddTest().when('the component is rendered with an associations error', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations, {
        props: {
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
