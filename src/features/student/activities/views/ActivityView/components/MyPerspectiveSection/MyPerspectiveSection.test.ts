import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { mockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { getAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { type DeclaredActivityDetailsDTO, EAssociationContextType, EDeclaredActivityStatus, EErrorCode } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { ErrorCodes } from '@/common/constants'
import { ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import { TraceAssociationLimitCardStub } from '@/features/student/activities/views/ActivityView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.stub'
import MyPerspectiveSection, {
  type MyPerspectiveSectionProps,
} from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { MyPerspectiveTabStub } from '@/features/student/activities/views/ActivityView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.stub'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const routeQueryValue = ref<string>('MY_PERSPECTIVE')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

BddTest().given('a my perspective section', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveSection>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    Loader: LoaderStub,
    MyPerspectiveTab: MyPerspectiveTabStub,
    ElementAssociations: ElementAssociationsStub,
    TraceAssociationLimitCard: TraceAssociationLimitCardStub,
  }

  const mockedAssociationsCount = mockedDeclaredActivityAssociations.traceAssociations.length
    + mockedDeclaredActivityAssociations.declaredSkillAssociations.length

  const findElementAssociations = () => wrapper.findComponent(ElementAssociationsStub)
  const findActiveTab = () => wrapper.findComponent(AvTabStub)
  const findMaxTraceAssociationsReached = () => wrapper.find('[data-testid="max-trace-associations-reached"]')
  const findTraceAssociationLimitCard = () => wrapper.findComponent(TraceAssociationLimitCardStub)

  function createDeclaredActivityDetails (
    overrides: Partial<DeclaredActivityDetailsDTO> = {},
    traceAllowedAssociations = mockedDeclaredActivityDetails.activity.traceAllowedAssociations
  ): DeclaredActivityDetailsDTO {
    return {
      ...mockedDeclaredActivityDetails,
      ...overrides,
      activity: { ...mockedDeclaredActivityDetails.activity, traceAllowedAssociations },
    }
  }

  function mountSection (declaredActivityDetails: DeclaredActivityDetailsDTO) {
    wrapper = mountComponent(MyPerspectiveSection, {
      props: { declaredActivityDetails } satisfies MyPerspectiveSectionProps,
      global: { stubs },
    })
  }

  async function switchToAssociatedElementsTab () {
    await wrapper.findComponent(AvTabsStub).vm.$emit('update:modelValue', 1)
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'MY_PERSPECTIVE'
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountSection(mockedDeclaredActivityDetails)
    })

    BddTest().then('it should render the main section container', () => {
      expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(true)
    })

    BddTest().then('it should render the AvTabs component', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should initialize AvTabs with the first tab active', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.props('modelValue')).toBe(0)
    })

    BddTest().then('it should render the my perspective tab component', () => {
      const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)
      expect(myPerspectiveTab.exists()).toBe(true)
    })

    BddTest().then('it should pass declared activity details to my perspective tab', () => {
      const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)

      expect(myPerspectiveTab.props('declaredActivityDetails')).toEqual(mockedDeclaredActivityDetails)
    })

    BddTest().then('it should not render the element associations before switching tabs', () => {
      expect(findElementAssociations().exists()).toBe(false)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        await switchToAssociatedElementsTab()
      })

      BddTest().then('it should update the active tab index', () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        expect(tabs.props('modelValue')).toBe(1)
      })

      BddTest().then('it should display the associations count in the tab title', async () => {
        await vi.waitFor(() => {
          expect(findActiveTab().props('title')).toBe(`Mes éléments associés (${mockedAssociationsCount})`)
        })
      })

      BddTest().then('it should render the element associations of the declared activity', async () => {
        await vi.waitFor(() => {
          const elementAssociations = findElementAssociations()
          expect(elementAssociations.exists()).toBe(true)
          expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
          expect(elementAssociations.props('elementId')).toBe(mockedDeclaredActivityDetails.id)
        })
      })

      BddTest().then('it should pass the fetched associations to the element associations', async () => {
        await vi.waitFor(() => {
          const elementAssociations = findElementAssociations()
          expect(elementAssociations.props('associations')).toEqual(mockedDeclaredActivityAssociations)
          expect(elementAssociations.props('isLoading')).toBe(false)
          expect(elementAssociations.props('error')).toBeNull()
        })
      })

      BddTest().then('it should pass the trace association limit to the element associations', () => {
        expect(findElementAssociations().props('limits')).toEqual({
          [EAssociationContextType.TRACE]: ACTIVITY_TRACE_SETTING_INFINITY_VALUE
        })
      })

      BddTest().then('it should not disable the association actions', () => {
        expect(findElementAssociations().props('actionsDisabled')).toBe(false)
      })

      BddTest().then('it should not make the element associations readonly', () => {
        expect(findElementAssociations().props('readonly')).toBe(false)
      })

      BddTest().then('it should render the trace association limit card in the header', () => {
        const traceAssociationLimitCard = findTraceAssociationLimitCard()
        expect(traceAssociationLimitCard.exists()).toBe(true)
        expect(traceAssociationLimitCard.props('traceAllowedAssociations')).toBe(ACTIVITY_TRACE_SETTING_INFINITY_VALUE)
      })

      BddTest().then('it should not display the max trace associations reached message', () => {
        expect(findMaxTraceAssociationsReached().exists()).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared activity', () => {
    beforeEach(() => {
      mountSection(createDeclaredActivityDetails({ id: 'INVALID_DECLARED_ACTIVITY_ID' }))
    })

    BddTest().then('it should render the my perspective tab component', () => {
      const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)
      expect(myPerspectiveTab.exists()).toBe(true)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        await switchToAssociatedElementsTab()
      })

      BddTest().then('it should update the active tab index', () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        expect(tabs.props('modelValue')).toBe(1)
      })

      BddTest().then('it should display a zero associations count in the tab title', () => {
        expect(findActiveTab().props('title')).toBe('Mes éléments associés (0)')
      })

      BddTest().then('it should pass the fetch error to the element associations', async () => {
        await vi.waitFor(() => {
          const elementAssociations = findElementAssociations()
          expect(elementAssociations.exists()).toBe(true)
          expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: EErrorCode.ACTIVITY_NOT_FOUND }))
          expect(elementAssociations.props('associations')).toBeUndefined()
        })
      })

      BddTest().then('it should not display the max trace associations reached message', () => {
        expect(findMaxTraceAssociationsReached().exists()).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted and the associations request fails', () => {
    beforeEach(async () => {
      server.use(getAssociationsErrorHandler)
      mountSection(mockedDeclaredActivityDetails)
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should pass the fetch error to the element associations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = findElementAssociations()
        expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: ErrorCodes.SERVER }))
        expect(elementAssociations.props('associations')).toBeUndefined()
      })
    })

    BddTest().then('it should display a zero associations count in the tab title', () => {
      expect(findActiveTab().props('title')).toBe('Mes éléments associés (0)')
    })
  })

  BddTest().when('the component is mounted with a declared activity without associations', () => {
    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({ id: 'DECLARED_ACTIVITY_WITHOUT_ASSOCIATIONS' }, 1))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should display a zero associations count in the tab title', async () => {
      await vi.waitFor(() => {
        expect(findActiveTab().props('title')).toBe('Mes éléments associés (0)')
      })
    })

    BddTest().then('it should not display the max trace associations reached message', () => {
      expect(findMaxTraceAssociationsReached().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with traceAllowedAssociations set to 0', () => {
    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({}, ACTIVITY_TRACE_SETTING_DISABLED_VALUE))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should pass a trace association limit of 0 to the element associations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = findElementAssociations()
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('limits')).toEqual({ [EAssociationContextType.TRACE]: ACTIVITY_TRACE_SETTING_DISABLED_VALUE })
      })
    })

    BddTest().then('it should not render the trace association limit card', () => {
      expect(findTraceAssociationLimitCard().exists()).toBe(false)
    })

    BddTest().then('it should not display the max trace associations reached message', () => {
      expect(findMaxTraceAssociationsReached().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with traceAllowedAssociations greater than the trace associations count', () => {
    const traceAllowedAssociations = mockedDeclaredActivityAssociations.traceAssociations.length + 1

    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({}, traceAllowedAssociations))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should pass the trace association limit to the element associations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = findElementAssociations()
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('limits')).toEqual({ [EAssociationContextType.TRACE]: traceAllowedAssociations })
      })
    })

    BddTest().then('it should render the trace association limit card with the limit', () => {
      const traceAssociationLimitCard = findTraceAssociationLimitCard()
      expect(traceAssociationLimitCard.exists()).toBe(true)
      expect(traceAssociationLimitCard.props('traceAllowedAssociations')).toBe(traceAllowedAssociations)
    })

    BddTest().then('it should not display the max trace associations reached message', () => {
      expect(findMaxTraceAssociationsReached().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with traceAllowedAssociations reached by the trace associations count', () => {
    const traceAllowedAssociations = mockedDeclaredActivityAssociations.traceAssociations.length

    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({}, traceAllowedAssociations))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should display the max trace associations reached message', async () => {
      await vi.waitFor(() => {
        const maxTraceAssociationsReached = findMaxTraceAssociationsReached()
        expect(maxTraceAssociationsReached.exists()).toBe(true)
        expect(maxTraceAssociationsReached.text()).toBe('Vous avez atteint le nombre maximal de traces autorisées pour cette activité')
      })
    })

    BddTest().then('it should render the trace association limit card with the limit', () => {
      const traceAssociationLimitCard = findTraceAssociationLimitCard()
      expect(traceAssociationLimitCard.exists()).toBe(true)
      expect(traceAssociationLimitCard.props('traceAllowedAssociations')).toBe(traceAllowedAssociations)
    })
  })

  BddTest().when('the component is mounted with a subscribed declared activity', () => {
    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({ status: EDeclaredActivityStatus.IN_PROGRESS }))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should not disable the association actions', async () => {
      await vi.waitFor(() => {
        const elementAssociations = findElementAssociations()
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('actionsDisabled')).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted with an unsubscribed declared activity', () => {
    beforeEach(async () => {
      mountSection(createDeclaredActivityDetails({ status: EDeclaredActivityStatus.UNSUBSCRIBED }))
      await switchToAssociatedElementsTab()
    })

    BddTest().then('it should disable the association actions', async () => {
      await vi.waitFor(() => {
        const elementAssociations = findElementAssociations()
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('actionsDisabled')).toBe(true)
      })
    })

    BddTest().then('it should keep the associated elements visible', () => {
      expect(findElementAssociations().props('readonly')).toBe(false)
    })
  })
})
