import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an ActivityPublicationTab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPublicationTab>>

  beforeEach(() => {
    wrapper = mount(ActivityPublicationTab, {
      props: {
        activity: mockedActivityContent,
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the publication placeholder', () => {
      expect(wrapper.text()).toContain('Placeholder...')
    })
  })
})
