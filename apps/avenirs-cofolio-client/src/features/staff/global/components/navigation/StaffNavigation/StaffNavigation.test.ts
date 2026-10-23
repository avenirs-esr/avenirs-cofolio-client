import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ICONS, ROUTES } from '@/common/constants'
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

const ADMIN_ROUTES = [
  ROUTES.STAFF.ADMIN.USERS,
  ROUTES.STAFF.ADMIN.GROUPS,
  ROUTES.STAFF.ADMIN.SKILLS
]

const mockInaccessibleRoutes = ref<{ name: string }[]>([])

vi.mock('@/common/composables/use-can-access-route/use-can-access-route', () => ({
  useCanAccessRoute: (route: { name: string }) => computed(() => !mockInaccessibleRoutes.value.some(({ name }) => name === route.name))
}))

BddTest().given('a staff navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountWith = async (inaccessibleRoutes: { name: string }[] = []) => {
    vi.clearAllMocks()
    mockInaccessibleRoutes.value = inaccessibleRoutes

    wrapper = mountComponent(StaffNavigation, {
      global: {
        stubs,
        plugins: [router],
        provide: {
          [registerNavigationLinkKey]: vi.fn()
        }
      },
    })

    await router.isReady()
    await wrapper.vm.$nextTick()
  }

  const getAvNavigation = () => wrapper.findComponent(AvNavigationStub)
  const getNavItems = () => getAvNavigation().props('navItems')
  const getNavItem = (navItemIndex: number) => getNavItems()[navItemIndex]
  const getNavItemLinks = (navItemIndex: number) => {
    const navItem = getNavItem(navItemIndex)
    return 'links' in navItem ? navItem.links : []
  }

  BddTest().when('the navigation is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render AvNavigation component', () => {
      expect(getAvNavigation().exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      expect(getNavItem(0)).toMatchObject({
        text: HOME,
        to: expect.objectContaining(ROUTES.STAFF.HOME),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      expect(getNavItem(1)).toMatchObject({
        text: ACTIVITIES_HEADER,
        to: expect.objectContaining(ROUTES.STAFF.ACTIVITIES),
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
        to: expect.objectContaining(ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS),
        icon: ICONS.FEEDBACK,
      })
    })

    BddTest().then('it should include the admin menu', () => {
      expect(getNavItems()).toHaveLength(4)
    })
  })

  BddTest().when('the component is mounted while the user can access every page', () => {
    beforeEach(async () => {
      await mountWith([])
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
        to: expect.objectContaining(ROUTES.STAFF.ADMIN.USERS),
        icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      })
    })

    BddTest().then('it should include institution groups link in admin menu', () => {
      expect(getNavItemLinks(3)![1]).toMatchObject({
        text: ADMIN_GROUPS,
        to: expect.objectContaining(ROUTES.STAFF.ADMIN.GROUPS),
        icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      })
    })

    BddTest().then('it should include institution skills link in admin menu', () => {
      expect(getNavItemLinks(3)![2]).toMatchObject({
        text: ADMIN_SKILLS,
        to: expect.objectContaining(ROUTES.STAFF.ADMIN.SKILLS),
        icon: ICONS.SKILLS,
      })
    })
  })

  BddTest().when('the component is mounted while the user cannot access some of the admin pages', () => {
    beforeEach(async () => {
      await mountWith([ROUTES.STAFF.ADMIN.GROUPS])
    })

    BddTest().then('it should only include the links of the admin menu leading to a page the user can access', () => {
      expect(getNavItemLinks(3)).toEqual([
        expect.objectContaining({ to: ROUTES.STAFF.ADMIN.USERS }),
        expect.objectContaining({ to: ROUTES.STAFF.ADMIN.SKILLS }),
      ])
    })
  })

  BddTest().when('the component is mounted by a user who cannot access the admin pages', () => {
    beforeEach(async () => {
      await mountWith(ADMIN_ROUTES)
    })

    BddTest().then('it should not include the admin menu', () => {
      const items = getNavItems()
      expect(items).toHaveLength(3)
      expect(items.some(navItem => navItem.id === 'nav-admin-menu')).toBe(false)
    })
  })

  BddTest().when('the component is mounted by a user who cannot access the activities page', () => {
    beforeEach(async () => {
      await mountWith([
        ROUTES.STAFF.ACTIVITIES,
        ...ADMIN_ROUTES
      ])
    })

    BddTest().then('it should not include the activities navigation item', () => {
      expect(getNavItems().map(navItem => navItem.id)).toEqual(['nav-home', 'nav-student-tracking-menu'])
    })
  })

  BddTest().when('the component is mounted by a user who cannot access the activities, feedbacks and admin pages', () => {
    beforeEach(async () => {
      await mountWith([
        ROUTES.STAFF.ACTIVITIES,
        ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
        ...ADMIN_ROUTES
      ])
    })

    BddTest().then('it should only include the home navigation item', () => {
      expect(getNavItems().map(navItem => navItem.id)).toEqual(['nav-home'])
    })
  })
})
