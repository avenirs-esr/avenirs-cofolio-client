import type { TraceConfigurationInfo, TracesViewResponse } from '@/api/avenir-esr'
import { createMockedTracesViewResponse, useUnassignedTracesViewQuery } from '@/features/student/queries'
import { useStudentTracesConfigurationQuery } from '@/features/student/queries/use-student-configuration.query/use-student-configuration.query'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import StudentToolsTracesView from './StudentToolsTracesView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useUnassignedTracesViewQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useUnassignedTracesViewQuery)

export function mockUseUnassignedTracesViewQuery (payload: TracesViewResponse) {
  const mockReturn = createMockedTracesViewQueryReturn(payload, null)
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

vi.mock('@/features/student/queries/use-student-configuration.query/use-student-configuration.query', () => ({
  useStudentTracesConfigurationQuery: vi.fn()
}))

const mockedUseStudentTracesConfigurationQuery = vi.mocked(useStudentTracesConfigurationQuery)

function mockUseStudentTracesConfigurationQuery (payload: TraceConfigurationInfo | null) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useStudentTracesConfigurationQuery>
  mockedUseStudentTracesConfigurationQuery.mockReturnValue(queryMockedData)
}

describe('studentToolsTracesView', () => {
  const stubs = {
    PageTitle: {
      name: 'PageTitle',
      template: '<div />',
      props: ['title', 'breadcrumbLinks']
    },
    StudentToolsTracesViewContainer: {
      name: 'StudentToolsTracesViewContainer',
      template: `<div class="student-tools-traces-view-container"/>`,
      props: ['traces'],
    },
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
  const mockedData = createMockedTracesViewResponse(4, 4, 0)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseUnassignedTracesViewQuery(mockedData)
    mockUseStudentTracesConfigurationQuery(mockedTracesConfiguration)
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

  it('displays an alert with the correct parameters if unassociated traces are present', async () => {
    const wrapper = mount(StudentToolsTracesView, {
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' })
    expect(notice.exists()).toBe(true)
  })

  it('injects traces into StudentToolsTracesViewContainer', () => {
    const wrapper = mount(StudentToolsTracesView, {
      global: {
        stubs
      }
    })
    const traceContainer = wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' })
    expect(traceContainer.exists()).toBe(true)
    expect(traceContainer.props('traces')).toBeDefined()
    expect(Array.isArray(traceContainer.props('traces'))).toBe(true)
  })
})
