import StudentCountAmsIconText from '@/features/student/components/ams/base/StudentCountAmsIconText/StudentCountAmsIconText.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a student count AMS icon text', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentCountAmsIconText>>

  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  BddTest().when('countAms equals 0', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountAmsIconText, {
        props: { countAms: 0 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render none version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('0 mise en situation')
    })
  })

  BddTest().when('countAms equals 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountAmsIconText, {
        props: { countAms: 1 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render singular version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('1 mise en situation')
    })
  })

  BddTest().when('countAms is greater than 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountAmsIconText, {
        props: { countAms: 2 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render pluaral version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('2 mises en situation')
    })
  })
})
