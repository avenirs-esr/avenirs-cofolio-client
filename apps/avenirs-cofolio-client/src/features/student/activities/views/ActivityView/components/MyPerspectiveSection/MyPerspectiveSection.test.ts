import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { MyPerspectiveSectionProps } from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import type { ElementAssociationsProps } from '@/features/student/associations'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ErrorCodes } from '@avenirs-esr/shared'
import { LoaderStub } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { isObject } from '@vueuse/core'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { mockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { getAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType, EErrorCode } from '@/api/avenir-esr'
import { ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import { TraceAssociationLimitCardStub } from '@/features/student/activities/views/ActivityView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.stub'
import { MyPerspectiveSectionTab } from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.types'
import MyPerspectiveSection from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { MyPerspectiveTabStub } from '@/features/student/activities/views/ActivityView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.stub'
import { createElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { UNKNOWN_ASSOCIATION_LIMIT } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

const TITLE = 'Mes éléments associés ({count})'

const defaultProps: ComponentMountingOptions<typeof MyPerspectiveSection>['props'] = {
  declaredActivityDetails: mockedDeclaredActivityDetails
}

const routeQueryValue = ref<string>()

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

const stubbedLimits = ref<Partial<Record<EAssociationContextType, AssociationLimitState>>>({})

const ElementAssociationsWithLimitsStub = createElementAssociationsStub(associatedContextType => stubbedLimits.value[associatedContextType] ?? UNKNOWN_ASSOCIATION_LIMIT)

BddTest().given('a my perspective section', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveSection>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    Loader: LoaderStub,
    MyPerspectiveTab: MyPerspectiveTabStub,
    ElementAssociations: ElementAssociationsWithLimitsStub,
    TraceAssociationLimitCard: TraceAssociationLimitCardStub,
  }

  const mockedAssociationsCount = Object.values(mockedDeclaredActivityAssociations).reduce((total, associations) => total + (Array.isArray(associations) ? associations.length : 0), 0)

  const mountWith = (props: Partial<typeof defaultProps> = {}) => {
    wrapper = mountComponent(MyPerspectiveSection, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs },
    })
  }

  const getTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveTab = () => wrapper.findComponent(AvTabStub)
  const getMyPerspectiveTab = () => wrapper.findComponent(MyPerspectiveTabStub)
  const getElementAssociations = () => wrapper.findComponent(ElementAssociationsWithLimitsStub)
  const getTraceLimitCard = () => wrapper.findComponent(TraceAssociationLimitCardStub)
  const getSection = () => wrapper.find('[data-testid="my-perspective-section"]')

  const givenTraceLimit = (limit: AssociationLimitState) => {
    stubbedLimits.value = { [EAssociationContextType.TRACE]: limit }
  }

  const switchToAssociatedElementsTab = async () => {
    getTabs().vm.$emit('update:modelValue', MyPerspectiveSectionTab.ASSOCIATED_ELEMENTS)
    await flushPromises()
  }

  const mountOnAssociatedElementsTab = async (props: Partial<MyPerspectiveSectionProps> = {}) => {
    mountWith(props)
    await switchToAssociatedElementsTab()
  }

  const expectTraceLimitCard = (traceAllowedAssociations: number) => {
    const card = getTraceLimitCard()
    expect(card.exists()).toBe(true)
    expect(card.props('traceAllowedAssociations')).toBe(traceAllowedAssociations)
  }

  const expectNoTraceLimitCard = () => {
    expect(getTraceLimitCard().exists()).toBe(false)
  }

  const expectTabTitle = (count: number) => {
    expect(getActiveTab().props('title')).toBe(TITLE.replace('{count}', String(count)))
  }

  const expectActions = async (props: Partial<ElementAssociationsProps>) => {
    await vi.waitFor(() => {
      const element = getElementAssociations()

      expect(element.exists()).toBe(true)
      Object.entries(props).forEach(([key, value]) => {
        if (value === undefined) {
          return
        }

        const prop = element.props(key as keyof ElementAssociationsProps)

        if (Array.isArray(value)) {
          expect(prop).toEqual(value)
        }
        else if (isObject(value)) {
          expect(prop).toMatchObject(value)
        }
        else {
          expect(prop).toBe(value)
        }
      })
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'MY_PERSPECTIVE'
    stubbedLimits.value = {}
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the main section container', () => {
      expect(getSection().exists()).toBe(true)
    })

    BddTest().then('it should render the AvTabs component', () => {
      expect(getTabs().exists()).toBe(true)
    })

    BddTest().then('it should initialize AvTabs with the first tab active', () => {
      expect(getTabs().props('modelValue')).toBe(MyPerspectiveSectionTab.MY_PERSPECTIVE)
    })

    BddTest().then('it should render the my perspective tab component', () => {
      expect(getMyPerspectiveTab().exists()).toBe(true)
    })

    BddTest().then('it should pass declared activity details to my perspective tab', () => {
      expect(getMyPerspectiveTab().props('declaredActivityDetails')).toEqual(defaultProps.declaredActivityDetails)
    })

    BddTest().then('it should not render the element associations before switching tabs', () => {
      expect(getElementAssociations().exists()).toBe(false)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        await switchToAssociatedElementsTab()
      })

      BddTest().then('it should update the active tab index', () => {
        expect(getTabs().props('modelValue')).toBe(MyPerspectiveSectionTab.ASSOCIATED_ELEMENTS)
      })

      BddTest().then('it should display the associations count in the tab title', async () => {
        await vi.waitFor(() => expectTabTitle(mockedAssociationsCount))
      })

      BddTest().then('it should render the element associations of the declared activity', async () => {
        await expectActions({
          contextType: EAssociationContextType.DECLARED_ACTIVITY,
          elementId: defaultProps.declaredActivityDetails.id
        })
      })

      BddTest().then('it should pass the fetched associations to the element associations', async () => {
        await expectActions({
          associations: mockedDeclaredActivityAssociations,
          isLoading: false,
          error: null
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared activity', () => {
    beforeEach(() => {
      mountWith({
        declaredActivityDetails: {
          ...defaultProps.declaredActivityDetails,
          id: 'INVALID_DECLARED_ACTIVITY_ID'
        }
      })
    })

    BddTest().then('it should render the my perspective tab component', () => {
      expect(getMyPerspectiveTab().exists()).toBe(true)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        await switchToAssociatedElementsTab()
      })

      BddTest().then('it should update the active tab index', () => {
        expect(getTabs().props('modelValue')).toBe(MyPerspectiveSectionTab.ASSOCIATED_ELEMENTS)
      })

      BddTest().then('it should display a zero associations count in the tab title', () => {
        expectTabTitle(0)
      })

      BddTest().then('it should pass the fetch error to the element associations', async () => {
        await expectActions({
          error: expect.objectContaining({
            code: EErrorCode.ACTIVITY_NOT_FOUND
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted and the associations request fails', () => {
    beforeEach(async () => {
      server.use(getAssociationsErrorHandler)
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should pass the fetch error to the element associations', async () => {
      await expectActions({
        error: expect.objectContaining({
          code: ErrorCodes.SERVER
        })
      })
    })

    BddTest().then('it should display a zero associations count in the tab title', () => {
      expectTabTitle(0)
    })
  })

  BddTest().when('the component is mounted with a declared activity without associations', () => {
    beforeEach(async () => {
      await mountOnAssociatedElementsTab({
        declaredActivityDetails: {
          ...defaultProps.declaredActivityDetails,
          id: 'DECLARED_ACTIVITY_WITHOUT_ASSOCIATIONS'
        }
      })
    })

    BddTest().then('it should display a zero associations count in the tab title', async () => {
      await vi.waitFor(() => expectTabTitle(0))
    })
  })

  BddTest().when('the limit of the traces is not known yet', () => {
    beforeEach(async () => {
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should not render the trace association limit card', () => {
      expectNoTraceLimitCard()
    })

    BddTest().and('the limit of the traces gets loaded', () => {
      beforeEach(async () => {
        givenTraceLimit({
          isLoaded: true,
          max: 8,
          remaining: 2
        })
        await flushPromises()
      })

      BddTest().then('it should render the trace association limit card with the limit', () => {
        expectTraceLimitCard(8)
      })
    })
  })

  BddTest().when('the traces are limited and some of them can still be associated', () => {
    beforeEach(async () => {
      givenTraceLimit({
        isLoaded: true,
        max: 8,
        remaining: 2
      })
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should render the trace association limit card with the limit', () => {
      expectTraceLimitCard(8)
    })
  })

  BddTest().when('the limit of the traces is reached', () => {
    beforeEach(async () => {
      givenTraceLimit({
        isLoaded: true,
        max: 8,
        remaining: 0
      })
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should still render the trace association limit card with the limit', () => {
      expectTraceLimitCard(8)
    })
  })

  BddTest().when('the traces are unlimited', () => {
    beforeEach(async () => {
      givenTraceLimit({
        isLoaded: true,
        remaining: Number.POSITIVE_INFINITY
      })
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should render the trace association limit card as unlimited', () => {
      expectTraceLimitCard(ACTIVITY_TRACE_SETTING_INFINITY_VALUE)
    })
  })

  BddTest().when('the traces are not allowed', () => {
    beforeEach(async () => {
      givenTraceLimit({
        isLoaded: true,
        max: ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
        remaining: 0
      })
      await mountOnAssociatedElementsTab()
    })

    BddTest().then('it should not render the trace association limit card', () => {
      expectNoTraceLimitCard()
    })
  })
})
