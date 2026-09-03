import type { VueWrapper } from '@vue/test-utils'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants/route-names'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { DeclaredExperienceSideMenuStub } from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.stub'
import DeclaredExperienceUpdateView, { type DeclaredExperienceUpdateViewProps } from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockRouteId = ref<string>('exp123')
const routerPush = vi.fn()
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

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () { return mockRouteId.value }
      }
    }),
    useRouter: () => ({
      push: routerPush
    })
  }
})

const UpdateDeclaredExperienceFormStub = {
  name: 'UpdateDeclaredExperienceForm',
  props: [
    'declaredExperience',
    'onExperienceUpdated',
    'onCancel'
  ],
  emits: ['dirtyChange', 'cancel', 'experience-updated'],
  template: '<div data-testid="update-declared-experience-form-stub"></div>'
}
const stubs = {
  AvIconText: AvIconTextStub,
  UpdatePageTitle: UpdatePageTitleStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub,
  DeclaredExperienceSideMenu: DeclaredExperienceSideMenuStub,
  UpdateDeclaredExperienceForm: UpdateDeclaredExperienceFormStub,
  AvTabs: { template: '<div><slot /></div>' },
  AvTab: { template: '<div><slot /></div>' }
}

BddTest().given('a declared experience update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceUpdateView>>
  const props: DeclaredExperienceUpdateViewProps = {
    experienceId: 'exp-123'
  }

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceUpdateView, {
      props,
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render UpdatePageTitle', () => {
      const pageTitle = wrapper.findComponent(UpdatePageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().and('the cancel event is emitted from the form', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const formComponent = wrapper.findComponent(UpdateDeclaredExperienceFormStub)
          expect(formComponent.exists()).toBe(true)

          formComponent.vm.$emit('cancel')
        })
      })

      BddTest().then('it should navigate to the declared experience detail view', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
          params: { id: mockRouteId.value }
        })
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountComponentWithDefaults()
    })

    BddTest().then('it should not render the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
      expect(sideMenu.exists()).toBe(false)
    })
  })
})
