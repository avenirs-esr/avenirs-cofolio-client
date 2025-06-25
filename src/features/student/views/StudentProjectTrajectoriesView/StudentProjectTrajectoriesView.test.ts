import { studentHomeRoute } from '@/features/student/routes'
import StudentProjectTrajectoriesView from '@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { mount } from '@vue/test-utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentProjectTrajectoriesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const title = '(placeholder) Bâtir mon projet'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Bâtir mon projet' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentProjectTrajectoriesView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
