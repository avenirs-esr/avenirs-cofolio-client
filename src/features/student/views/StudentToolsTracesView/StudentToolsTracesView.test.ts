import type { TracesViewResponse } from '@/api/avenir-esr'
import { createMockedTracesViewResponse, useUnassignedTracesViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
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

describe('studentToolsTracesView', () => {
  const mockedData = createMockedTracesViewResponse(4, 4, 0)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseUnassignedTracesViewQuery(mockedData)
  })

  const stubs = {
    PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
    StudentToolsTracesViewContainer: { name: 'StudentToolsTracesViewContainer', props: ['traces'], template: '<div />' }
  }

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
})
