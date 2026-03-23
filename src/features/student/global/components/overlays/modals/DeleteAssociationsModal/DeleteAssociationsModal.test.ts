import type { DeleteAssociationsModalProps } from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { DeleteAssociationsConfirmModalStub } from '@/features/student/global/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.stub'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a DeleteAssociationsModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteAssociationsModal>>

  const stubs = {
    AvModal: AvModalStub,
    DeleteAssociationsConfirmModal: DeleteAssociationsConfirmModalStub
  }

  BddTest().when('the component is mounted with props and a slot', () => {
    const props: DeleteAssociationsModalProps = {
      show: true,
      associations: [
        { id: '1', title: 'Association 1' },
        { id: '2', title: 'Association 2' }
      ],
      selectedAssociationIds: ['1'],
      isLoading: false
    }

    const slots = {
      default: '<div data-testid="modal-content">Modal Content</div>'
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsModal, { props, slots, global: { stubs } })
    })

    BddTest().then('it should render the correct label for the confirm button', () => {
      expect(wrapper.findComponent(AvModalStub).props('confirmButtonLabel')).toBe('Supprimer l\'association sélectionnée (1)')
    })

    BddTest().then('it should render the correct content in the modal', () => {
      expect(wrapper.find('[data-testid="modal-content"]').exists()).toBe(true)
    })

    BddTest().then('it should emit "cancel" when the cancel button is clicked', async () => {
      await wrapper.findComponent(AvModalStub).vm.$emit('close')
      expect(wrapper.emitted()).toHaveProperty('cancel')
    })

    BddTest().and('the user confirms the deletion in the confirm modal', () => {
      beforeEach(() => {
        wrapper.findComponent(DeleteAssociationsConfirmModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should emit "confirmDelete"', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted()).toHaveProperty('confirmDelete')
        })
      })
    })
  })
})
