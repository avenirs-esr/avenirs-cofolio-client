import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute } from '@/features/student/routes'
import StudentToolsResumesView from '@/features/student/views/StudentToolsResumesView/StudentToolsResumesView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student tools resumes view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsResumesView>>

  const stubs = { PageTitle: PageTitleStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentToolsResumesView, { global: { stubs } })
  })

  const title = '(placeholder) Tous mes CV'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes CV' }

  BddTest().when('the view is mountend', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        currentBreadcrumbLink
      ])
    })
  })
})
