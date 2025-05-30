import { studentEducationSkillsRoute, studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentSkillView from './StudentSkillView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentSkillView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockedSkillName = 'Prévenir la pollution à la source'

  const title = `Compétence ${mockedSkillName}`
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const skillsBreadcrumbLink = { text: 'Mes compétences', to: studentEducationSkillsRoute }
  const currentBreadcrumbLink = { text: mockedSkillName }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentSkillView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      skillsBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
