import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import ActivitiesView from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'
import { MyWorkspaceTabStub } from '@/features/staff/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a staff activities view', () => {
  const stubs = {
    PageTitle: PageTitleStub,
    MyWorkspaceTab: MyWorkspaceTabStub,
  }
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesView>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(ActivitiesView, { global: { stubs } })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Ma bibliothèque d\'activités')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités' }
      ])
    })

    BddTest().then('it should render MyWorkspaceTab', () => {
      expect(wrapper.findComponent({ name: 'MyWorkspaceTab' }).exists()).toBe(true)
    })
  })
})
