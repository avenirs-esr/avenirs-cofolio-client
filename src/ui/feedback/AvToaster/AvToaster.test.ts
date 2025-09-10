import AvToaster from '@/ui/feedback/AvToaster/AvToaster.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an AvToaster', () => {
  let wrapper: VueWrapper
  const basePath = import.meta.env.BASE_URL
  const stubs = {
    TransitionGroup: {
      template: '<div><slot /></div>',
    },
    AvAlert: {
      template: `<div class="av-alert" v-bind="$attrs" @click="$emit('close')"><slot /></div>`,
      props: ['id', 'type'],
    },
  }

  const baseMessage = {
    id: 'message1',
    title: 'Title',
    description: 'Description',
    type: 'success',
  }

  BddTest().when('it has an empty messages array', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render no alert', () => {
      expect(wrapper.findAll('.av-alert')).toHaveLength(0)
    })
  })

  BddTest().when('it has a success message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'success' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the success alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--success')
      expect(alert.attributes('style')).toContain(`--icon-path: url(${basePath}assets/icons/check-cricle.svg)`)
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  BddTest().when('it has an info message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'info' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the info alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--info')
      expect(alert.attributes('style')).toContain(`--icon-path: url(${basePath}assets/icons/message-badge.svg)`)
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  BddTest().when('it has a warning message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'warning' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the warning alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--warning')
      expect(alert.attributes('style')).toContain(`--icon-path: url(${basePath}assets/icons/warning-outline.svg)`)
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  BddTest().when('it has an error message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'error' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the error alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--error')
      expect(alert.attributes('style')).toContain(`--icon-path: url(${basePath}assets/icons/alert-circle-outline.svg)`)
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  BddTest().when('it has a closeable alert', () => {
    const removeMessageSpy = vi.fn()

    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{
            id: 'message2',
            title: 'Closable',
            description: 'This can be closed',
            type: 'info',
            closeable: true,
          }],
          onRemoveMessage: removeMessageSpy,
        },
        global: { stubs }
      })
    })

    BddTest().and('the alert is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('.av-alert').trigger('click')
      })

      BddTest().then('it should call onRemoveMessage with the correct id', () => {
        expect(removeMessageSpy).toHaveBeenCalledWith('message2')
      })
    })
  })
})
