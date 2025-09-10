import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute } from '@/features/student/routes'
import StudentEventsView from '@/features/student/views/StudentEventsView/StudentEventsView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student events view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentEventsView>>

  const stubs = {
    PageTitle: PageTitleStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentEventsView, { global: { stubs } })
  })

  const title = '(placeholder) Tous mes événements'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: title }

  BddTest().when('the view is mounted', () => {
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
