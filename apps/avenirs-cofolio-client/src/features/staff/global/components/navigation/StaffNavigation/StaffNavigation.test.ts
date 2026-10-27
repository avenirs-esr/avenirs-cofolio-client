import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import router from '@/router'

const ACTIVITIES_HEADER = 'BIBLIOTHÈQUE DES ACTIVITÉS'
const ADMIN_GROUPS = 'Groupes'
const ADMIN_HEADER = 'ADMINISTRATION'
const ADMIN_SKILLS = 'Compétences'
const ADMIN_USERS = 'Utilisateurs'
const HOME = 'ACCUEIL'
const STUDENT_FEEDBACKS = 'Toutes mes demandes de feedback'
const STUDENT_TRACKING = 'SUIVI DES APPRENANTS'

const ADMIN_MENU_ID = 'nav-admin-menu'

const DEFAULT_ROLES = [ERole.ROLE_STAFF, ERole.ROLE_STAFF_ACTIVITY_VIEWER, ERole.ROLE_STAFF_FEEDBACK_RESPONDER]

const ADMIN_LINK_CASES = [
  {
    requiredRoles: ROUTE_ROLES.STAFF.ADMIN_USERS,
    text: ADMIN_USERS,
    routeName: 'staff-admin-users',
    icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
  },
  {
    requiredRoles: ROUTE_ROLES.STAFF.ADMIN_GROUPS,
    text: ADMIN_GROUPS,
    routeName: 'staff-admin-groups',
    icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
  },
  {
    requiredRoles: ROUTE_ROLES.STAFF.ADMIN_SKILLS,
    text: ADMIN_SKILLS,
    routeName: 'staff-admin-skills',
    icon: ICONS.SKILLS,
  },
]

const mockRoles = ref<ERole[]>([])

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    roles: mockRoles
  })
}))

BddTest().given('a staff navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountWith = async (roles: ERole[] = DEFAULT_ROLES) => {
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
  const getAdminMenu = () => getNavItems().find(navItem => navItem.id === ADMIN_MENU_ID)
  const getAdminMenuLinks = () => {
    const adminMenu = getAdminMenu()
    return adminMenu && 'links' in adminMenu ? adminMenu.links : []
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
  })

  ADMIN_LINK_CASES.forEach(({ requiredRoles, text, routeName, icon }) => {
    requiredRoles.forEach((role) => {
      BddTest().when(`the component is mounted by a user with only the ${role} admin role`, () => {
        beforeEach(async () => {
          await mountWith([...DEFAULT_ROLES, role])
        })

        BddTest().then('it should include the admin menu with correct title', () => {
          expect(getAdminMenu()).toMatchObject({
            title: ADMIN_HEADER,
          })
        })

        BddTest().then(`it should only include the ${routeName} link in admin menu`, () => {
          const links = getAdminMenuLinks()

          expect(links).toHaveLength(1)
          expect(links![0]).toMatchObject({
            text,
            to: expect.objectContaining({ name: routeName }),
            icon,
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted by a user without any admin role', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should not include the admin menu', () => {
      expect(getNavItems()).toHaveLength(3)
      expect(getAdminMenu()).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted by a user without the activities and feedbacks roles', () => {
    beforeEach(async () => {
      await mountWith([ERole.ROLE_STAFF])
    })

    BddTest().then('it should only include the home navigation item', () => {
      expect(getNavItems().map(navItem => navItem.id)).toEqual(['nav-home'])
    })
  })
})
