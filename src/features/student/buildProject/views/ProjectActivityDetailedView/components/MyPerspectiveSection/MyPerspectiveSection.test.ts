import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import MyPerspectiveSection, {
  type MyPerspectiveSectionProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { AssociatedElementsTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.stub'
import { MyPerspectiveTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.stub'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a my perspective section', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveSection>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    Loader: LoaderStub,
    MyPerspectiveTab: MyPerspectiveTabStub,
    AssociatedElementsTab: AssociatedElementsTabStub,
  }
  BddTest().when('the component is mounted', () => {
    const props: MyPerspectiveSectionProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(MyPerspectiveSection, {
        props,
        global: { stubs },
      })
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

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        await tabs.vm.$emit('update:modelValue', 1)
      })

      BddTest().then('it should update the active tab index', () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        expect(tabs.props('modelValue')).toBe(1)
      })

      BddTest().then('it should render the associated elements tab content', async () => {
        await vi.waitFor(() => {
          const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
          expect(associatedElementsTab.exists()).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared activity', () => {
    const props: MyPerspectiveSectionProps = {
      declaredActivityDetails: { ...mockedDeclaredActivityDetails, id: 'INVALID_DECLARED_ACTIVITY_ID' },
    }

    beforeEach(() => {
      wrapper = mountComponent(MyPerspectiveSection, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the my perspective tab component', () => {
      const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)
      expect(myPerspectiveTab.exists()).toBe(true)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(async () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        await tabs.vm.$emit('update:modelValue', 1)
      })

      BddTest().then('it should update the active tab index', () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        expect(tabs.props('modelValue')).toBe(1)
      })

      BddTest().then('it should not render the associated elements tab content', () => {
        const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
        expect(associatedElementsTab.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted with traceAllowedAssociations set to 0', () => {
    const props: MyPerspectiveSectionProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, traceAllowedAssociations: 0 }
      },
    }

    beforeEach(async () => {
      wrapper = mountComponent(MyPerspectiveSection, {
        props,
        global: { stubs },
      })
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)
      await flushPromises()
    })

    BddTest().then('it should pass traceAssociationsDisabled as true to the associated elements tab', async () => {
      await vi.waitFor(() => {
        const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
        expect(associatedElementsTab.exists()).toBe(true)
        expect(associatedElementsTab.props('traceAssociationsDisabled')).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted with traceAllowedAssociations greater than 0', () => {
    const props: MyPerspectiveSectionProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, traceAllowedAssociations: 3 }
      },
    }

    beforeEach(async () => {
      wrapper = mountComponent(MyPerspectiveSection, {
        props,
        global: { stubs },
      })
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)
      await flushPromises()
    })

    BddTest().then('it should pass traceAssociationsDisabled as false to the associated elements tab', async () => {
      await vi.waitFor(() => {
        const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
        expect(associatedElementsTab.exists()).toBe(true)
        expect(associatedElementsTab.props('traceAssociationsDisabled')).toBe(false)
      })
    })
  })
})
