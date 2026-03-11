import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import MyPerspectiveSection, {
  type MyPerspectiveSectionProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { AssociatedElementsTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.stub'
import { MyPerspectiveTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.stub'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a my perspective section', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveSection>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    MyPerspectiveTab: MyPerspectiveTabStub,
    AssociatedElementsTab: AssociatedElementsTabStub,
  }

  const props: MyPerspectiveSectionProps = {
    declaredActivityDetails: mockedDeclaredActivityDetails,
  }

  BddTest().when('the component is mounted', () => {
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
    })
  })
})
