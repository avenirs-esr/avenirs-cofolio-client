import type { VueWrapper } from '@vue/test-utils'
import { createMockedDeclaredExperienceAssociationsDTO } from '@/__mocks__/fixtures/student'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants/route-names'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import DeclaredExperienceUpdateView from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import { DeclaredExperienceAssociationsStub } from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.stub'
import { AvIconTextStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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

const route = reactive<{ name: string, params: { id: string } }>({
  name: ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE.name,
  params: {
    id: 'exp-123'
  },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => route,
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
  UpdateDeclaredExperienceForm: UpdateDeclaredExperienceFormStub,
  DeclaredExperienceAssociations: DeclaredExperienceAssociationsStub,
  AvTabs: { template: '<div><slot /></div>' },
  AvTab: AvTabStub
}

BddTest().given('a declared experience update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceUpdateView>>

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceUpdateView, { global: { stubs } })
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

    BddTest().then('it should render DeclaredExperienceAssociations with correct props', async () => {
      const mockedAssociations = createMockedDeclaredExperienceAssociationsDTO()

      await vi.waitFor(() => {
        const associations = wrapper.findComponent(DeclaredExperienceAssociationsStub)
        expect(associations.exists()).toBe(true)
        expect(associations.props('declaredExperienceId')).toBe(route.params.id)
        expect(associations.props('traceAssociations')).toEqual(mockedAssociations.traceAssociations)
        expect(associations.props('declaredSkillAssociations')).toEqual(mockedAssociations.declaredSkillAssociations)
        expect(associations.props('disabled')).toBe(true)
        expect(associations.props('showActions')).toBe(false)
      })
    })

    BddTest().then('it should include the associations count in the associations tab title', async () => {
      const mockedAssociations = createMockedDeclaredExperienceAssociationsDTO()
      const expectedCount = mockedAssociations.traceAssociations.length + mockedAssociations.declaredSkillAssociations.length

      await vi.waitFor(() => {
        const tabs = wrapper.findAllComponents(AvTabStub)
        expect(String(tabs[1].props('title'))).toContain(String(expectedCount))
      })
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
          params: { id: route.params.id }
        })
      })
    })
  })
})
