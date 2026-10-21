import type { VueWrapper } from '@vue/test-utils'
import { registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import router from '@/router'

const mockRoles = ref<ERole[]>(Object.values(ERole))

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({ roles: mockRoles })
}))

BddTest().given('a student navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountDefault = async () => {
    const wrapper = mountComponent(StudentNavigation, {
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
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoles.value = Object.values(ERole)
  })

  BddTest().when('the navigation is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountDefault()
    })

    BddTest().then('it should render AvNavigation component', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      expect(avNavigation.exists()).toBe(true)
    })

    BddTest().then('it should generate navigation items', () => {
      expect(wrapper.findAll('.av-nav__item')).toHaveLength(5)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(5)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const homeItem = navItems[0]
      expect(homeItem).toMatchObject({
        text: 'ACCUEIL',
        to: expect.objectContaining({ name: 'student-home' }),
      })
    })

    BddTest().then('it should include activities navigation item with correct properties', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const homeItem = navItems[1]
      expect(homeItem).toMatchObject({
        text: 'MES ACTIVITÉS',
        to: expect.objectContaining(ROUTES.STUDENT.ACTIVITIES),
      })
    })

    BddTest().then('it should include skills navigation item with correct properties', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const homeItem = navItems[2]
      expect(homeItem).toMatchObject({
        text: 'MES COMPÉTENCES',
        to: expect.objectContaining(ROUTES.STUDENT.SKILLS),
      })
    })
  })

  BddTest().when('the navigation is mounted by a user holding only the activities role', () => {
    beforeEach(async () => {
      mockRoles.value = [ERole.ROLE_STUDENT, ERole.ROLE_STUDENT_ACTIVITY]
      wrapper = await mountDefault()
    })

    BddTest().then('it should only include the home and activities items', () => {
      const navItems = wrapper.findComponent({ name: 'AvNavigation' }).props('navItems')
      expect(navItems.map((navItem: { id: string }) => navItem.id)).toEqual(['nav-home', 'nav-activities'])
    })
  })
})
