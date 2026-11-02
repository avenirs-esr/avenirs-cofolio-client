import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { SideNavigationStub } from '@/common/components/navigation/SideNavigation/SideNavigation.stub'
import { ROUTES } from '@/common/constants'
import PersonalCareerLayout
  from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.vue'

const mockReplace = vi.fn()
const mockIsMobile = ref(false)
const route = reactive<{ name: string }>({
  name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
})

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    }),
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      replace: mockReplace,
    }),
    useRoute: () => route,
  }
})

BddTest().given('a student academic career layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalCareerLayout>>

  const stubs = {
    SideNavigation: SideNavigationStub,
    AvSelect: AvSelectStub,
    RouterView: { template: '<div class="router-view-stub">RouterView Content</div>' },
  }

  const getSideNavigation = () => wrapper.findComponent(SideNavigationStub)
  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      route.name = ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name
      mockIsMobile.value = false

      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-personal-career-container').exists()).toBe(true)
    })

    BddTest().then('it should render a SideNavigation component', () => {
      expect(getSideNavigation().exists()).toBe(true)
    })

    BddTest().then('it should initialize with side menu expanded', () => {
      expect(getSideNavigation().props('isSideMenuCollapsed')).toBe(false)
    })

    BddTest().then('it should set the selected item based on the current route', () => {
      expect(getSideNavigation().props('selectedItem')).toEqual({
        itemId: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
      })
    })

    BddTest().then('it should have two navigation items', () => {
      expect(getSideNavigation().props('items')).toHaveLength(2)
    })

    BddTest().then('it should have navigation items with the correct structure', () => {
      expect(getSideNavigation().props('items')).toEqual([
        {
          id: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
          label: expect.any(String),
          icon: expect.any(String),
        },
        {
          id: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
          label: expect.any(String),
          icon: expect.any(String),
        },
      ])
    })

    BddTest().then('it should have navigation items with the correct French labels', () => {
      const items = getSideNavigation().props('items')

      expect(items![0].label).toContain('Mes formations')
      expect(items![1].label).toContain('Mes expériences')
    })

    BddTest().then('it should emit the selected section label for the current route', () => {
      expect(wrapper.emitted('selectedItem')).toEqual([
        ['Mes formations'],
      ])
    })

    BddTest().then('it should emit the selected section label when the route changes', async () => {
      route.name = ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name
      await flushPromises()

      expect(wrapper.emitted('selectedItem')).toEqual([
        ['Mes formations'],
        ['Mes expériences'],
      ])
    })

    BddTest().then('it should render the content area', () => {
      const contentArea = wrapper.find('.student-project-personal-career-container__content')

      expect(contentArea.exists()).toBe(true)
    })

    BddTest().then('it should render the RouterView', () => {
      expect(wrapper.find('.router-view-stub').exists()).toBe(true)
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
        await getSideNavigation().vm.$emit('update:selectedItem', {
          itemId: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
        })
        await flushPromises()
      })

      BddTest().then('it should navigate to the selected route', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
        })
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      route.name = ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name
      mockIsMobile.value = true

      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs },
      })
    })

    BddTest().then('it should render an AvSelect component for navigation', () => {
      expect(getAvSelect().exists()).toBe(true)
    })

    BddTest().then('it should not render the SideNavigation component', () => {
      expect(getSideNavigation().exists()).toBe(false)
    })

    BddTest().then('it should provide the current route as the selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
        label: 'Mes formations',
      })
    })

    BddTest().then('it should provide navigation options with the correct structure', () => {
      expect(getAvSelect().props('options')).toEqual([
        {
          value: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
          label: 'Mes formations',
        },
        {
          value: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
          label: 'Mes expériences',
        },
      ])
    })

    BddTest().then('it should provide the expected select configuration', () => {
      expect(getAvSelect().props('label')).toBeTruthy()
      expect(getAvSelect().props('placeholder')).toBe('')
    })

    BddTest().and('a navigation option is selected from the dropdown', () => {
      beforeEach(async () => {
        await getAvSelect().vm.$emit('update:modelValue', {
          value: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
          label: 'Mes expériences',
        })
        await flushPromises()
      })

      BddTest().then('it should navigate to the selected route', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
        })
      })
    })

    BddTest().and('the dropdown emits an empty selection', () => {
      beforeEach(async () => {
        await getAvSelect().vm.$emit('update:modelValue', null)
        await flushPromises()
      })

      BddTest().then('it should not navigate to another route', () => {
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the current route changes', () => {
      beforeEach(async () => {
        route.name = ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name
        await flushPromises()
      })

      BddTest().then('it should update the selected option', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
          label: 'Mes expériences',
        })
      })
    })
  })

  BddTest().when('the component is mounted on a tools kit route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      route.name = ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name
      mockIsMobile.value = false

      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs },
      })
    })

    BddTest().then('it should select the current tools kit section', () => {
      expect(getSideNavigation().props('selectedItem')).toEqual({
        itemId: ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name,
      })
    })

    BddTest().then('it should show only tools kit navigation destinations', () => {
      expect(getSideNavigation().props('items')!.map(item => item.id)).toEqual([
        ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
        ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name,
      ])
    })

    BddTest().then('it should emit the selected tools kit section label', () => {
      expect(wrapper.emitted('selectedItem')).toEqual([
        ['Mes expériences'],
      ])
    })

    BddTest().and('a tools kit navigation item is selected', () => {
      beforeEach(async () => {
        await getSideNavigation().vm.$emit('update:selectedItem', {
          itemId: ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
        })
        await flushPromises()
      })

      BddTest().then('it should replace the route with the selected tools kit destination', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
        })
      })
    })
  })

  BddTest().when('the component is mounted on mobile from a tools kit route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      route.name = ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name
      mockIsMobile.value = true

      wrapper = mountComponent(PersonalCareerLayout, {
        global: { stubs },
      })
    })

    BddTest().then('it should select the active tools kit section and show tools kit options', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name,
        label: 'Mes expériences',
      })

      expect(getAvSelect().props('options')!.map(option => (option as AvSelectOption).value)).toEqual([
        ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
        ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES.name,
      ])
    })

    BddTest().and('a tools kit navigation option is selected', () => {
      beforeEach(async () => {
        await getAvSelect().vm.$emit('update:modelValue', {
          value: ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
          label: 'Mes formations',
        })
        await flushPromises()
      })

      BddTest().then('it should replace with the selected tools kit destination', () => {
        expect(mockReplace).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS.name,
        })
      })
    })
  })
})
