import SkillsViewTabs from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('skillsViewTabs', () => {
  describe('given a skills tab switcher', () => {
    let wrapper: ReturnType<typeof mount<typeof SkillsViewTabs>>

    beforeEach(() => {
      wrapper = mount<typeof SkillsViewTabs>(SkillsViewTabs)
    })

    describe('when the skills tab switcher is mounted', () => {
      it('then it should render two tabs', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs).toHaveLength(2)
        expect(tabs[0].text()).toBe('Les compétences de mes formations (validées et en cours)')
        expect(tabs[1].text()).toBe('Mes autres compétences')
      })

      it('then it should render with ams list tab selected', () => {
        const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
        expect(selectedTab.exists()).toBe(true)
        expect(selectedTab.text()).toBe('Les compétences de mes formations (validées et en cours)')
      })
    })
  })
})
