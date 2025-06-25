import AmsViewTabs from '@/features/student/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('amsViewTabs', () => {
  describe('given an ams tab switcher', () => {
    let wrapper: ReturnType<typeof mount<typeof AmsViewTabs>>

    const stubs = {
      AmsListContainer: { name: 'AmsListContainer', template: '<div class="ams-list-container" />' },
      AmsPlanningContainer: { name: 'AmsPlanningContainer', template: '<div class="ams-planning-container" />' },
    }

    beforeEach(() => {
      wrapper = mount<typeof AmsViewTabs>(AmsViewTabs, { global: { stubs } })
    })

    describe('when the ams planning container is mounted', () => {
      it('then it should render two tabs and their content', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs).toHaveLength(2)
        expect(tabs[0].text()).toBe('Liste de mes AMS')
        expect(wrapper.find('.ams-list-container').exists()).toBe(true)
        expect(tabs[1].text()).toBe('Planning de mes AMS')
        expect(wrapper.find('.ams-planning-container').exists()).toBe(true)
      })

      it('then it should render with ams list tab selected', () => {
        const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
        expect(selectedTab.exists()).toBe(true)
        expect(selectedTab.text()).toBe('Liste de mes AMS')
      })
    })
  })
})
