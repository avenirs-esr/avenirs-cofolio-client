import type { DsfrAlertProps } from '@gouvminint/vue-dsfr'
import AvAlert from '@/ui/feedback/AvAlert/AvAlert.vue'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an AvAlert', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvAlert>>

  const stubs = {
    AvButton: {
      name: 'AvButton',
      template: '<button class="av-button" @click="onClick"><slot /></button>',
      props: ['onClick']
    },
    AvVICon: {
      name: 'AvVIcon',
      template: '<div class="av-vicon" />',
      props: ['name', 'color', 'size']
    }
  }

  const baseProps: DsfrAlertProps = {
    title: 'Title',
    description: 'Description',
    type: 'info',
    closeable: true
  }
  const successProps: DsfrAlertProps = {
    ...baseProps,
    type: 'success'
  }
  const errorProps: DsfrAlertProps = {
    ...baseProps,
    type: 'error'
  }
  const warningProps: DsfrAlertProps = {
    ...baseProps,
    type: 'warning'
  }

  BddTest().when('the component is mounted', () => {
    BddTest().and('the alert is opened', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, closed: false },
          global: { stubs }
        })
      })

      BddTest().then('it should render the alert content', () => {
        expect(wrapper.text()).toContain(baseProps.title)
        expect(wrapper.text()).toContain(baseProps.description)
      })
    })

    BddTest().and('the alert is closed', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, closed: true },
          global: { stubs }
        })
      })

      BddTest().then('it should not render the alert content', () => {
        expect(wrapper.text()).not.toContain(baseProps.title)
        expect(wrapper.text()).not.toContain(baseProps.description)
      })
    })

    BddTest().and('given a custom id', () => {
      const customId = 'custom-id'

      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, id: customId },
          global: { stubs }
        })
      })

      BddTest().then('it should accept custom id prop', () => {
        expect(wrapper.attributes('id')).toBe(customId)
      })
    })

    BddTest().and('small is true', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, small: true },
          global: { stubs }
        })
      })

      BddTest().then('it should not render title component', () => {
        expect(wrapper.find('.fr-alert__title').exists()).toBe(false)
      })
    })

    BddTest().and('closeable is false', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, closeable: false },
          global: { stubs }
        })
      })

      BddTest().then('it should not render close button', () => {
        expect(wrapper.findComponent({ name: 'AvButton' }).exists()).toBe(false)
      })
    })

    BddTest().and('given info type', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, { props: baseProps, global: { stubs } })
      })

      BddTest().then('it should render info icon', async () => {
        const icon = wrapper.findComponent({ name: 'AvVIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props()).toMatchObject({
          name: MDI_ICONS.INFORMATION_OUTLINE,
          color: 'var(--dark-background-primary1)',
          size: 3,
        })
      })
    })

    BddTest().and('given success type', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, { props: successProps, global: { stubs } })
      })

      BddTest().then('it should render success', async () => {
        const icon = wrapper.findComponent({ name: 'AvVIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props()).toMatchObject({
          name: MDI_ICONS.CHECK_CIRCLE,
          color: 'var(--dark-background-success)',
          size: 3,
        })
      })
    })

    BddTest().and('given error type', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, { props: errorProps, global: { stubs } })
      })

      BddTest().then('it should render error icon', async () => {
        const icon = wrapper.findComponent({ name: 'AvVIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props()).toMatchObject({
          name: MDI_ICONS.ALERT_CIRCLE_OUTLINE,
          color: 'var(--dark-background-error)',
          size: 3,
        })
      })
    })

    BddTest().and('given warning type', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, { props: warningProps, global: { stubs } })
      })

      BddTest().then('it should render warning icon', async () => {
        const icon = wrapper.findComponent({ name: 'AvVIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props()).toMatchObject({
          name: MDI_ICONS.WARNING_OUTLINE,
          color: 'var(--dark-background-warn)',
          size: 3,
        })
      })
    })

    BddTest().and('given alert prop', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, alert: true },
          global: { stubs }
        })
      })

      BddTest().then('it should render alert role', async () => {
        const alert = wrapper.findComponent('.fr-alert')
        expect(alert.attributes('role')).toBe('alert')
      })
    })

    BddTest().and('not given alert prop', () => {
      beforeEach(() => {
        wrapper = mount(AvAlert, {
          props: { ...baseProps, alert: false },
          global: { stubs }
        })
      })

      BddTest().then('it should not render alert role', async () => {
        const alert = wrapper.findComponent('.fr-alert')
        expect(alert.attributes('role')).toBeUndefined()
      })
    })
  })

  BddTest().when('close button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(AvAlert, { props: baseProps, global: { stubs } })
    })

    BddTest().then('it should emit close event', async () => {
      await wrapper.findComponent({ name: 'AvButton' }).trigger('click')
      expect(wrapper.emitted()).toHaveProperty('close')
    })
  })
})
