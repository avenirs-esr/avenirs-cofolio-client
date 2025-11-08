import AmsPlanningContainer from '@/features/student/ams/views/StudentEducationAmsView/components/AmsPlanningContainer/AmsPlanningContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an ams planning container', () => {
  let wrapper: VueWrapper<InstanceType<typeof AmsPlanningContainer>>

  beforeEach(() => {
    wrapper = mount(AmsPlanningContainer)
  })

  BddTest().when('the ams planning container is mounted', () => {
    BddTest().then('it should render properly', () => {
      expect(wrapper.text()).toContain('Placeholder...')
    })
  })
})
