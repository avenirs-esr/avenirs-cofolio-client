import { AllActivitiesHeaderCardStub } from '@/features/student/global/views/ProjectActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.stub'
import AllActivitiesTab from '@/features/student/global/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the all activities tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesTab>>

  const stubs = { AllActivitiesHeaderCard: AllActivitiesHeaderCardStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AllActivitiesTab, { global: { stubs } })
    })

    BddTest().then('it should render the all activities header card', () => {
      expect(wrapper.findComponent(AllActivitiesHeaderCardStub).exists()).toBe(true)
    })
  })
})
