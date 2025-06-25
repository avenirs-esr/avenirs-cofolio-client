import StudentNavigation from '@/features/student/components/StudentNavigation/StudentNavigation.vue'
import { useStudentApcAccess } from '@/features/student/composables'
import { studentEducationAmsRoute, studentEducationSkillsRoute } from '@/features/student/routes'
import router from '@/router'
import { registerNavigationLinkKey } from '@/ui'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

vi.mock('@/features/student/composables', () => ({
  useStudentApcAccess: vi.fn(),
}))

describe('studentNavigation', () => {
  const mockUseStudentApcAccess = vi.mocked(useStudentApcAccess)
  const succeedMyEducationMenuTitle = 'RÉUSSIR MA FORMATION'

  const mountComponent = async () => {
    const wrapper = mount(StudentNavigation, {
      global: {
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

  describe('when APC is not visible', () => {
    beforeEach(() => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => false),
        showApcGenericInfoPage: computed(() => false),
        showApcSubmenus: computed(() => false),
      })
    })

    it('renders AvNavigation component', async () => {
      const wrapper = await mountComponent()

      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      expect(avNavigation.exists()).toBe(true)
    })

    it('generates navigation items without education menu', async () => {
      const wrapper = await mountComponent()

      expect(wrapper.findAll('.fr-nav__item')).toHaveLength(3)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(3)
      const hasEducationMenu = navItems.some((item: any) =>
        item.title === succeedMyEducationMenuTitle || item.text === succeedMyEducationMenuTitle
      )
      expect(hasEducationMenu).toBe(false)
    })

    it('includes home navigation item with correct properties', async () => {
      const wrapper = await mountComponent()

      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const homeItem = navItems[0]
      expect(homeItem).toMatchObject({
        text: 'ACCUEIL',
        to: expect.objectContaining({ name: 'student-home' }),
      })
    })
  })

  describe('when APC is visible but submenus are hidden', () => {
    beforeEach(() => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => true),
        showApcGenericInfoPage: computed(() => true),
        showApcSubmenus: computed(() => false),
      })
    })

    it('includes education menu in navigation items', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.findAll('.fr-nav__item')).toHaveLength(4)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')
      expect(navItems).toHaveLength(4)
      const educationItem = navItems.find((item: any) => item.text === succeedMyEducationMenuTitle)
      expect(educationItem).toBeDefined()
    })

    it('does not include education submenus when showApcSubmenus is false', async () => {
      const wrapper = await mountComponent()

      expect(wrapper.findAll('.fr-nav__item')).toHaveLength(4)
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.text === succeedMyEducationMenuTitle)
      expect(educationItem.links).toBeUndefined()
    })
  })

  describe('when APC is visible with submenus', () => {
    beforeEach(() => {
      mockUseStudentApcAccess.mockReturnValue({
        isApcVisible: computed(() => true),
        showApcGenericInfoPage: computed(() => false),
        showApcSubmenus: computed(() => true),
      })
    })

    it('includes education menu with submenus', async () => {
      const wrapper = await mountComponent()
      const succeedMyEducationMenuItems = [
        'Mes compétences',
        'Mes activités de mise en situation'
      ]
      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.title === succeedMyEducationMenuTitle)
      expect(educationItem).toBeDefined()
      expect(educationItem.links).toHaveLength(2)
      const linkTexts = educationItem.links.map((link: any) => link.text)
      expect(linkTexts).toEqual(succeedMyEducationMenuItems)
      const routerLinks = avNavigation.findAllComponents({ name: 'RouterLink' })
      const skillsLink = routerLinks.find(link => link.text().includes(succeedMyEducationMenuItems[0]))
      expect(skillsLink).toBeTruthy()
      expect(skillsLink!.props('to')).toEqual(
        expect.objectContaining({ name: studentEducationSkillsRoute.name })
      )
      const activitiesLink = routerLinks.find(link => link.text().includes(succeedMyEducationMenuItems[1]))
      expect(activitiesLink).toBeTruthy()
      expect(activitiesLink!.props('to')).toEqual(
        expect.objectContaining({ name: studentEducationAmsRoute.name })
      )
    })

    it('does not set education menu "to" property when submenus are shown', async () => {
      const wrapper = await mountComponent()

      const avNavigation = wrapper.findComponent({ name: 'AvNavigation' })
      const navItems = avNavigation.props('navItems')

      const educationItem = navItems.find((item: any) => item.title === succeedMyEducationMenuTitle)
      expect(educationItem.to).toBeUndefined()
    })
  })
})
