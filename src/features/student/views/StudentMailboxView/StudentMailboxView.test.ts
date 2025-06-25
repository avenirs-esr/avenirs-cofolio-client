import { studentHomeRoute } from '@/features/student/routes'
import StudentMailboxView from '@/features/student/views/StudentMailboxView/StudentMailboxView.vue'
import { mount } from '@vue/test-utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentMailboxView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const title = 'Ma messagerie'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: title }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentMailboxView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
