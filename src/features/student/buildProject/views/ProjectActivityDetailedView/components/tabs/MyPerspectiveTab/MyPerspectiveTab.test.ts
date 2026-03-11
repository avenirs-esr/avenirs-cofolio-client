import MyPerspectiveTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a my perspective tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(MyPerspectiveTab)
    })

    BddTest().then('it should render the placeholder', () => {
      expect(wrapper.text()).toContain('Placeholder...')
    })
  })
})
