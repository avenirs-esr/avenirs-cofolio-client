import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentDeliverablesView from '@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a student deliverables view', () => {
  let wrapper: VueWrapper

  const stubs = { PageTitle: PageTitleStub }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(StudentDeliverablesView, {
      global: { stubs }
    })
  })

  const title = '(placeholder) Tous mes rendus'

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
    })
  })
})
