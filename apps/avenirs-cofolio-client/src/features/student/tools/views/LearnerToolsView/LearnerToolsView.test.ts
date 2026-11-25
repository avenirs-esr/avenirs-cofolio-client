import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub, ToolTabsStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import LearnerToolsView from '@/features/student/tools/views/LearnerToolsView/LearnerToolsView.vue'

BddTest().given('a learner tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LearnerToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ToolTabs: ToolTabsStub,
  }

  const mountView = () => {
    wrapper = mount(LearnerToolsView, {
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getToolTabs = () => wrapper.findComponent(ToolTabsStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the tool tabs', () => {
      expect(getToolTabs().exists()).toBe(true)
    })

    BddTest().then('it should render the tool tabs without any base route names', () => {
      expect(getToolTabs().props('nationalBaseRouteName')).toBeUndefined()
      expect(getToolTabs().props('regionalBaseRouteName')).toBeUndefined()
      expect(getToolTabs().props('localBaseRouteName')).toBeUndefined()
    })
  })
})
