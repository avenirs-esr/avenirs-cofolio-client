import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'
import { ICONS, ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import router from '@/router'

const SKILLS_HEADER = 'MES COMPÉTENCES'
const ACTIVITIES_HEADER = 'MES ACTIVITÉS'
const HOME = 'ACCUEIL'

const mockInaccessibleRoutes = ref<{ name: string }[]>([])

vi.mock('@/common/utils/route/access/route-access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/route/access/route-access')>()
  return {
    ...actual,
    canAccessRoute: (route: { name: string }) => !mockInaccessibleRoutes.value.some(({ name }) => name === route.name)
  }
})

BddTest().given('a student navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNavigation>>

  const stubs = {
    AvNavigation: AvNavigationStub
  }

  const mountWith = async (inaccessibleRoutes: { name: string }[] = []) => {
    vi.clearAllMocks()

    mockInaccessibleRoutes.value = inaccessibleRoutes

    wrapper = mountComponent(StudentNavigation, {
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
  const getNavItemIds = () => getNavItems().map(navItem => navItem.id)
  const getNavItem = (navItemIndex: number) => getNavItems()[navItemIndex]

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
        to: expect.objectContaining(ROUTES.STUDENT.HOME),
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      expect(getNavItem(1)).toMatchObject({
        text: ACTIVITIES_HEADER,
        to: expect.objectContaining(ROUTES.STUDENT.ACTIVITIES),
        icon: ICONS.ACTIVITY,
      })
    })

    BddTest().then('it should include skills navigation item with correct properties', () => {
      expect(getNavItem(2)).toMatchObject({
        text: SKILLS_HEADER,
        to: expect.objectContaining(ROUTES.STUDENT.SKILLS),
        icon: ICONS.SKILLS,
      })
    })
  })

  BddTest().when('the navigation is mounted by a user who cannot access the activities page', () => {
    beforeEach(async () => {
      await mountWith([ROUTES.STUDENT.ACTIVITIES])
    })

    BddTest().then('it should include every item but the activities one', () => {
      expect(getNavItemIds()).toEqual(['nav-home', 'nav-skills', 'nav-life-project-menu', 'nav-tools-menu'])
    })
  })

  BddTest().when('the navigation is mounted by a user who cannot access one of the pages of a menu', () => {
    beforeEach(async () => {
      await mountWith([ROUTES.STUDENT.TOOLS_KIT])
    })

    BddTest().then('it should only include the links of the menu leading to a page the user can access', () => {
      expect(getNavItems()).toContainEqual(expect.objectContaining({
        id: 'nav-tools-menu',
        links: [expect.objectContaining({ to: ROUTES.STUDENT.TOOLS_TRACES })],
      }))
    })
  })

  BddTest().when('the navigation is mounted by a user who can only access the activities page', () => {
    beforeEach(async () => {
      await mountWith([
        ROUTES.STUDENT.SKILLS,
        ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
        ROUTES.STUDENT.BUILD_PROJECT,
        ROUTES.STUDENT.TOOLS_TRACES,
        ROUTES.STUDENT.TOOLS_KIT,
      ])
    })

    BddTest().then('it should only include the home and activities items, leaving out the menus without links', () => {
      expect(getNavItemIds()).toEqual(['nav-home', 'nav-activities'])
    })
  })
})
