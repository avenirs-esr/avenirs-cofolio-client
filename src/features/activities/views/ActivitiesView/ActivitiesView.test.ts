import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import ActivitiesView from '@/features/activities/views/ActivitiesView/ActivitiesView.vue'
import { MyWorkspaceTabStub } from '@/features/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.stub'
import { StaffAllActivitiesTabStub } from '@/features/activities/views/ActivitiesView/components/StaffAllActivitiesTab/StaffAllActivitiesTab.stub'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'

const routeQueryValue = ref<string>('MY_WORKSPACE')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

BddTest().given('a staff activities view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesView>>

  const stubs = {
    AvTab: AvTabStub,
    AvTabs: AvTabsStub,
    MyWorkspaceTab: MyWorkspaceTabStub,
    PageTitle: PageTitleStub,
    StaffAllActivitiesTab: StaffAllActivitiesTabStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'MY_WORKSPACE'
    wrapper = mount(ActivitiesView, { global: { stubs } })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Ma bibliothèque d\'activités')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités' },
      ])
    })

    BddTest().then('it should render AvTabs component', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.exists()).toBe(true)
    })
    BddTest().then('it should render the workspace tab by default', () => {
      const activeTab = wrapper.findComponent(AvTabStub)

      expect(activeTab.exists()).toBe(true)
      expect(activeTab.props('title')).toBe('Mon espace de travail')
      expect(activeTab.props('icon')).toBe(RI_ICONS.BOOK_SHELF_LINE)
    })

    BddTest().then('it should render MyWorkspaceTab component in workspace tab', () => {
      const workspace = wrapper.findComponent(MyWorkspaceTabStub)
      expect(workspace.exists()).toBe(true)
    })

    BddTest().then('it should render StaffAllActivitiesTab component when all activities tab is active', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      const activeTab = wrapper.findComponent(AvTabStub)

      expect(activeTab.exists()).toBe(true)
      expect(activeTab.props('title')).toBe('Toutes les activités publiées')
      expect(activeTab.props('icon')).toBe(MDI_ICONS.STOREFRONT_OUTLINE)

      const allActivities = wrapper.findComponent(StaffAllActivitiesTabStub)
      expect(allActivities.exists()).toBe(true)
    })
  })
})
