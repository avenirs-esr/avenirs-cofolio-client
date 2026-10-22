import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import router from '@/router'

const ACTIVITIES_HEADER = 'BIBLIOTHÈQUE DES ACTIVITÉS'
const ADMIN_GROUPS = 'Groupes'
const ADMIN_HEADER = 'ADMINISTRATION'
const ADMIN_INSTITUTIONS = 'Établissements'
const ADMIN_PERMISSIONS = 'Permissions'
const ADMIN_PROGRAMS = 'Formations'
const ADMIN_ROLES = 'Rôles'
const ADMIN_SKILLS = 'Compétences'
const ADMIN_TOOLS = 'Outils'
const ADMIN_USERS = 'Utilisateurs'
const HOME = 'ACCUEIL'
const STUDENT_FEEDBACKS = 'Toutes mes demandes de feedback'
const STUDENT_TRACKING = 'SUIVI DES APPRENANTS'

const DEFAULT_ROLES = [ERole.ROLE_STAFF, ERole.ROLE_STAFF_ACTIVITY_VIEWER, ERole.ROLE_STAFF_FEEDBACK_RESPONDER]

const navAdminItems = {
  institutions: { text: ADMIN_INSTITUTIONS, icon: MDI_ICONS.BUILDING },
  users: { text: ADMIN_USERS, icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE },
  programs: { text: ADMIN_PROGRAMS, icon: ICONS.PROGRAMS },
  groups: { text: ADMIN_GROUPS, icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE },
  skills: { text: ADMIN_SKILLS, icon: ICONS.SKILLS },
  tools: { text: ADMIN_TOOLS, icon: MDI_ICONS.TOOLS },
  roles: { text: ADMIN_ROLES, icon: MDI_ICONS.BADGE_ACCOUNT_HORIZONTAL_OUTLINE },
  permissions: { text: ADMIN_PERMISSIONS, icon: MDI_ICONS.LOCK_OUTLINE },
}

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

  const expectNavItemLink = (
    tabIndex: number,
    itemIndex: number,
    name: string,
    text: string,
    icon: string
  ) => {
    expect(getNavItemLinks(tabIndex)![itemIndex]).toMatchObject({
      text,
      to: expect.objectContaining({ name }),
      icon
    })
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
    const expectedItems = Object.entries(navAdminItems)

    beforeEach(async () => {
      await mountWith([...DEFAULT_ROLES, ERole.ROLE_ADMIN])
    })

    BddTest().then('it should include the admin menu with correct title and correct amount of links', () => {
      expect(getNavItem(3)).toMatchObject({
        title: ADMIN_HEADER,
      })

      expect(getNavItemLinks(3)).toHaveLength(expectedItems.length)
    })

    expectedItems.forEach(([name, { text, icon }], index) => {
      BddTest().then(`it should include ${name} link in admin menu`, () => {
        expectNavItemLink(3, index, `staff-admin-${name}`, text, icon)
      })
    })
  })

  BddTest().when('the component is mounted by a user without the ADMIN role', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should not include the admin menu', () => {
      const items = getNavItems()
      expect(items).toHaveLength(3)
      expect(items.some(navItem => navItem.id === 'nav-admin-menu')).toBe(false)
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
