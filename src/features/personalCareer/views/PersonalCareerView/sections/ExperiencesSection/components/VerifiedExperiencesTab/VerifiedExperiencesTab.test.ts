import VerifiedExperiencesTab from '@/features/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/VerifiedExperiencesTab/VerifiedExperiencesTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a verified experiences tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof VerifiedExperiencesTab>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(VerifiedExperiencesTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      expect(wrapper.text()).toBe('Mes expériences vérifiées placeholder')
    })

    BddTest().then('it should have a root div element with correct class', () => {
      expect(wrapper.find('.verified-experiences-tab').exists()).toBe(true)
    })
  })
})
