import { AmsListContainerStub } from '@/features/student/ams/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.stub'
import { AmsPlanningContainerStub } from '@/features/student/ams/views/StudentEducationAmsView/components/AmsPlanningContainer/AmsPlanningContainer.stub'
import AmsViewTabs from '@/features/student/ams/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an ams tab switcher', () => {
  let wrapper: VueWrapper<InstanceType <typeof AmsViewTabs>>

  const stubs = {
    AmsListContainer: AmsListContainerStub,
    AmsPlanningContainer: AmsPlanningContainerStub,
  }

  beforeEach(() => {
    wrapper = mount(AmsViewTabs, { global: { stubs } })
  })

  BddTest().when('the ams planning container is mounted', () => {
    BddTest().then('it should render two tabs', () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')
      expect(tabs).toHaveLength(2)
      expect(tabs[0].text()).toBe('Liste de mes AMS')
      expect(tabs[1].text()).toBe('Planning de mes AMS')
    })

    BddTest().then('it should render with ams list tab selected', () => {
      const selectedTab = wrapper.find('.av-tab-item__tab[aria-selected="true"]')
      expect(selectedTab.exists()).toBe(true)
      expect(selectedTab.text()).toBe('Liste de mes AMS')
    })

    BddTest().then('it should render AmsListContainer in first tab', () => {
      expect(wrapper.find('.ams-list-container').exists()).toBe(true)
    })

    BddTest().then('it should render AmsPlanningContainer in second tab', async () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ams-planning-container').exists()).toBe(true)
    })
  })
})
