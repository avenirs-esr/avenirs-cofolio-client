import SkillsViewTabs from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a skills tab switcher', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsViewTabs>>

  const stubs = {
    AvTab: {
      name: 'AvTab',
      props: ['title', 'icon'],
      template: '<div class="av-tab-stub"><slot /></div>'
    },
    RouterLink: RouterLinkStub,
    SkillsViewEducationTab: {
      name: 'SkillsViewEducationTab',
      template: '<div class="skills-view-education-tab-stub" />'
    },
    SkillsViewOtherTab: {
      name: 'SkillsViewOtherTab',
      template: '<div class="skills-view-other-tab-stub" />'
    }
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount<typeof SkillsViewTabs>(SkillsViewTabs, {
      global: {
        stubs,
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient() }]]
      }
    })
  })

  BddTest().when('the skills tab switcher is mounted', () => {
    BddTest().then('it should render two tabs', () => {
      const tabs = wrapper.findAll('.fr-tabs__tab')
      expect(tabs).toHaveLength(2)
      expect(tabs[0].text()).toBe('Les compétences de mes formations (terminées et en cours)')
      expect(tabs[1].text()).toBe('Mes autres compétences')
    })

    BddTest().then('it should render with ams list tab selected', () => {
      const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
      expect(selectedTab.exists()).toBe(true)
      expect(selectedTab.text()).toBe('Les compétences de mes formations (terminées et en cours)')
    })

    BddTest().then('it should render SkillsViewEducationTab component in first tab', () => {
      const educationTab = wrapper.find('.skills-view-education-tab-stub')
      expect(educationTab.exists()).toBe(true)
    })

    BddTest().then('it should render SkillsViewOtherTab component in second tab', () => {
      const otherTab = wrapper.find('.skills-view-other-tab-stub')
      expect(otherTab.exists()).toBe(true)
    })

    BddTest().then('it should have icons for both tabs', () => {
      const icons = wrapper.findAllComponents({ name: 'AvIcon' })
      expect(icons).toHaveLength(2)
    })
  })

  BddTest().when('user interacts with tabs', () => {
    BddTest().then('it should switch to second tab when clicked', async () => {
      const tabs = wrapper.findAll('.fr-tabs__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Mes autres compétences')
    })

    BddTest().then('it should switch back to first tab when clicked', async () => {
      const tabs = wrapper.findAll('.fr-tabs__tab')

      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      await tabs[0].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Les compétences de mes formations (terminées et en cours)')
    })
  })
})
