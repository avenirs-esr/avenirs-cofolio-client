import DeclaredExperiencesTab from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesTab/DeclaredExperiencesTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experiences tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencesTab>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(DeclaredExperiencesTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      expect(wrapper.text()).toBe('Mes expériences déclarées placeholder')
    })

    BddTest().then('it should have a root div element with correct class', () => {
      expect(wrapper.find('.declared-experiences-tab').exists()).toBe(true)
    })
  })
})
