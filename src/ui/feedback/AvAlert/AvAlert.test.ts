import type { DsfrAlertProps } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui/tokens'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvAlert from './AvAlert.vue'

describe('avAlert', () => {
  const stubs = {
    AvButton: {
      name: 'AvButton',
      template: '<button @click="$emit(\'click\')"><slot /></button>',
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

  it('should render the alert content if alert opened', () => {
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, closed: false },
      global: { stubs }
    })

    expect(wrapper.text()).toContain(baseProps.title)
    expect(wrapper.text()).toContain(baseProps.description)
  })

  it('should not render the alert content if alert closed', () => {
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, closed: true },
      global: { stubs }
    })

    expect(wrapper.text()).not.toContain(baseProps.title)
    expect(wrapper.text()).not.toContain(baseProps.description)
  })

  it('should accept custom id prop', () => {
    const customId = 'custom-id'
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, id: customId },
      global: { stubs }
    })

    expect(wrapper.attributes('id')).toBe(customId)
  })

  it('should not render title component if small is true', () => {
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, small: true },
      global: { stubs }
    })

    expect(wrapper.find('.fr-alert__title').exists()).toBe(false)
  })

  it('should not render close button if closeable is false', () => {
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, closeable: false },
      global: { stubs }
    })

    expect(wrapper.findComponent({ name: 'AvButton' }).exists()).toBe(false)
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(AvAlert, {
      props: baseProps,
      global: {
        stubs
      }
    })

    await wrapper.findComponent({ name: 'AvButton' }).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should render info icon for info type', async () => {
    const wrapper = mount(AvAlert, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const icon = wrapper.findComponent({ name: 'AvVIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props()).toMatchObject({
      name: MDI_ICONS.INFORMATION,
      color: 'var(--dark-background-primary1)',
      size: 3,
    })
  })

  it('should render success icon for success type', async () => {
    const wrapper = mount(AvAlert, {
      props: successProps,
      global: {
        stubs
      }
    })

    const icon = wrapper.findComponent({ name: 'AvVIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props()).toMatchObject({
      name: MDI_ICONS.CHECK_CIRCLE,
      color: 'var(--dark-background-success)',
      size: 3,
    })
  })

  it('should render error icon for error type', async () => {
    const wrapper = mount(AvAlert, {
      props: errorProps,
      global: {
        stubs
      }
    })

    const icon = wrapper.findComponent({ name: 'AvVIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props()).toMatchObject({
      name: MDI_ICONS.ALERT_CIRCLE,
      color: 'var(--dark-background-error)',
      size: 3,
    })
  })

  it('should render warning icon for warning type', async () => {
    const wrapper = mount(AvAlert, {
      props: warningProps,
      global: {
        stubs
      }
    })

    const icon = wrapper.findComponent({ name: 'AvVIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props()).toMatchObject({
      name: MDI_ICONS.WARNING,
      color: 'var(--dark-background-warn)',
      size: 3,
    })
  })

  it('should render alert role if alert is passed', async () => {
    const wrapper = mount(AvAlert, {
      props: { ...baseProps, alert: true },
      global: {
        stubs
      }
    })

    const alert = wrapper.findComponent('.fr-alert')
    expect(alert.attributes('role')).toBe('alert')
  })

  it('should not render alert role if alert is not passed', async () => {
    const wrapper = mount(AvAlert, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const alert = wrapper.findComponent('.fr-alert')
    expect(alert.attributes('role')).toBeUndefined()
  })
})
