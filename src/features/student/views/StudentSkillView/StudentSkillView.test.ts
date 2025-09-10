import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentEducationSkillsRoute, studentHomeRoute } from '@/features/student/routes'
import StudentSkillView from '@/features/student/views/StudentSkillView/StudentSkillView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillView>>

  const stubs = { PageTitle: PageTitleStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentSkillView, { global: { stubs } })
  })

  const mockedSkillName = 'Prévenir la pollution à la source'

  const title = `Compétence ${mockedSkillName}`
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const skillsBreadcrumbLink = { text: 'Mes compétences', to: studentEducationSkillsRoute }
  const currentBreadcrumbLink = { text: mockedSkillName }

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        skillsBreadcrumbLink,
        currentBreadcrumbLink
      ])
    })
  })
})
