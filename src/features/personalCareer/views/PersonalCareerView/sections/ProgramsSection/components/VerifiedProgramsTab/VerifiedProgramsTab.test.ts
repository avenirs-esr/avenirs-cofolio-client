import VerifiedProgramsTab from '@/features/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/VerifiedProgramsTab/VerifiedProgramsTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a verified programs tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof VerifiedProgramsTab>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(VerifiedProgramsTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      expect(wrapper.text()).toBe('Placement for Verified Programs content')
    })

    BddTest().then('it should have a root div element', () => {
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })
})
