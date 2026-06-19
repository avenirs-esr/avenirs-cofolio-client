import type { VueWrapper } from '@vue/test-utils'
import { ICONS } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof StaffNavigation>(StaffNavigation, { global: { stubs } })
    })

    BddTest().then('it should render AvNavigation component', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      expect(avNavigation.exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct propertie', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[0]).toMatchObject({
        text: 'ACCUEIL',
        to: expect.objectContaining({ name: 'staff-home' }),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct propertie', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[1]).toMatchObject({
        text: 'BIBLIOTHÈQUE DES ACTIVITÉS',
        to: expect.objectContaining({ name: 'staff-activities' }),
        icon: ICONS.ACTIVITY,
      })
    })

    BddTest().then('it should include student tracking menu with feedback sub item', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[2]).toMatchObject({
        title: 'SUIVI DES APPRENANTS',
      })

      expect(navItems[2].links).toHaveLength(1)

      expect(navItems[2].links[0]).toMatchObject({
        text: 'Toutes mes demandes de feedback',
        to: expect.objectContaining({ name: 'staff-student-feedbacks' }),
        icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      })
    })
  })
})
