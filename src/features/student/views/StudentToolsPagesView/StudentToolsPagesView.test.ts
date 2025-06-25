import { studentHomeRoute } from '@/features/student/routes'
import StudentToolsPagesView from '@/features/student/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import { mount } from '@vue/test-utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentToolsPagesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const title = '(placeholder) Toutes mes pages libres'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes pages libres' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentToolsPagesView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
