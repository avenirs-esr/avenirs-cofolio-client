import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentEventsView from '@/features/student/global/views/StudentEventsView/StudentEventsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

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

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
    })
  })
})
