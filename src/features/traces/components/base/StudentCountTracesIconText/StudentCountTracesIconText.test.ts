import StudentCountTracesIconText from '@/features/traces/components/base/StudentCountTracesIconText/StudentCountTracesIconText.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('studentCountTracesIconText', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentCountTracesIconText>>

  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  BddTest().when('countTraces equals 0', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountTracesIconText, {
        props: { countTraces: 0 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render none version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('0 trace')
    })
  })

  BddTest().when('countTraces equals 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountTracesIconText, {
        props: { countTraces: 1 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render singular version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('1 trace')
    })
  })

  BddTest().when('countTraces is greater than 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountTracesIconText, {
        props: { countTraces: 2 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render pluaral version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('2 traces')
    })
  })
})
