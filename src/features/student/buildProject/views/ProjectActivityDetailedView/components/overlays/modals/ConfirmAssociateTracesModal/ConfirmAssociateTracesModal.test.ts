import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ConfirmAssociateTracesModal
, {
  type ConfirmAssociateTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a confirm associate traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmAssociateTracesModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted with a single trace', () => {
    const props: ConfirmAssociateTracesModalProps = {
      show: true,
      traces: [{ id: 'trace-1', title: 'Trace 1' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(ConfirmAssociateTracesModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
    })

    BddTest().then('it should not render the traces list', () => {
      expect(wrapper.find('[data-testid="confirm-associate-traces-modal__traces-list"]').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Trace 1')
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

      BddTest().then('it should emit the confirmed event', () => {
        expect(wrapper.emitted('confirmed')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted with multiple traces', () => {
    const props: ConfirmAssociateTracesModalProps = {
      show: true,
      traces: [
        { id: 'trace-1', title: 'Trace 1' },
        { id: 'trace-2', title: 'Trace 2' }
      ]
    }

    beforeEach(() => {
      wrapper = mountComponent(ConfirmAssociateTracesModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
    })

    BddTest().then('it should render the traces list', () => {
      const tracesList = wrapper.find('[data-testid="confirm-associate-traces-modal__traces-list"]')

      expect(tracesList.exists()).toBe(true)
      expect(wrapper.text()).toContain('Trace 1')
      expect(wrapper.text()).toContain('Trace 2')
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should emit the confirmed event', () => {
        expect(wrapper.emitted('confirmed')).toBeTruthy()
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
