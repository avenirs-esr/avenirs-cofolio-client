import type { VueWrapper } from '@vue/test-utils'
import { BddTest, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import AddAdditionalSkillConfirmationModal from './AddAdditionalSkillConfirmationModal.vue'

const stubs = {
  AvModal: {
    name: 'AvModal',
    props: ['opened', 'closeButtonLabel', 'confirmButtonLabel'],
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

BddTest().given('a confirmation modal component', () => {
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

  BddTest().when('the modal is shown', () => {
    BddTest().then('it should render AvModal with correct props', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
      expect(modal.props('closeButtonLabel')).toBe('Annuler')
    })

    BddTest().then('it should display the confirmation message', () => {
      const message = wrapper.find('.b2-regular')

      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Souhaitez-vous abandonner l\'ajout de votre compétence complémentaire ?')
    })

    BddTest().then('it should render the confirm button', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })
      expect(modal.props('confirmButtonLabel')).toBe('Oui, quitter sans enregistrer')
    })
  })

  BddTest().when('the modal is not shown', () => {
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

    BddTest().then('it should not render the modal', () => {
      const modal = wrapper.find('.av-modal-stub')
      expect(modal.exists()).toBe(false)
    })
  })

  BddTest().when('confirm button is clicked', () => {
    BddTest().then('it should emit confirm event', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

      expect(wrapper.emitted('confirm')).toHaveLength(1)
      expect(wrapper.emitted('cancel')).toBeUndefined()
    })
  })

  BddTest().when('modal close button is clicked', () => {
    BddTest().then('it should emit cancel event', async () => {
      const closeButton = wrapper.find('.close-button')

      await closeButton.trigger('click')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })
  })

  BddTest().when('modal close is triggered', () => {
    BddTest().then('it should emit cancel event', async () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })

      await modal.vm.$emit('close')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })
  })
})
