import { ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import router from '@/router'
import { registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

vi.mock('@/features/student/global/composables/use-student-apc-access/use-student-apc-access', () => ({
  useStudentApcAccess: vi.fn(),
}))

BddTest().given('a student navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mockUseStudentApcAccess = vi.mocked(useStudentApcAccess)
  const succeedMyEducationMenuTitle = 'RÉUSSIR MA FORMATION'

  const mountComponent = async () => {
    const wrapper = mount(StudentNavigation, {
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

  BddTest().when('APC is not visible', () => {
    beforeEach(async () => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => false),
        showApcGenericInfoPage: computed(() => false),
        showApcSubmenus: computed(() => false),
      })

      wrapper = await mountComponent()
    })

    BddTest().then('it should render AvNavigation component', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      expect(avNavigation.exists()).toBe(true)
    })

    BddTest().then('it should generate navigation items without education menu', () => {
      expect(wrapper.findAll('.av-nav__item')).toHaveLength(3)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(3)
      const hasEducationMenu = navItems.some((item: any) =>
        item.title === succeedMyEducationMenuTitle || item.text === succeedMyEducationMenuTitle
      )
      expect(hasEducationMenu).toBe(false)
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

  BddTest().when('APC is visible but submenus are hidden', () => {
    beforeEach(async () => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => true),
        showApcGenericInfoPage: computed(() => true),
        showApcSubmenus: computed(() => false),
      })

      wrapper = await mountComponent()
    })

    BddTest().then('it should include education menu in navigation items', () => {
      expect(wrapper.findAll('.av-nav__item')).toHaveLength(4)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(4)
      const educationItem = navItems.find((item: any) => item.text === succeedMyEducationMenuTitle)
      expect(educationItem).toBeDefined()
    })

    BddTest().then('it should not include education submenus when showApcSubmenus is false', () => {
      expect(wrapper.findAll('.av-nav__item')).toHaveLength(4)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.text === succeedMyEducationMenuTitle)
      expect(educationItem.links).toBeUndefined()
    })
  })

  BddTest().when('APC is visible with submenus', () => {
    beforeEach(async () => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => true),
        showApcGenericInfoPage: computed(() => false),
        showApcSubmenus: computed(() => true),
      })

      wrapper = await mountComponent()
    })

    BddTest().then('it should include education menu with submenus', () => {
      const succeedMyEducationMenuItems = [
        'Mes compétences',
      ]
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.title === succeedMyEducationMenuTitle)
      expect(educationItem).toBeDefined()
      expect(educationItem.links).toHaveLength(1)
      const linkTexts = educationItem.links.map((link: any) => link.text)
      expect(linkTexts).toEqual(succeedMyEducationMenuItems)
      const routerLinks = avNavigation.findAllComponents({ name: 'RouterLink' })
      const skillsLink = routerLinks.find(link => link.text().includes(succeedMyEducationMenuItems[0]))
      expect(skillsLink).toBeTruthy()
      expect(skillsLink!.props('to')).toEqual(ROUTES.STUDENT.EDUCATION_SKILLS)
    })

    BddTest().then('it should not set education menu "to" property when submenus are shown', () => {
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.title === succeedMyEducationMenuTitle)
      expect(educationItem.to).toBeUndefined()
    })
  })
})
