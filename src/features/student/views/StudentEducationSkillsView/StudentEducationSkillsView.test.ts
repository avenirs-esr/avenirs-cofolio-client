import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentEducationSkillsView from './StudentEducationSkillsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentEducationSkillsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const title = 'Toutes mes compétences'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes compétences' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentEducationSkillsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
