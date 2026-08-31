import type { AssociationSearchResultTraceDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { SearchAssociationLayoutStub } from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import {
  ConfirmAssociateModalStub
} from '@/features/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { TraceCompactCardStub } from '@/features/traces/components/cards/TraceCompactCard/TraceCompactCard.stub'
import { TracesTypeSelectStub } from '@/features/traces/components/interactions/pickers/TracesTypeSelect/TracesTypeSelect.stub'
import AssociateTracesModal, {
  type AssociateTracesModalProps
} from '@/features/traces/components/modals/AssociateTracesModal/AssociateTracesModal.vue'
import { TraceAssociationTypes } from '@/features/traces/types/trace-association.types'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associate traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateTracesModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    TracesTypeSelect: TracesTypeSelectStub,
    TraceCompactCard: TraceCompactCardStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const traces: AssociationSearchResultTraceDTO[] = [
    { id: 'trace-search-1', title: 'Ma super trace numéro 1', disabled: false },
    { id: 'trace-search-2', title: 'Ma super trace numéro 2', disabled: false },
    { id: 'trace-search-3', title: 'Ma super trace numéro 3', disabled: true }
  ]

  const props: AssociateTracesModalProps = {
    show: true,
    traces,
    selectedTraceType: { itemId: TraceAssociationTypes.UNASSOCIATED },
    isLoading: false
  }

  const selectedTraceOptions = [
    { label: 'Ma super trace numéro 1', value: 'trace-search-1' },
    { label: 'Ma super trace numéro 2', value: 'trace-search-2' }
  ]

  const expectedSelectedAssociations = [
    { id: 'trace-search-1', title: 'Ma super trace numéro 1' },
    { id: 'trace-search-2', title: 'Ma super trace numéro 2' }
  ]

  BddTest().when('the modal is rendered', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should render the modal with correct opened prop', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the correct title', () => {
      const header = wrapper.find('[data-testid="header"]')
      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Quelle(s) trace(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should render the confirm associate modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().then('it should render the cancel confirmation modal hidden by default', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
    })

    BddTest().then('it should pass the traces type select the current selected trace type', () => {
      const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)
      expect(tracesTypeSelect.exists()).toBe(true)
      expect(tracesTypeSelect.props('modelValue')).toEqual({
        itemId: TraceAssociationTypes.UNASSOCIATED
      })
    })

    BddTest().then('it should pass all the traces to the layout options', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('options')).toEqual([
        { label: 'Ma super trace numéro 1', value: 'trace-search-1', disabled: false },
        { label: 'Ma super trace numéro 2', value: 'trace-search-2', disabled: false },
        { label: 'Ma super trace numéro 3', value: 'trace-search-3', disabled: true }
      ])
    })

    BddTest().then('it should pass the correct initial props to the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('modelValue')).toEqual([])
      expect(layout.props('items')).toEqual([])
      expect(layout.props('inputOptions')).toEqual({
        placeholder: 'Rechercher une trace non associée',
      })
      expect(layout.props('getOptionKey')).toBeTypeOf('function')
      expect(layout.props('getOptionLabel')).toBeTypeOf('function')
    })

    BddTest().then('it should disable the confirm button', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should pass isLoading to the modal', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('isLoading')).toBe(false)
    })

    BddTest().and('the traces type select emits an update', () => {
      beforeEach(async () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)
        tracesTypeSelect.vm.$emit('update:modelValue', { itemId: TraceAssociationTypes.ALL })
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit update:selectedTraceType', () => {
        expect(wrapper.emitted('update:selectedTraceType')).toEqual([[
          { itemId: TraceAssociationTypes.ALL }
        ]])
      })
    })

    BddTest().and('the user searches in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:search', 'numéro 1')
        await flushPromises()
      })

      BddTest().then('it should emit search', () => {
        expect(wrapper.emitted('search')).toEqual([['numéro 1']])
      })
    })

    BddTest().and('the user selects traces in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:modelValue', selectedTraceOptions)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the selected items passed to the layout', () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should update the confirm associate modal items', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
        expect(confirmModal.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should enable the confirm button', () => {
        const modal = wrapper.findComponent(AvModalStub)
        expect(modal.props('confirmButtonDisabled')).toBe(false)
      })

      BddTest().then('it should display the pluralized confirm button label', () => {
        const modal = wrapper.findComponent(AvModalStub)
        expect(modal.props('confirmButtonLabel')).toBe('Associer les traces sélectionnées (2)')
      })

      BddTest().and('the search association layout emits delete event', () => {
        beforeEach(async () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          layout.vm.$emit('delete', 'trace-search-2')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted trace from the selected items', () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          expect(layout.props('items')).toEqual([
            { id: 'trace-search-1', title: 'Ma super trace numéro 1' }
          ])
        })

        BddTest().then('it should update the confirm modal items', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          expect(confirmModal.props('items')).toEqual([
            { id: 'trace-search-1', title: 'Ma super trace numéro 1' }
          ])
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AvModalStub)
          modal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the confirm associate modal', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          expect(confirmModal.props('show')).toBe(true)
        })

        BddTest().and('the confirm modal emits cancel event', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('cancel')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the confirm modal', () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            expect(confirmModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit associate', () => {
            expect(wrapper.emitted('associate')).toBeFalsy()
          })
        })

        BddTest().and('the confirm modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('confirm')
            await flushPromises()
          })

          BddTest().then('it should emit associate with selected ids', () => {
            expect(wrapper.emitted('associate')).toEqual([[
              ['trace-search-1', 'trace-search-2']
            ]])
          })
        })
      })

      BddTest().and('the modal emits close event', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AvModalStub)
          modal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the cancel confirmation modal', () => {
          const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
          expect(confirmationModal.props('show')).toBe(true)
        })

        BddTest().then('it should not emit cancel immediately', () => {
          expect(wrapper.emitted('cancel')).toBeFalsy()
        })

        BddTest().and('the confirmation modal emits close event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('close')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit cancel', () => {
            expect(wrapper.emitted('cancel')).toBeFalsy()
          })
        })

        BddTest().and('the confirmation modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should emit cancel', () => {
            expect(wrapper.emitted('cancel')).toBeTruthy()
          })
        })
      })
    })

    BddTest().and('the modal emits close event with no selection', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should emit cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })

  BddTest().when('the show prop becomes false after a selection', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:modelValue', selectedTraceOptions)
      await wrapper.vm.$nextTick()

      const modal = wrapper.findComponent(AvModalStub)
      modal.vm.$emit('confirm')
      await wrapper.vm.$nextTick()

      await wrapper.setProps({ show: false })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should reset the selected items', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('items')).toEqual([])
      expect(layout.props('modelValue')).toEqual([])
    })

    BddTest().then('it should hide the confirm associate modal', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.props('show')).toBe(false)
    })
  })

  BddTest().when('the modal is rendered with isLoading true', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateTracesModal, {
        props: {
          ...props,
          isLoading: true
        },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should pass loading state to the modal', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('isLoading')).toBe(true)
    })
  })
})
