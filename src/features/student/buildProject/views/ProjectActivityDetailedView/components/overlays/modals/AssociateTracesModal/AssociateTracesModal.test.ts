import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredActivityAssociationType } from '@/api/avenir-esr'
import AssociateTracesModal, {
  type AssociateTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import { ConfirmAssociateTracesModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.stub'
import { TracesTypeSelectStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.stub'
import {
  SelectedAssociateTracesContainerStub
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/SelectedAssociateTracesContainer/SelectedAssociateTracesContainer.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associate traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateTracesModal>>

  const stubs = {
    AvModal: AvModalStub,
    ConfirmAssociateTracesModal: ConfirmAssociateTracesModalStub,
    TracesTypeSelect: TracesTypeSelectStub,
    SelectedAssociateTracesContainer: SelectedAssociateTracesContainerStub
  }

  const props: AssociateTracesModalProps = {
    show: true
  }

  const expectedDummyAssociations = [
    { id: '1', title: '(Placeholder) Trace 1' },
    { id: '2', title: '(Placeholder) Trace 2' },
    { id: '3', title: '(Placeholder) Trace 3' },
    { id: '4', title: '(Placeholder) Trace 4' },
    { id: '5', title: '(Placeholder) Trace 5' },
    { id: '6', title: '(Placeholder) Trace 6' },
    { id: '7', title: '(Placeholder) Trace 7' }
  ]

  const expectedDummyAssociationsAfterDelete = expectedDummyAssociations.filter(trace => trace.id !== '2')

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

    BddTest().then('it should render the selected associate traces container', () => {
      const selectedAssociateTracesContainer = wrapper.findComponent(SelectedAssociateTracesContainerStub)

      expect(selectedAssociateTracesContainer.exists()).toBe(true)
      expect(selectedAssociateTracesContainer.props('traces')).toEqual(expectedDummyAssociations)
    })

    BddTest().then('it should render the confirm associate traces modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)

      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('traces')).toEqual(expectedDummyAssociations)
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

    BddTest().and('the selected associate traces container emits delete event', () => {
      beforeEach(async () => {
        const selectedAssociateTracesContainer = wrapper.findComponent(SelectedAssociateTracesContainerStub)
        selectedAssociateTracesContainer.vm.$emit('delete', '2')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should remove the deleted trace from the selected traces container', () => {
        const selectedAssociateTracesContainer = wrapper.findComponent(SelectedAssociateTracesContainerStub)

        expect(selectedAssociateTracesContainer.props('traces')).toEqual(expectedDummyAssociationsAfterDelete)
      })

      BddTest().then('it should also update the confirm associate traces modal traces', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)

        expect(confirmModal.props('traces')).toEqual(expectedDummyAssociationsAfterDelete)
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
