import { useToasterStore } from '@/store'
import AvToaster from '@/ui/feedback/AvToaster/AvToaster.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avToaster', () => {
  let toaster: ReturnType<typeof useToasterStore>

  const stubs = {
    TransitionGroup: {
      template: '<div><slot /></div>',
    },
    AvAlert: {
      template: `<div class="av-alert" v-bind="$attrs" @click="$emit('close')"><slot /></div>`,
      props: ['id', 'type'],
    },
  }

  const message = {
    id: 'message1',
    title: 'Title',
    description: 'Description',
    type: 'success',
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    toaster = useToasterStore()
  })

  it('should render no alert when store is empty', () => {
    const wrapper = mount(AvToaster, {
      global: { stubs }
    })

    expect(wrapper.findAll('.av-alert')).toHaveLength(0)
  })

  it('should render success from store success message', () => {
    toaster = useToasterStore()
    toaster.addMessage({ ...message, type: 'success', })

    const wrapper = mount(AvToaster, {
      global: { stubs }
    })

    const alerts = wrapper.findAll('.av-alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0].classes()).toContain('av-toaster--success')
    expect(alerts[0].attributes('style')).toContain('--icon-path: url(/assets/icons/check-cricle.svg)')
    expect(wrapper.html()).toContain(message.title)
    expect(wrapper.html()).toContain(message.description)
  })

  it('should render info from store info message', () => {
    toaster = useToasterStore()
    toaster.addMessage({ ...message, type: 'info', })

    const wrapper = mount(AvToaster, {
      global: { stubs }
    })

    const alerts = wrapper.findAll('.av-alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0].classes()).toContain('av-toaster--info')
    expect(alerts[0].attributes('style')).toContain('--icon-path: url(/assets/icons/message-badge.svg)')
    expect(wrapper.html()).toContain(message.title)
    expect(wrapper.html()).toContain(message.description)
  })

  it('should render warning from store warning message', () => {
    toaster = useToasterStore()
    toaster.addMessage({ ...message, type: 'warning', })

    const wrapper = mount(AvToaster, {
      global: { stubs }
    })

    const alerts = wrapper.findAll('.av-alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0].classes()).toContain('av-toaster--warning')
    expect(alerts[0].attributes('style')).toContain('--icon-path: url(/assets/icons/warning-outline.svg)')
    expect(wrapper.html()).toContain(message.title)
    expect(wrapper.html()).toContain(message.description)
  })

  it('should render error from store error message', () => {
    toaster = useToasterStore()
    toaster.addMessage({ ...message, type: 'error', })

    const wrapper = mount(AvToaster, {
      global: { stubs }
    })

    const alerts = wrapper.findAll('.av-alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0].classes()).toContain('av-toaster--error')
    expect(alerts[0].attributes('style')).toContain('--icon-path: url(/assets/icons/alert-circle-outline.svg)')
    expect(wrapper.html()).toContain(message.title)
    expect(wrapper.html()).toContain(message.description)
  })

  it('should call removeMessage when alert emits close', async () => {
    toaster = useToasterStore()
    toaster.addMessage({
      id: 'message2',
      title: 'Title',
      description: 'Alert',
      closeable: true,
      type: 'info',
    })

    const wrapper = mount(AvToaster, {
      global: {
        stubs
      },
    })

    expect(toaster.messages).toHaveLength(1)
    await wrapper.find('.av-alert').trigger('click')
    expect(toaster.messages).toHaveLength(0)
  })
})
