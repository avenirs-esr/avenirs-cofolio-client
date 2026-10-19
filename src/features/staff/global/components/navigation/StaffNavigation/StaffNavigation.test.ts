import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import router from '@/router'

const { mockRoles } = vi.hoisted(() => ({
  mockRoles: { value: [] as ERole[] },
}))

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    roles: mockRoles.value,
  }),
}))

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

  const getAvNavigation = () => wrapper.findComponent(AvNavigationStub)
  const getNavItems = () => getAvNavigation().props('navItems')
  const getNavItem = (navItemIndex: number) => getNavItems()[navItemIndex]
  const getNavItemLinks = (navItemIndex: number) => {
    const navItem = getNavItem(navItemIndex)
    return 'links' in navItem ? navItem.links : []
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      mockRoles.value = [ERole.ROLE_ADMIN]
      wrapper = await mountDefault()
    })

    BddTest().then('it should render AvNavigation component', () => {
      expect(getAvNavigation().exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      expect(getNavItem(0)).toMatchObject({
        text: 'ACCUEIL',
        to: expect.objectContaining({ name: 'staff-home' }),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      expect(getNavItem(1)).toMatchObject({
        text: 'BIBLIOTHÈQUE DES ACTIVITÉS',
        to: expect.objectContaining({ name: 'staff-activities' }),
        icon: ICONS.ACTIVITY,
      })
    })

    BddTest().then('it should include student tracking menu with correct title', () => {
      expect(getNavItem(2)).toMatchObject({
        title: 'SUIVI DES APPRENANTS',
      })
    })

    BddTest().then('it should include feedback link in student tracking menu', () => {
      const links = getNavItemLinks(2)

      expect(links).toHaveLength(1)

      expect(links![0]).toMatchObject({
        text: 'Toutes mes demandes de feedback',
        to: expect.objectContaining({ name: 'staff-student-tracking-feedbacks' }),
        icon: ICONS.FEEDBACK,
      })
    })

    BddTest().then('it should include the admin menu with correct title and correct amount of links', () => {
      expect(getNavItem(3)).toMatchObject({
        title: 'ADMINISTRATION',
      })

      expect(getNavItemLinks(3)).toHaveLength(3)
    })

    BddTest().then('it should include institution users link in admin menu', () => {
      expect(getNavItemLinks(3)![0]).toMatchObject({
        text: 'Utilisateurs',
        to: expect.objectContaining({ name: 'staff-admin-users' }),
        icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      })
    })

    BddTest().then('it should include institution groups link in admin menu', () => {
      expect(getNavItemLinks(3)![1]).toMatchObject({
        text: 'Groupes',
        to: expect.objectContaining({ name: 'staff-admin-groups' }),
        icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      })
    })

    BddTest().then('it should include institution skills link in admin menu', () => {
      expect(getNavItemLinks(3)![2]).toMatchObject({
        text: 'Compétences',
        to: expect.objectContaining({ name: 'staff-admin-skills' }),
        icon: ICONS.SKILLS,
      })
    })
  })

  BddTest().when('the component is mounted by a user without the ADMIN role', () => {
    beforeEach(async () => {
      mockRoles.value = [ERole.ROLE_STAFF]
      wrapper = await mountDefault()
    })

    BddTest().then('it should not include the admin menu', () => {
      const items = getNavItems()
      expect(items).toHaveLength(3)
      expect(items.some(navItem => navItem.id === 'nav-admin-menu')).toBe(false)
    })
  })
})
