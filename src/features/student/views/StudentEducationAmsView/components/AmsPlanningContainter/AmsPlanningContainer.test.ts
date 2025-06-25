import AmsPlanningContainer from '@/features/student/views/StudentEducationAmsView/components/AmsPlanningContainter/AmsPlanningContainer.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('amsPlanningContainer', () => {
  describe('given an ams planning container', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(AmsPlanningContainer)
    })

    describe('when the ams planning container is mounted', () => {
      it('then it should render properly', () => {
        expect(wrapper.text()).toContain('Placeholder...')
      })
    })
  })
})
