import type { TracesViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { createMockedTracesViewResponse, useTracesViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentToolsTracesView from './StudentToolsTracesView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useTracesViewQuery: vi.fn(),
  }
})

const mockedUseTracesViewQuery = vi.mocked(useTracesViewQuery)

function mockUseTracesViewQuery (payload: TracesViewResponse) {
  const mockData: Ref<TracesViewResponse> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<TracesViewResponse, BaseApiException>
  mockedUseTracesViewQuery.mockReturnValue(queryMockedData)
}

describe('studentToolsTracesView', () => {
  const mockedData = createMockedTracesViewResponse(4, 4, 1)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseTracesViewQuery(mockedData)
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
