import type { AmsViewResponse } from '@/api/avenir-esr'
import { createMockedAmsViewResponse, useAmsViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { mountWithRouter } from 'tests/utils'
import StudentEducationAmsView from './StudentEducationAmsView.vue'

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
    mockUseAmsViewQuery(mockedData)
  })

  const title = 'Mes Activités de Mise en situation (AMS)'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes AMS' }

  it('should render PageTitle with correct props', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })

  it('should render one StudentAmsCard per AMS', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsView)
    const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
    expect(cards).toHaveLength(4)
    expect(cards[0].props('ams').id).toBe('ams1')
    expect(cards[1].props('ams').id).toBe('ams2')
    expect(cards[2].props('ams').id).toBe('ams3')
    expect(cards[3].props('ams').id).toBe('ams4')
  })
})
