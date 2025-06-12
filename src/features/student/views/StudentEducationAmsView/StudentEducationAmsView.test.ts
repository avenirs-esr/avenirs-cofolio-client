import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentEducationAmsView from './StudentEducationAmsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentEducationAmsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})
