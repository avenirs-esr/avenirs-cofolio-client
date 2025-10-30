import ConfirmationModal, { type ConfirmationModalProps } from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvModal: {
    name: 'AvModal',
    template: `
      <div class="av-modal-stub">
        <slot name="header" />
        <slot />
      </div>
    `,
    props: ['opened', 'id', 'closeButtonLabel', 'confirmButtonLabel'],
    emits: ['close', 'confirm']
  }
}

BddTest().given('a confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmationModal>>

  beforeEach(() => {
    wrapper = mount(ConfirmationModal, {
      props: {
        show: true
      } as ConfirmationModalProps,
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvModal with correct props', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
      expect(modal.props('id')).toBe('confirmation-modal')
      expect(modal.props('closeButtonLabel')).toBe('Annuler')
      expect(modal.props('confirmButtonLabel')).toBe('Confirmer')
    })

    BddTest().then('it should render the default content', () => {
      const contentContainer = wrapper.find('.content-container')

      expect(contentContainer.exists()).toBe(true)

      const titleText = contentContainer.find('.n5')
      const descriptionText = contentContainer.find('.b2-light')

      expect(titleText.text()).toBe('Êtes-vous sûr de vouloir quitter ?')
      expect(descriptionText.text()).toBe('Toutes les modifications non enregistrées seront perdues.')
    })
  })

  BddTest().when('the close event is emitted from AvModal', () => {
    BddTest().then('it should pass through the close event via attrs', async () => {
      const closeHandler = vi.fn()
      wrapper = mount(ConfirmationModal, {
        props: {
          show: true,
          onClose: closeHandler
        } as ConfirmationModalProps,
        global: {
          stubs
        }
      })

      const modal = wrapper.findComponent({ name: 'AvModal' })
      await modal.vm.$emit('close')

      expect(closeHandler).toHaveBeenCalled()
    })
  })

  BddTest().when('the confirm event is emitted from AvModal', () => {
    BddTest().then('it should pass through the confirm event via attrs', async () => {
      const confirmHandler = vi.fn()
      wrapper = mount(ConfirmationModal, {
        props: {
          show: true,
          onConfirm: confirmHandler
        } as ConfirmationModalProps,
        global: {
          stubs
        }
      })

      const modal = wrapper.findComponent({ name: 'AvModal' })
      await modal.vm.$emit('confirm')

      expect(confirmHandler).toHaveBeenCalled()
    })
  })

  BddTest().when('the show prop is false', () => {
    beforeEach(async () => {
      await wrapper.setProps({ show: false })
    })

    BddTest().then('it should pass the opened prop as false to AvModal', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })

      expect(modal.props('opened')).toBe(false)
    })
  })

  BddTest().when('custom header slot is provided', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmationModal, {
        props: {
          show: true
        } as ConfirmationModalProps,
        slots: {
          header: '<div class="custom-header">Custom Header</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the custom header', () => {
      const customHeader = wrapper.find('.custom-header')

      expect(customHeader.exists()).toBe(true)
      expect(customHeader.text()).toBe('Custom Header')
    })
  })

  BddTest().when('custom default slot is provided', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmationModal, {
        props: {
          show: true
        } as ConfirmationModalProps,
        slots: {
          default: '<div class="custom-content">Custom Content</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the custom content', () => {
      const customContent = wrapper.find('.custom-content')

      expect(customContent.exists()).toBe(true)
      expect(customContent.text()).toBe('Custom Content')
    })
  })

  BddTest().when('custom title and description props are provided', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmationModal, {
        props: {
          show: true,
          title: 'Custom Title',
          description: 'Custom Description'
        } as ConfirmationModalProps,
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the custom title and description', () => {
      const contentContainer = wrapper.find('.content-container')

      expect(contentContainer.exists()).toBe(true)

      const titleText = contentContainer.find('.n5')
      const descriptionText = contentContainer.find('.b2-light')

      expect(titleText.text()).toBe('Custom Title')
      expect(descriptionText.text()).toBe('Custom Description')
    })
  })
})
