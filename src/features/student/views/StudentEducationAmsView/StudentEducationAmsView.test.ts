import type { AmsViewResponse } from '@/api/avenir-esr'
import { mockedAmss, mockedAmssPagination } from '@/features/student/queries/fixtures'
import { useAmsViewQuery } from '@/features/student/queries/use-ams-view.query/use-ams-view.query'
import { studentHomeRoute } from '@/features/student/routes'
import { mountWithRouter } from 'tests/utils'
import StudentEducationAmsView from './StudentEducationAmsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries/use-ams-view.query/use-ams-view.query', () => ({
  useAmsViewQuery: vi.fn()
}))

const mockedEmptyAmssPagination: AmsViewResponse = {
  data: [],
  page: {
    number: 1,
    size: 10,
    totalElements: mockedAmss.length,
    totalPages: 1,
  }
}

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

function mockUseAmsViewQuery (payload: AmsViewResponse | null) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useAmsViewQuery>
  mockedUseAmsViewQuery.mockReturnValue(queryMockedData)
}

describe('studentEducationAmsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAmsViewQuery(mockedAmssPagination)
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

  it('should not render widget if no AMS is available', async () => {
    mockUseAmsViewQuery(mockedEmptyAmssPagination)
    const wrapper = await mountWithRouter(StudentEducationAmsView)
    expect(wrapper.findComponent({ name: 'StudentAmsCard' }).exists()).toBe(false)
  })

  it('should not render view if ams is null', async () => {
    mockUseAmsViewQuery(null)
    const wrapper = await mountWithRouter(StudentEducationAmsView)
    expect(wrapper.findComponent({ name: 'StudentAmsCard' }).exists()).toBe(false)
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
