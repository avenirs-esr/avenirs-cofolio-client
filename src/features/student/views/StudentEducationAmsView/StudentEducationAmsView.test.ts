import type { AmsViewResponse } from '@/types'
import { mockedAmss, mockedAmssPagination } from '@/features/student/queries'
import { useAmsViewQuery } from '@/features/student/queries/use-ams-view.query/use-ams-view.query'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentEducationAmsView from './StudentEducationAmsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock('@/features/student/queries/use-ams-view.query/use-ams-view.query', () => ({
  useAmsViewQuery: vi.fn()
}))

const mockedEmptyAmssPagination: AmsViewResponse = {
  content: [],
  pagination: {
    page: 1,
    pageSize: 10,
    count: mockedAmss.length,
    totalPages: 1,
  }
}

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

function mockUseAmsViewQuery (payload: AmsViewResponse) {
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

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentEducationAmsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })

  it('should not render widget if no AMS is available', async () => {
    mockUseAmsViewQuery(mockedEmptyAmssPagination)
    const wrapper = mount(StudentEducationAmsView)
    expect(wrapper.findComponent({ name: 'StudentAmsCard' }).exists()).toBe(false)
  })

  it('should render one StudentAmsCard per AMS', async () => {
    const wrapper = mount(StudentEducationAmsView)
    const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
    expect(cards).toHaveLength(4)
    expect(cards[0].props('ams').id).toBe('ams1')
    expect(cards[1].props('ams').id).toBe('ams2')
    expect(cards[2].props('ams').id).toBe('ams3')
    expect(cards[3].props('ams').id).toBe('ams4')
  })
})
