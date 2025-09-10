import AmsPlanningContainer from '@/features/student/views/StudentEducationAmsView/components/AmsPlanningContainer/AmsPlanningContainer.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
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
