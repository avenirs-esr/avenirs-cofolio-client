import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { ActivityLibraryTabStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.stub'
import { AllActivitiesTabStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.stub'
import ProjectActivitiesView from '@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useQueryParamEnum: () => ref(0)
  }
})

BddTest().given('a project activities view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivitiesView>>

  const stubs = {
    PageTitle: PageTitleStub,
    AllActivitiesTab: AllActivitiesTabStub,
    ActivityLibraryTab: ActivityLibraryTabStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(ProjectActivitiesView, {
      global: { stubs }
    })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.props('title')).toBe('Mes activités')
    })

    BddTest().then('it should pass the correct back route', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should pass the correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')

      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mes activités'
      })
    })

    BddTest().then('it should render the all activities tab by default', () => {
      expect(wrapper.findComponent(AllActivitiesTabStub).exists()).toBe(true)
    })
  })

  BddTest().when('the library tab is selected', () => {
    beforeEach(async () => {
      wrapper.findComponent({ name: 'AvTabs' }).vm.$emit('update:modelValue', 1)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should render the activity library tab', () => {
      expect(wrapper.findComponent(ActivityLibraryTabStub).exists()).toBe(true)
    })
  })
})
