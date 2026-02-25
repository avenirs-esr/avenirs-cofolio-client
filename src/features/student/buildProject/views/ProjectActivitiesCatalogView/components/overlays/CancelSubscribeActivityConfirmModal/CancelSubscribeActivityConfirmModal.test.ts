import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import CancelSubscribeActivityConfirmModal from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/CancelSubscribeActivityConfirmModal/CancelSubscribeActivityConfirmModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a cancel subscribe activity confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof CancelSubscribeActivityConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(CancelSubscribeActivityConfirmModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.find('[data-testid="cancel-subscribe-activity-confirm-modal__header"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Êtes-vous certain(e) de vouloir abandonner l’inscription à l’activité ?')
    })

    BddTest().and('the user cancels the action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should emit the confirm event', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })
})
