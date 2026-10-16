import type { VueWrapper } from '@vue/test-utils'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import router from '@/router'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

// Named after their i18n key, under staff.global.navigation.tabs
const ACTIVITIES_HEADER = 'BIBLIOTHÈQUE DES ACTIVITÉS'
const ADMIN_GROUPS = 'Groupes'
const ADMIN_HEADER = 'ADMINISTRATION'
const ADMIN_SKILLS = 'Compétences'
const ADMIN_USERS = 'Utilisateurs'
const HOME = 'ACCUEIL'
const STUDENT_FEEDBACKS = 'Toutes mes demandes de feedback'
const STUDENT_TRACKING = 'SUIVI DES APPRENANTS'

const STAFF_ROLES = [ERole.ROLE_STAFF]
const STAFF_ADMIN_ROLES = [ERole.ROLE_STAFF, ERole.ROLE_ADMIN]

const mockRoles = ref<ERole[]>([])

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    roles: mockRoles
  })
}))

BddTest().given('a staff navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountWith = async (roles: ERole[] = STAFF_ROLES) => {
    vi.clearAllMocks()
    mockRoles.value = roles

    wrapper = mountComponent(StaffNavigation, {
      global: {
        stubs,
        plugins: [router],
        provide: {
          [registerNavigationLinkKey]: vi.fn()
        }
      },
    })

    await wrapper.vm.$nextTick()
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
      await mountWith()
    })

    BddTest().then('it should render AvNavigation component', () => {
      expect(getAvNavigation().exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      expect(getNavItem(0)).toMatchObject({
        text: HOME,
        to: expect.objectContaining({ name: 'staff-home' }),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      expect(getNavItem(1)).toMatchObject({
        text: ACTIVITIES_HEADER,
        to: expect.objectContaining({ name: 'staff-activities' }),
        icon: ICONS.ACTIVITY,
      })
    })

    BddTest().then('it should include student tracking menu with correct title', () => {
      expect(getNavItem(2)).toMatchObject({
        title: STUDENT_TRACKING,
      })
    })

    BddTest().then('it should include feedback link in student tracking menu', () => {
      const links = getNavItemLinks(2)

      expect(links).toHaveLength(1)

      expect(links![0]).toMatchObject({
        text: STUDENT_FEEDBACKS,
        to: expect.objectContaining({ name: 'staff-student-tracking-feedbacks' }),
        icon: ICONS.FEEDBACK,
      })
    })

    BddTest().then('it should not include the admin menu', () => {
      expect(getNavItems()).toHaveLength(3)
    })
  })

  BddTest().when('the component is mounted while the user is an admin', () => {
    beforeEach(async () => {
      await mountWith(STAFF_ADMIN_ROLES)
    })

    BddTest().then('it should include the admin menu with correct title and correct amount of links', () => {
      expect(getNavItem(3)).toMatchObject({
        title: ADMIN_HEADER,
      })

      expect(getNavItemLinks(3)).toHaveLength(3)
    })

    BddTest().then('it should include institution users link in admin menu', () => {
      expect(getNavItemLinks(3)![0]).toMatchObject({
        text: ADMIN_USERS,
        to: expect.objectContaining({ name: 'staff-admin-users' }),
        icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      })
    })

    BddTest().then('it should include institution groups link in admin menu', () => {
      expect(getNavItemLinks(3)![1]).toMatchObject({
        text: ADMIN_GROUPS,
        to: expect.objectContaining({ name: 'staff-admin-groups' }),
        icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      })
    })

    BddTest().then('it should include institution skills link in admin menu', () => {
      expect(getNavItemLinks(3)![2]).toMatchObject({
        text: ADMIN_SKILLS,
        to: expect.objectContaining({ name: 'staff-admin-skills' }),
        icon: ICONS.SKILLS,
      })
    })
  })
})
