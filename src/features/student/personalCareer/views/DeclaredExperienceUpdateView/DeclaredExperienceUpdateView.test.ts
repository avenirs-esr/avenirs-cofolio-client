import type { VueWrapper } from '@vue/test-utils'
import { createMockedDeclaredExperienceAssociationsDTO, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType, EErrorCode } from '@/api/avenir-esr'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants/route-names'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import DeclaredExperienceUpdateView from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import { AvIconTextStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

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

const DEFAULT_EXPERIENCE_ID = 'exp-123'

const route = reactive<{ name: string, params: { id: string } }>({
  name: ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE.name,
  params: {
    id: DEFAULT_EXPERIENCE_ID
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
  ElementAssociations: ElementAssociationsStub,
  AvTabs: { template: '<div><slot /></div>' },
  AvTab: AvTabStub
}

BddTest().given('a declared experience update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceUpdateView>>

  afterEach(() => {
    wrapper?.unmount()
    route.params.id = DEFAULT_EXPERIENCE_ID
  })

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

    BddTest().then('it should always render the update in progress badge', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(true)
    })

    BddTest().then('it should render ElementAssociations with correct props', async () => {
      const mockedAssociations = createMockedDeclaredExperienceAssociationsDTO()

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
        expect(elementAssociations.props('elementId')).toBe(route.params.id)
        expect(elementAssociations.props('associations')).toEqual(mockedAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should render ElementAssociations as readonly', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.props('readonly')).toBe(true)
    })

    BddTest().then('it should include the associations count in the associations tab title', async () => {
      const mockedAssociations = createMockedDeclaredExperienceAssociationsDTO()
      const expectedCount = mockedAssociations.traceAssociations.length + mockedAssociations.declaredSkillAssociations.length

      await vi.waitFor(() => {
        const tabs = wrapper.findAllComponents(AvTabStub)
        expect(tabs[1].props('title')).toBe(`Mes associations (${expectedCount})`)
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

  BddTest().when('the declared experience has no associations', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      route.params.id = 'EXP_WITHOUT_ASSOCIATIONS'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should pass the empty associations to ElementAssociations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
        expect(elementAssociations.props('elementId')).toBe('EXP_WITHOUT_ASSOCIATIONS')
        expect(elementAssociations.props('associations')).toEqual(mockedEmptyAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should display a zero associations count in the associations tab title', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(ElementAssociationsStub).props('associations')).toEqual(mockedEmptyAssociations)
      })

      expect(wrapper.findAllComponents(AvTabStub)[1].props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query fails', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      route.params.id = 'INVALID_DECLARED_EXPERIENCE_ID'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should pass the associations error to ElementAssociations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
        expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND }))
        expect(elementAssociations.props('associations')).toBeUndefined()
      })
    })

    BddTest().then('it should display a zero associations count in the associations tab title', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(ElementAssociationsStub).props('error')).not.toBeNull()
      })

      expect(wrapper.findAllComponents(AvTabStub)[1].props('title')).toBe('Mes associations (0)')
    })
  })
})
