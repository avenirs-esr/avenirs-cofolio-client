import MyPerspectiveSection from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { AssociatedElementsTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.stub'
import { MyPerspectiveTabStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.stub'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a my perspective section', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveSection>>

  const stubs = {
    AvTabs: AvTabsStub,
    AbTab: AvTabStub,
    MyPerspectiveTab: MyPerspectiveTabStub,
    AssociatedElementsTab: AssociatedElementsTabStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(MyPerspectiveSection, { global: { stubs } })
    })

    BddTest().then('it should render the AvTabs component', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render the my perspective tab', () => {
      const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)
      expect(myPerspectiveTab.exists()).toBe(true)
    })

    BddTest().then('it should not render the associated elements tab', () => {
      const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
      expect(associatedElementsTab.exists()).toBe(false)
    })

    BddTest().and('the user switches tabs to the associated elements tab', () => {
      beforeEach(() => {
        const tabs = wrapper.findComponent(AvTabsStub)
        tabs.vm.$emit('update:modelValue', 1)
      })

      BddTest().then('it should not render the my perspective tab', () => {
        const myPerspectiveTab = wrapper.findComponent(MyPerspectiveTabStub)
        expect(myPerspectiveTab.exists()).toBe(false)
      })

      BddTest().then('it should render the associated elements tab', () => {
        const associatedElementsTab = wrapper.findComponent(AssociatedElementsTabStub)
        expect(associatedElementsTab.exists()).toBe(true)
      })
    })
  })
})
