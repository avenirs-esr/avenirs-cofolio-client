import AvIconText from '@/ui/base/AvIconText/AvIconText.vue'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { mount, type VueWrapper } from '@vue/test-utils'
import { VIconStub } from 'tests/stubs'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an AvIconText', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvIconText>>
  const stubs = { VIcon: VIconStub }

  const baseProps = {
    icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
    text: 'test',
  } as const

  const allProps = {
    ...baseProps,
    iconColor: 'var(--icon-color)',
    textColor: 'var(--text-color)',
    typographyClass: 'typography'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AvIconText, { props: baseProps, global: { stubs } })
    })

    BddTest().then('it should render properly', async () => {
      const vicon = wrapper.findComponent({ name: 'VIcon' })
      expect(vicon.exists()).toBe(true)
      expect(vicon.props('name')).toBe(baseProps.icon)
      expect(vicon.props('color')).toBe('var(--text1)')

      const text = wrapper.find('.icon-text--text')
      expect(text.exists()).toBe(true)
      expect(text.text()).toContain(baseProps.text)
      expect(text.classes()).toContain('b2-regular')
    })

    BddTest().and('given props', () => {
      beforeEach(() => {
        wrapper = mount(AvIconText, { props: allProps, global: { stubs } })
      })

      BddTest().then('it should render properly', async () => {
        const vicon = wrapper.findComponent({ name: 'VIcon' })
        expect(vicon.exists()).toBe(true)
        expect(vicon.props('name')).toBe(allProps.icon)
        expect(vicon.props('color')).toBe(allProps.iconColor)

        const text = wrapper.find('.icon-text--text')
        expect(text.exists()).toBe(true)
        expect(text.text()).toContain(allProps.text)
        expect(text.classes()).toContain(allProps.typographyClass)
      })
    })
  })
})
