import AmsTab from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/AmsTab/AmsTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an amss tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AmsTab>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AmsTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      expect(wrapper.text()).toBe('Mes AMS placeholder')
    })

    BddTest().then('it should have a root div element with correct class', () => {
      expect(wrapper.find('.amss-tab').exists()).toBe(true)
    })
  })
})
