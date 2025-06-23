import type { TraceConfigurationInfo, TracesViewResponse, UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { createMockedTracesViewResponse, useStudentTracesConfigurationQuery, useUnassignedTracesSummaryQuery, useUnassignedTracesViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
import { describe, expect, it, vi } from 'vitest'
import StudentToolsTracesView from './StudentToolsTracesView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useUnassignedTracesViewQuery: vi.fn(),
    useStudentTracesConfigurationQuery: vi.fn(),
    useUnassignedTracesSummaryQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useUnassignedTracesViewQuery)

export function mockUseUnassignedTracesViewQuery (payload: TracesViewResponse) {
  const mockReturn = createMockedTracesViewQueryReturn(payload, null)
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

const mockedUseUnassignedTracesSummaryQuery = vi.mocked(useUnassignedTracesSummaryQuery)

export function mockUseUnassignedTracesSummaryQuery (payload: UnassociatedTracesSummaryDTO) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useUnassignedTracesSummaryQuery>
  mockedUseUnassignedTracesSummaryQuery.mockReturnValue(queryMockedData)
}

const mockedUseStudentTracesConfigurationQuery = vi.mocked(useStudentTracesConfigurationQuery)

function mockUseStudentTracesConfigurationQuery (payload: TraceConfigurationInfo | null) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useStudentTracesConfigurationQuery>
  mockedUseStudentTracesConfigurationQuery.mockReturnValue(queryMockedData)
}

describe('studentToolsTracesView', () => {
  const mockedData = createMockedTracesViewResponse(4, 4, 0)
  const stubs = {
    PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
    StudentToolsTracesViewContainer: { name: 'StudentToolsTracesViewContainer', props: ['traces'], template: '<div />' },
    StudentToolsTracesViewNotice: {
      name: 'StudentToolsTracesViewNotice',
      template: `<div class="student-tools-traces-view-notice"/>`,
      props: ['traces', 'tracesConfig'],
    }
  }

  const mockedTracesConfiguration = {
    maxDayRemaining: 30,
    maxDayRemainingWarning: 15,
    maxDayRemainingCritical: 7
  }

  const mockedUnassignedTracesSummary = {
    total: 15,
    totalWarnings: 5,
    totalCriticals: 3
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseUnassignedTracesViewQuery(mockedData)
    mockUseStudentTracesConfigurationQuery(mockedTracesConfiguration)
    mockUseUnassignedTracesSummaryQuery(mockedUnassignedTracesSummary)
  })

  const title = 'Ma bibliothèque de traces'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const toolsBreadcrumbLink = { text: 'Mes outils' }
  const currentBreadcrumbLink = { text: 'Mes traces' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentToolsTracesView, {
      stubs,
      plugins: [createPinia()]
    })
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      toolsBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })

  it('should render StudentToolsTracesViewContainer', () => {
    const wrapper = mount(StudentToolsTracesView, {
      stubs,
      plugins: [createPinia()]
    })
    const container = wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' })

    expect(container.exists()).toBe(true)
  })
})
