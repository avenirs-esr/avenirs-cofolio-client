import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentToolsTracksView from './StudentToolsTracksView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentToolsTracksView', () => {
  const title = '(placeholder) Toutes mes traces'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes traces' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentToolsTracksView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
