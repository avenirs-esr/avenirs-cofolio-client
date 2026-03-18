import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredActivityAssociationType } from '@/api/avenir-esr'
import AssociateTracesModal, {
  type AssociateTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import { ConfirmAssociateTracesModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.stub'
import { TracesTypeSelectStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associate traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateTracesModal>>

  const stubs = {
    AvModal: AvModalStub,
    ConfirmAssociateTracesModal: ConfirmAssociateTracesModalStub,
    TracesTypeSelect: TracesTypeSelectStub
  }

  const props: AssociateTracesModalProps = {
    show: true
  }

  BddTest().when('the modal is rendered', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the modal with correct props', () => {
      const modal = wrapper.findComponent(AvModalStub)

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the correct title', () => {
      const header = wrapper.find('[data-testid="header"]')

      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Quelle(s) trace(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the traces type select', () => {
      const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

      expect(tracesTypeSelect.exists()).toBe(true)
    })

    BddTest().then('it should initialize the traces type select with TRACE', () => {
      const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

      expect(tracesTypeSelect.props('modelValue')).toEqual({
        itemId: EDeclaredActivityAssociationType.TRACE
      })
    })

    BddTest().then('it should render the confirm associate traces modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)

      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('traces')).toEqual([
        { id: '1', title: '(Placeholder) Trace 1' },
        { id: '2', title: '(Placeholder) Trace 2' },
        { id: '3', title: '(Placeholder) Trace 3' }
      ])
    })

    BddTest().and('the user changes the selected trace type', () => {
      beforeEach(async () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)
        tracesTypeSelect.vm.$emit('update:modelValue', {
          itemId: EDeclaredActivityAssociationType.TRACE
        })
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the traces type select model value', () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

        expect(tracesTypeSelect.props('modelValue')).toEqual({
          itemId: EDeclaredActivityAssociationType.TRACE
        })
      })
    })

    BddTest().and('the modal emits close event', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should emit cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the modal emits confirm event', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should show the confirm associate traces modal', async () => {
        await wrapper.vm.$nextTick()

        const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
        expect(confirmModal.props('show')).toBe(true)
      })

      BddTest().and('the confirm associate traces modal emits cancel event', () => {
        beforeEach(async () => {
          await wrapper.vm.$nextTick()

          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
          confirmModal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the confirm associate traces modal', async () => {
          await wrapper.vm.$nextTick()

          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
          expect(confirmModal.props('show')).toBe(false)
        })

        BddTest().then('it should not emit associated event', () => {
          expect(wrapper.emitted('associated')).toBeFalsy()
        })
      })

      BddTest().and('the confirm associate traces modal emits confirm event', () => {
        beforeEach(async () => {
          await wrapper.vm.$nextTick()

          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
          confirmModal.vm.$emit('confirm')
        })

        BddTest().then('it should emit associated event', async () => {
          await wrapper.vm.$nextTick()
          expect(wrapper.emitted('associated')).toBeTruthy()
        })

        BddTest().then('it should hide the confirm associate traces modal', async () => {
          await wrapper.vm.$nextTick()

          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
          expect(confirmModal.props('show')).toBe(false)
        })
      })
    })
  })
})
