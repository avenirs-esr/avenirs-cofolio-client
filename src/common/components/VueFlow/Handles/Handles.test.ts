import Handles, { type HandlesProps } from '@/common/components/VueFlow/Handles/Handles.vue'
import { HandleStub } from '@/common/utils/vue-flow/vue-flow-test'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a handles component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Handles>>

  const stubs = {
    Handle: HandleStub,
  }

  BddTest().when('the component is mounted with given props', () => {
    const props: HandlesProps = {
      data: {
        top: true,
        right: false,
        bottom: true,
        left: false,
      }
    }

    beforeEach(() => {
      wrapper = mount(Handles, { props, global: { stubs } })
    })

    BddTest().then('it should render 4 handles', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      expect(handles).toHaveLength(4)
    })

    BddTest().then('it should render all positions', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      const positions = handles.map(handle => handle.props('position'))
      expect(positions).toContain('top')
      expect(positions).toContain('bottom')
      expect(positions).toContain('right')
      expect(positions).toContain('left')
    })

    BddTest().then('it should render all positions as identifiers', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      const ids = handles.map(handle => handle.props('id'))
      expect(ids).toContain('top')
      expect(ids).toContain('bottom')
      expect(ids).toContain('right')
      expect(ids).toContain('left')
    })

    BddTest().then('it should set connectable for handles with true value', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      const topHandle = handles.find(handle => handle.props('id') === 'top')
      const bottomHandle = handles.find(handle => handle.props('id') === 'bottom')
      expect(topHandle?.exists()).toBe(true)
      expect(bottomHandle?.exists()).toBe(true)
      expect(topHandle!.props('connectable')).toBe(true)
      expect(bottomHandle!.props('connectable')).toBe(true)
    })

    BddTest().then('it should unset connectable for handles with false value', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      const rightHandle = handles.find(handle => handle.props('id') === 'right')
      const leftHandle = handles.find(handle => handle.props('id') === 'left')
      expect(rightHandle?.exists()).toBe(true)
      expect(leftHandle?.exists()).toBe(true)
      expect(rightHandle!.props('connectable')).toBe(false)
      expect(leftHandle!.props('connectable')).toBe(false)
    })
  })
})
