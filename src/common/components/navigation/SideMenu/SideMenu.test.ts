import type { VueWrapper } from '@vue/test-utils'
import SideMenu, { type SideMenuProps } from '@/common/components/navigation/SideMenu/SideMenu.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

const AvSideMenuStub = defineComponent({
  name: 'AvSideMenu',
  props: ['collapsed', 'collapseButtonAriaLabel', 'expandButtonAriaLabel'],
  emits: ['update:collapsed'],
  template: `<div
    class="av-side-menu-stub"
    :data-collapse-label="collapseButtonAriaLabel"
    :data-expand-label="expandButtonAriaLabel"
  />`
})

BddTest().given('a SideMenu component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SideMenu>>

  const stubs = { AvSideMenu: AvSideMenuStub }

  BddTest().when('the component is mounted', () => {
    const props: SideMenuProps = {}

    beforeEach(() => {
      wrapper = mount(SideMenu, { props, global: { stubs } })
    })

    BddTest().then('it should render an AvSideMenu with the translated collapseButtonAriaLabel', () => {
      expect(wrapper.find('.av-side-menu-stub').attributes('data-collapse-label')).toBe('Réduire le menu')
    })

    BddTest().then('it should render an AvSideMenu with the translated expandButtonAriaLabel', () => {
      expect(wrapper.find('.av-side-menu-stub').attributes('data-expand-label')).toBe('Déplier le menu')
    })

    BddTest().and('the user clicks the collapse button', () => {
      beforeEach(() => {
        wrapper.findComponent(AvSideMenuStub).vm.$emit('update:collapsed', true)
      })

      BddTest().then('it should emit an update:collapsed event with the new collapsed state', () => {
        expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
      })
    })
  })
})
