import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentProjectSkillsView from './StudentProjectSkillsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentProjectSkillsView', () => {
  const title = '(placeholder) Toutes mes compétences'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Toutes mes compétences' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentProjectSkillsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
