import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ConfirmAssociateModal, {
  type ConfirmAssociateModalProps
} from '@/features/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a confirm associate modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmAssociateModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted with a single item', () => {
    const props: ConfirmAssociateModalProps = {
      show: true,
      title: 'Confirm association title',
      items: [{ id: 'item-1', title: 'Item 1' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(ConfirmAssociateModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
    })

    BddTest().then('it should render the provided title', () => {
      expect(wrapper.text()).toContain('Confirm association title')
    })

    BddTest().then('it should render the item list', () => {
      const itemsList = wrapper.find('[data-testid="confirm-associate-modal__items-list"]')

      expect(itemsList.exists()).toBe(true)
      expect(wrapper.text()).toContain('Item 1')
    })

    BddTest().and('the user cancels the association', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should emit the confirm event', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted with multiple items', () => {
    const props: ConfirmAssociateModalProps = {
      show: true,
      title: 'Confirm multiple association title',
      items: [
        { id: 'item-1', title: 'Item 1' },
        { id: 'item-2', title: 'Item 2' }
      ]
    }

    beforeEach(() => {
      wrapper = mountComponent(ConfirmAssociateModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
    })

    BddTest().then('it should render all items', () => {
      expect(wrapper.text()).toContain('Item 1')
      expect(wrapper.text()).toContain('Item 2')
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should emit the confirm event', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })

    BddTest().and('the user cancels the association', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })
})
