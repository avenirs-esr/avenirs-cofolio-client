import { SideNavigationStub } from '@/common/components/navigation/SideNavigation/SideNavigation.stub'
import { ROUTES } from '@/common/constants'
import PersonalCareerLayout
  from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockReplace = vi.fn()
const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      replace: mockReplace
    }),
    useRoute: () => ({
      name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name
    })
  }
})

BddTest().given('a student academic career layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalCareerLayout>>

  const stubs = {
    SideNavigation: SideNavigationStub,
    AvSelect: AvSelectStub,
    RouterView: { template: '<div class="router-view-stub">RouterView Content</div>' }
  }

  const getSideNavigation = () => wrapper.findComponent(SideNavigationStub)
  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-personal-career-container').exists()).toBe(true)
    })

    BddTest().then('it should render an SideNavigation component', () => {
      expect(getSideNavigation().exists()).toBe(true)
    })

    BddTest().then('it should initialize with side menu expanded', () => {
      expect(getSideNavigation().props('isSideMenuCollapsed')).toBe(false)
    })

    BddTest().then('it should set selected item based on current route', () => {
      expect(getSideNavigation().props('selectedItem')).toEqual({ itemId: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name })
    })

    BddTest().then('it should have 3 navigation items', () => {
      expect(getSideNavigation().props('items')).toHaveLength(2)
    })

    BddTest().then('it should have navigation items with correct structure', () => {
      const items = getSideNavigation().props('items')
      expect(items).toEqual([
        {
          id: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
          label: expect.any(String),
          icon: expect.any(String),
        },
        {
          id: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
          label: expect.any(String),
          icon: expect.any(String),
        }
      ])
    })

    BddTest().then('it should have navigation items with correct French labels', () => {
      const items = getSideNavigation().props('items')
      expect(items![0].label).toContain('Mes formations')
      expect(items![1].label).toContain('Mes expériences')
    })

    BddTest().then('it should render the content area', () => {
      const contentArea = wrapper.find('.student-project-personal-career-container__content')
      expect(contentArea.exists()).toBe(true)
    })

    BddTest().then('it should render the RouterView', () => {
      const routerView = wrapper.find('.router-view-stub')
      expect(routerView.exists()).toBe(true)
    })

    BddTest().and('the side menu collapse button is clicked', () => {
      beforeEach(async () => {
        await getSideNavigation().vm.$emit('update:isSideMenuCollapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should collapse the side navigation', () => {
        expect(getSideNavigation().props('isSideMenuCollapsed')).toBe(true)
      })
    })

    BddTest().and('a navigation item is selected', () => {
      beforeEach(async () => {
        await getSideNavigation().vm.$emit('update:selectedItem', { itemId: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name })
        await flushPromises()
      })

      BddTest().then('it should navigate to the selected route', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name
        })
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      mockIsMobile.value = true
      vi.clearAllMocks()
      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs }
      })
    })

    BddTest().then('it should render an AvSelect component for navigation', () => {
      expect(getAvSelect().exists()).toBe(true)
    })

    BddTest().then('it should not render the SideNavigation component', () => {
      expect(getSideNavigation().exists()).toBe(false)
    })

    BddTest().and('a navigation option is selected from the dropdown', () => {
      beforeEach(async () => {
        await getAvSelect().vm.$emit('update:selectedItem', { itemId: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name })
        await flushPromises()
      })

      BddTest().then('it should navigate to the selected route', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name
        })
      })
    })
  })
})
