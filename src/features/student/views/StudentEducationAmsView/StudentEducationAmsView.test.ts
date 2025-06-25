import type { AmsViewResponse } from '@/api/avenir-esr'
import { createMockedAmsViewResponse, useAmsViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import StudentEducationAmsView from '@/features/student/views/StudentEducationAmsView/StudentEducationAmsView.vue'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { mountWithRouter } from 'tests/utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useAmsViewQuery: vi.fn(),
  }
})

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

export function mockUseAmsViewQuery (payload: AmsViewResponse) {
  const mockReturn = createMockedAmsViewQueryReturn(payload, null)
  mockedUseAmsViewQuery.mockReturnValue(mockReturn)
}

describe('studentEducationAmsView', () => {
  const mockedData = createMockedAmsViewResponse(4, 4, 0)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseAmsViewQuery(mockedData)
  })

  const title = 'Mes Activités de Mise en situation (AMS)'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes AMS' }

  it('should render PageTitle with correct props', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsView, {
      plugins: [createPinia()]
    })
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
