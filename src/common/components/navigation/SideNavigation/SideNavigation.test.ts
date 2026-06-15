import type { VueWrapper } from '@vue/test-utils'
import SideNavigation, { type SideNavigationProps } from '@/common/components/navigation/SideNavigation/SideNavigation.vue'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('a SideNavigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SideNavigation>>

  const stubs = { AvSideNavigation: AvSideNavigationStub }

  BddTest().when('the component is mounted', () => {
    const props: SideNavigationProps = { items: [] }

    beforeEach(() => {
      wrapper = mount(SideNavigation, { props, global: { stubs } })
    })

    BddTest().then('it should render an AvSideNavigation with the translated collapseButtonAriaLabel', () => {
      expect(wrapper.findComponent(AvSideNavigationStub).props('collapseButtonAriaLabel')).toBe('Réduire le menu')
    })

    BddTest().then('it should render an AvSideNavigation with the translated expandButtonAriaLabel', () => {
      expect(wrapper.findComponent(AvSideNavigationStub).props('expandButtonAriaLabel')).toBe('Déplier le menu')
    })

    BddTest().and('the user selects an item', () => {
      beforeEach(() => {
        wrapper.findComponent(AvSideNavigationStub).vm.$emit('update:selectedItem', { itemId: 'item1' })
      })

      BddTest().then('it should emit an update:selectedItem event with the selected item', () => {
        expect(wrapper.emitted('update:selectedItem')?.[0]).toEqual([{ itemId: 'item1' }])
      })
    })

    BddTest().and('the user clicks the collapse button', () => {
      beforeEach(() => {
        wrapper.findComponent(AvSideNavigationStub).vm.$emit('update:isSideMenuCollapsed', true)
      })

      BddTest().then('it should emit an update:isSideMenuCollapsed event with the new isSideMenuCollapsed state', () => {
        expect(wrapper.emitted('update:isSideMenuCollapsed')?.[0]).toEqual([true])
      })
    })
  })
})
