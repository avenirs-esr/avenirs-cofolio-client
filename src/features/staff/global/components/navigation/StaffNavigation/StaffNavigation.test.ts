import type { VueWrapper } from '@vue/test-utils'
import { ICONS } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import router from '@/router'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a staff navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountDefault = async () => {
    const wrapper = mountComponent(StaffNavigation, {
      global: {
        stubs,
        plugins: [router],
        provide: {
          [registerNavigationLinkKey]: vi.fn()
        }
      },
    })

    await wrapper.vm.$nextTick()
    return wrapper
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountDefault()
    })

    BddTest().then('it should render AvNavigation component', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      expect(avNavigation.exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[0]).toMatchObject({
        text: 'ACCUEIL',
        to: expect.objectContaining({ name: 'staff-home' }),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[1]).toMatchObject({
        text: 'BIBLIOTHÈQUE DES ACTIVITÉS',
        to: expect.objectContaining({ name: 'staff-activities' }),
        icon: ICONS.ACTIVITY,
      })
    })

    BddTest().then('it should include student tracking menu with correct title', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[2]).toMatchObject({
        title: 'SUIVI DES APPRENANTS',
      })
    })

    BddTest().then('it should include feedback link in student tracking menu', () => {
      const avNavigation = wrapper.findComponent(AvNavigationStub)
      const navItems = avNavigation.props('navItems')

      expect(navItems[2].links).toHaveLength(1)

      expect(navItems[2].links[0]).toMatchObject({
        text: 'Toutes mes demandes de feedback',
        to: expect.objectContaining({ name: 'staff-student-tracking-feedbacks' }),
        icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      })
    })
  })
})
