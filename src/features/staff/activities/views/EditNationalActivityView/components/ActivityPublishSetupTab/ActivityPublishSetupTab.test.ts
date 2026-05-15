import ActivityPublishSetupTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublishSetupTab/ActivityPublishSetupTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an ActivityPublishSetupTab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPublishSetupTab>>

  beforeEach(() => {
    wrapper = mount(ActivityPublishSetupTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
