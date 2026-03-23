import type { DeleteAssociationsConfirmModalProps } from '@/features/student/global/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteAssociationsConfirmModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a DeleteAssociationsModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteAssociationsConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
  }

  BddTest().when('the component is mounted without associations', () => {
    const props: DeleteAssociationsConfirmModalProps = {
      show: true,
      associations: []
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should not render the associations list', () => {
      expect(wrapper.find('[data-testid="delete-associations-confirm-modal__associations-list"]').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with associations', () => {
    const props: DeleteAssociationsConfirmModalProps = {
      show: true,
      associations: [
        { id: '1', title: 'Association 1' },
        { id: '2', title: 'Association 2' }
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the associations list', () => {
      expect(wrapper.find('[data-testid="delete-associations-confirm-modal__associations-list"]').exists()).toBe(true)
    })

    BddTest().and('the user clicks the cancel button', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('it should emit "cancel"', () => {
        expect(wrapper.emitted()).toHaveProperty('cancel')
      })
    })

    BddTest().and('the user clicks the confirm button', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should emit "confirm"', () => {
        expect(wrapper.emitted()).toHaveProperty('confirm')
      })
    })
  })
})
