import type { VueWrapper } from '@vue/test-utils'
import { ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import router from '@/router'
import { registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

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

    await wrapper.vm.$nextTick()
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
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
      expect(wrapper.findAll('.av-nav__item')).toHaveLength(3)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(3)
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
  })

  BddTest().when('current route is inside personal career', () => {
    beforeEach(async () => {
      await router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER.name })
      wrapper = await mountDefault()
    })

    BddTest().then('it should keep the experiences link on the current route full path', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const projectMenu = navItems.find((item: any) =>
        item.links?.some((link: any) => link.to?.name === ROUTES.STUDENT.PROJECT_SKILLS.name)
      )

      const experiencesLink = projectMenu.links[1]

      expect(experiencesLink.to).toBe(router.currentRoute.value.fullPath)
    })
  })
})
