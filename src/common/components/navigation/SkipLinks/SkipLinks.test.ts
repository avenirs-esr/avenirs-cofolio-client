import type { VueWrapper } from '@vue/test-utils'
import { AvSkipLinksStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import SkipLinks from '@/common/components/navigation/SkipLinks/SkipLinks.vue'

BddTest().given('a skip links component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkipLinks>>

  const stubs = { AvSkipLinks: AvSkipLinksStub }

  BddTest().when('the component is rendered', () => {
    beforeEach(() => {
      wrapper = mount(SkipLinks, { global: { stubs } })
    })

    BddTest().then('the component should have an aria-label', () => {
      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBe('Accès rapide')
    })

    BddTest().then('the skip links should be rendered', () => {
      const skipLinks = wrapper.findComponent(AvSkipLinksStub)
      expect(skipLinks.exists()).toBe(true)
      expect(skipLinks.props('skipLinks')).toEqual([
        { id: 'main', label: 'Aller au contenu principal' },
        { id: 'footer', label: 'Aller au pied de page' }
      ])
    })
  })
})
