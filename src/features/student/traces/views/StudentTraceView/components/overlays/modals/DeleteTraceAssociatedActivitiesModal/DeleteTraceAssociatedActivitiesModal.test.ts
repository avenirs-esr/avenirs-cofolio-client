import { DeleteAssociationsModalStub } from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import DeleteTraceAssociatedActivitiesModal from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a delete trace associated activities modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteTraceAssociatedActivitiesModal>>

  const stubs = {
    DeleteAssociationsModal: DeleteAssociationsModalStub,
  }

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedActivitiesModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the delete associations modal', () => {
      const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
      expect(confirmModal.exists()).toBe(true)
    })

    BddTest().and('the delete associations modal emits cancel', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('cancel')
      })

      BddTest().then('the delete associated activities modal should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('confirmDelete')
      })

      BddTest().then('the delete trace associated activities modal should emit deleted', () => {
        expect(wrapper.emitted('deleted')).toBeTruthy()
      })
    })
  })
})
