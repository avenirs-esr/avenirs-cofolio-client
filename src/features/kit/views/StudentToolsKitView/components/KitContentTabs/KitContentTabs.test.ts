import KitContentTabs from '@/features/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.vue'
import { KitMultimediaContentTabStub } from '@/features/kit/views/StudentToolsKitView/components/KitMultimediaContentTab/KitMultimediaContentTab.stub'
import { KitTextContentTabStub } from '@/features/kit/views/StudentToolsKitView/components/KitTextContentTab/KitTextContentTab.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a kit content tabs', () => {
  let wrapper: VueWrapper<InstanceType<typeof KitContentTabs>>

  const stubs = {
    RouterLink: RouterLinkStub,
    KitTextContentTab: KitTextContentTabStub,
    KitMultimediaContentTab: KitMultimediaContentTabStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(KitContentTabs, { global: { stubs } })
    })

    BddTest().then('it should render two tabs with correct titles', () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')

      expect(tabs).toHaveLength(2)
      expect(tabs[0].text()).toBe('Contenu textuel')
      expect(tabs[1].text()).toBe('Contenu multimédia')
    })

    BddTest().then('it should render the KitTextContentTab in the first tab', () => {
      const textContentTab = wrapper.findComponent(KitTextContentTabStub)
      expect(textContentTab.exists()).toBe(true)
    })

    BddTest().then('it should render the KitMultimediaContentTab in the second tab when selected', async () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const multimediaContentTab = wrapper.findComponent(KitMultimediaContentTabStub)
      expect(multimediaContentTab.exists()).toBe(true)
    })
  })

  BddTest().when('user interacts with tabs', () => {
    beforeEach(() => {
      wrapper = mountComponent(KitContentTabs, { global: { stubs } })
    })

    BddTest().then('it should switch to second tab when clicked', async () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.av-tab-item__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Contenu multimédia')
    })

    BddTest().then('it should switch back to first tab when clicked', async () => {
      const tabs = wrapper.findAll('.av-tab-item__tab')

      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      await tabs[0].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.av-tab-item__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Contenu textuel')
    })
  })
})
