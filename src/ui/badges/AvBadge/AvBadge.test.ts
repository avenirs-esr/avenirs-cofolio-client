import AvBadge from '@/ui/badges/AvBadge/AvBadge.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { DsfrBadgeStub } from 'tests/stubs'
import { BddTest } from 'tests/utils'
import { beforeEach } from 'vitest'

BddTest().given('an AvBadge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvBadge>>

  const stubs = { DsfrBadge: DsfrBadgeStub }

  const defaultProps = {
    color: 'var(--color)',
    backgroundColor: 'var(--background-color)',
    label: 'MyBadge'
  }
  const propsWithIconPath = { ...defaultProps, iconPath: '/assets/icons/icon.svg' }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AvBadge, { props: defaultProps, global: { stubs } })
    })

    BddTest().then('it should render with given properties', () => {
      const dsfrBadge = wrapper.findComponent({ name: 'DsfrBadge' })

      expect(dsfrBadge.exists()).toBe(true)
      expect(dsfrBadge.props()).toMatchObject({
        label: defaultProps.label,
        type: undefined,
      })

      expect(dsfrBadge.classes()).not.toContain('av-badge--customIcon')
    })

    BddTest().and('given iconPath', () => {
      beforeEach(() => {
        wrapper = mount(AvBadge, { props: propsWithIconPath, global: { stubs } })
      })

      BddTest().then('it should add specific class', () => {
        const dsfrBadge = wrapper.findComponent({ name: 'DsfrBadge' })

        expect(dsfrBadge.exists()).toBe(true)
        expect(dsfrBadge.props()).toMatchObject({
          label: defaultProps.label,
          type: undefined,
        })

        expect(dsfrBadge.classes()).toContain('av-badge--customIcon')
      })
    })
  })
})
