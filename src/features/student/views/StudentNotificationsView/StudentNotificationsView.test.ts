import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentNotificationsView from './StudentNotificationsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentNotificationsView', () => {
  const title = 'Mes notifications'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: title }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentNotificationsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
