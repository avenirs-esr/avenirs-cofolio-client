import type { VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AddAdditionalSkillConfirmationModal from './AddAdditionalSkillConfirmationModal.vue'

const stubs = {
  AvModal: {
    name: 'AvModal',
    props: ['opened', 'closeButtonLabel'],
    emits: ['close'],
    template: `
      <div v-if="opened" class="av-modal-stub">
        <slot />
        <div class="modal-footer">
          <slot name="footer" />
        </div>
        <button @click="$emit('close')" class="close-button">{{ closeButtonLabel }}</button>
      </div>
    `
  },
  AvButton: {
    name: 'AvButton',
    props: ['variant', 'theme', 'label', 'icon', 'size'],
    emits: ['click'],
    template: `<button @click="$emit('click')" class="av-button-stub">{{ label }}</button>`
  }
}

describe('addAdditionalSkillConfirmationModal', () => {
  describe('given a confirmation modal component', () => {
    let wrapper: VueWrapper<InstanceType<typeof AddAdditionalSkillConfirmationModal>>

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(AddAdditionalSkillConfirmationModal, {
        props: {
          show: true
        },
        global: {
          stubs
        }
      })
    })

    describe('when the modal is shown', () => {
      it('then it should render AvModal with correct props', () => {
        const modal = wrapper.findComponent({ name: 'AvModal' })

        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(true)
        expect(modal.props('closeButtonLabel')).toBe('Annuler')
      })

      it('then it should display the confirmation message', () => {
        const message = wrapper.find('.b2-regular')

        expect(message.exists()).toBe(true)
        expect(message.text()).toBe('Souhaitez-vous abandonner l\'ajout de votre compétence complémentaire ?')
      })

      it('then it should render only confirm button in footer', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })

        expect(buttons).toHaveLength(1)
        expect(buttons[0].props('label')).toBe('Oui, quitter sans enregistrer')
        expect(buttons[0].props('variant')).toBe('OUTLINED')
        expect(buttons[0].props('theme')).toBe('PRIMARY')
      })
    })

    describe('when the modal is not shown', () => {
      beforeEach(() => {
        wrapper = mountComponent(AddAdditionalSkillConfirmationModal, {
          props: {
            show: false
          },
          global: {
            stubs
          }
        })
      })

      it('then it should not render the modal', () => {
        const modal = wrapper.find('.av-modal-stub')
        expect(modal.exists()).toBe(false)
      })
    })

    describe('when confirm button is clicked', () => {
      it('then it should emit confirm event', async () => {
        const confirmButton = wrapper.findComponent({ name: 'AvButton' })

        await confirmButton.vm.$emit('click')

        expect(wrapper.emitted('confirm')).toHaveLength(1)
        expect(wrapper.emitted('cancel')).toBeUndefined()
      })
    })

    describe('when modal close button is clicked', () => {
      it('then it should emit cancel event', async () => {
        const closeButton = wrapper.find('.close-button')

        await closeButton.trigger('click')

        expect(wrapper.emitted('cancel')).toHaveLength(1)
        expect(wrapper.emitted('confirm')).toBeUndefined()
      })
    })

    describe('when modal close is triggered', () => {
      it('then it should emit cancel event', async () => {
        const modal = wrapper.findComponent({ name: 'AvModal' })

        await modal.vm.$emit('close')

        expect(wrapper.emitted('cancel')).toHaveLength(1)
        expect(wrapper.emitted('confirm')).toBeUndefined()
      })
    })
  })
})
