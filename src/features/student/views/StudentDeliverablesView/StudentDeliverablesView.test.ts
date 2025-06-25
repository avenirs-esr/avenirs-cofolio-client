import { studentHomeRoute } from '@/features/student/routes'
import StudentDeliverablesView from '@/features/student/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import { mount } from '@vue/test-utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentDeliverablesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const title = '(placeholder) Tous mes rendus'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: title }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentDeliverablesView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
