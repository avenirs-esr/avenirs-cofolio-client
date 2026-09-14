import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentMailboxView from '@/features/student/user/views/StudentMailboxView/StudentMailboxView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a student mailbox view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentMailboxView>>

  const stubs = { PageTitle: PageTitleStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentMailboxView, { global: { stubs } })
  })

  const title = 'Ma messagerie'

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
    })
  })
})
