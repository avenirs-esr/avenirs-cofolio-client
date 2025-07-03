import AvToaster from '@/ui/feedback/AvToaster/AvToaster.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('avToaster', () => {
  let wrapper: VueWrapper

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

  describe('given an empty messages array', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    it('then it should render no alert', () => {
      expect(wrapper.findAll('.av-alert')).toHaveLength(0)
    })
  })

  describe('given a success message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'success' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    it('then it should render the success alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--success')
      expect(alert.attributes('style')).toContain('--icon-path: url(/assets/icons/check-cricle.svg)')
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  describe('given an info message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'info' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    it('then it should render the info alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--info')
      expect(alert.attributes('style')).toContain('--icon-path: url(/assets/icons/message-badge.svg)')
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  describe('given a warning message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'warning' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    it('then it should render the warning alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--warning')
      expect(alert.attributes('style')).toContain('--icon-path: url(/assets/icons/warning-outline.svg)')
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  describe('given an error message', () => {
    beforeEach(() => {
      wrapper = mount(AvToaster, {
        props: {
          messages: [{ ...baseMessage, type: 'error' }],
          onRemoveMessage: vi.fn(),
        },
        global: { stubs }
      })
    })

    it('then it should render the error alert with correct class and style', () => {
      const alert = wrapper.find('.av-alert')
      expect(alert.exists()).toBe(true)
      expect(alert.classes()).toContain('av-toaster--error')
      expect(alert.attributes('style')).toContain('--icon-path: url(/assets/icons/alert-circle-outline.svg)')
      expect(wrapper.html()).toContain(baseMessage.title)
      expect(wrapper.html()).toContain(baseMessage.description)
    })
  })

  describe('given a closeable alert', () => {
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

    describe('when the alert is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('.av-alert').trigger('click')
      })

      it('then it should call onRemoveMessage with the correct id', () => {
        expect(removeMessageSpy).toHaveBeenCalledWith('message2')
      })
    })
  })
})
