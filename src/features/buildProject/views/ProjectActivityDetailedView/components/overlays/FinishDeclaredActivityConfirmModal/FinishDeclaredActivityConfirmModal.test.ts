import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import FinishDeclaredActivityConfirmModal, {
  type FinishDeclaredActivityConfirmModalProps,
} from '@/features/buildProject/views/ProjectActivityDetailedView/components/overlays/FinishDeclaredActivityConfirmModal/FinishDeclaredActivityConfirmModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a FinishDeclaredActivityConfirmModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FinishDeclaredActivityConfirmModal>>
  const stubs = { ConfirmationModal: ConfirmationModalStub }

  BddTest().when('the component is mounted with show set to true', () => {
    const props: FinishDeclaredActivityConfirmModalProps = {
      show: true,
    }

    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivityConfirmModal, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
      expect(confirmationModal.props('title')).toBe('Confirmer la finalisation de l\'activité')
      expect(confirmationModal.props('description')).toBe('Êtes-vous certain(e) de vouloir terminer cette activité ? Vous ne pourrez plus la modifier')
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the close event', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
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

  BddTest().when('the component is mounted with show set to false', () => {
    const props: FinishDeclaredActivityConfirmModalProps = {
      show: false,
    }

    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivityConfirmModal, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the confirmation modal with show set to false', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
    })
  })
})
