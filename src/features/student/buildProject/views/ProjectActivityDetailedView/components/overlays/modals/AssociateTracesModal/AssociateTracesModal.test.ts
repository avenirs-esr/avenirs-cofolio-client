import type { VueWrapper } from '@vue/test-utils'
import {
  associateActivityWithTracesErrorHandler,
  searchTracesForAssociationErrorHandler
} from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { TraceAssociationTypes } from '@/features/student/buildProject/types/trace-association.types'
import { TraceCompactCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.stub'
import AssociateTracesModal, {
  type AssociateTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import { TracesTypeSelectStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import {
  ConfirmAssociateModalStub
} from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    }),
  }
})

BddTest().given('an associate traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateTracesModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    TracesTypeSelect: TracesTypeSelectStub,
    TraceCompactCard: TraceCompactCardStub
  }

  const props: AssociateTracesModalProps = {
    show: true,
    declaredActivityId: 'declared-activity-1'
  }

  const selectedTraceOptions = [
    { label: 'Ma super trace non associée numéro 1', value: 'trace-non-associee1', disabled: false },
    { label: 'Ma super trace non associée numéro 2', value: 'trace-non-associee2', disabled: false }
  ]

  const expectedSelectedAssociations = [
    { id: 'trace-non-associee1', title: 'Ma super trace non associée numéro 1' },
    { id: 'trace-non-associee2', title: 'Ma super trace non associée numéro 2' }
  ]

  const expectedSelectedAssociationsAfterDelete = [
    { id: 'trace-non-associee1', title: 'Ma super trace non associée numéro 1' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })

      await flushPromises()
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

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)

      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should initialize the traces type select with UNASSOCIATED', () => {
      const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

      expect(tracesTypeSelect.exists()).toBe(true)
      expect(tracesTypeSelect.props('modelValue')).toEqual({
        itemId: TraceAssociationTypes.UNASSOCIATED
      })
    })

    BddTest().then('it should render the confirm associate traces modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().then('it should load unassociated traces from the query and pass them to the layout', async () => {
      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        const options = layout.props('options')

        expect(options).toHaveLength(5)
        expect(options).toEqual([
          { label: 'Ma super trace non associée numéro 1', value: 'trace-non-associee1', disabled: false },
          { label: 'Ma super trace non associée numéro 2', value: 'trace-non-associee2', disabled: false },
          { label: 'Ma super trace non associée numéro 3', value: 'trace-non-associee3', disabled: false },
          { label: 'Ma super trace non associée numéro 4', value: 'trace-non-associee4', disabled: false },
          { label: 'Ma super trace non associée numéro 5', value: 'trace-non-associee5', disabled: false }
        ])
      })
    })

    BddTest().then('it should pass the correct initial props to the search association layout', async () => {
      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)

        expect(layout.props('modelValue')).toEqual([])
        expect(layout.props('items')).toEqual([])
        expect(layout.props('inputOptions')).toEqual({
          placeholder: 'Rechercher une trace non associée'
        })
        expect(layout.props('getOptionKey')).toBeTypeOf('function')
        expect(layout.props('getOptionLabel')).toBeTypeOf('function')
      })
    })

    BddTest().and('the user changes the selected trace type to ALL', () => {
      beforeEach(async () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)
        tracesTypeSelect.vm.$emit('update:modelValue', {
          itemId: TraceAssociationTypes.ALL
        })

        await flushPromises()
      })

      BddTest().then('it should update the traces type select model value', () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

        expect(tracesTypeSelect.props('modelValue')).toEqual({
          itemId: TraceAssociationTypes.ALL
        })
      })

      BddTest().then('it should load both associated and unassociated traces', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          const options = layout.props('options')

          expect(options).toHaveLength(10)
        })
      })

      BddTest().then('it should update the search placeholder', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)

          expect(layout.props('inputOptions')).toEqual({
            placeholder: 'Rechercher une trace'
          })
        })
      })
    })

    BddTest().and('the user changes the selected trace type to ASSOCIATED', () => {
      beforeEach(async () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)
        tracesTypeSelect.vm.$emit('update:modelValue', {
          itemId: TraceAssociationTypes.ASSOCIATED
        })

        await flushPromises()
      })

      BddTest().then('it should update the traces type select model value', () => {
        const tracesTypeSelect = wrapper.findComponent(TracesTypeSelectStub)

        expect(tracesTypeSelect.props('modelValue')).toEqual({
          itemId: TraceAssociationTypes.ASSOCIATED
        })
      })

      BddTest().then('it should load only associated traces', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          const options = layout.props('options')

          expect(options).toHaveLength(5)
          expect(options.every((option: { disabled: boolean }) => !option.disabled)).toBe(true)
        })
      })

      BddTest().then('it should update the search placeholder', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)

          expect(layout.props('inputOptions')).toEqual({
            placeholder: 'Rechercher une trace associée'
          })
        })
      })
    })

    BddTest().and('the user searches in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:search', 'numéro 1')

        await flushPromises()
      })

      BddTest().then('it should filter the options through the query', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)

          expect(layout.props('options')).toEqual([
            { label: 'Ma super trace non associée numéro 1', value: 'trace-non-associee1', disabled: false }
          ])
        })
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

      BddTest().then('it should update the confirm associate traces modal traces', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

        expect(confirmModal.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().and('the search association layout emits delete event', () => {
        beforeEach(async () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          layout.vm.$emit('delete', 'trace-non-associee2')

          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted trace from the selected items', () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)

          expect(layout.props('items')).toEqual(expectedSelectedAssociationsAfterDelete)
        })

        BddTest().then('it should also update the confirm associate traces modal traces', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

          expect(confirmModal.props('items')).toEqual(expectedSelectedAssociationsAfterDelete)
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AvModalStub)
          modal.vm.$emit('confirm')

          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the confirm associate traces modal', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          expect(confirmModal.props('show')).toBe(true)
        })

        BddTest().and('the confirm associate traces modal emits cancel event', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('cancel')

            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the confirm associate traces modal', () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            expect(confirmModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit associated event', () => {
            expect(wrapper.emitted('associated')).toBeFalsy()
          })
        })

        BddTest().and('the confirm associate traces modal emits confirm event successfully', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('confirm')

            await flushPromises()
          })

          BddTest().then('it should emit associated event', async () => {
            await vi.waitFor(() => {
              expect(wrapper.emitted('associated')).toBeTruthy()
            })
          })

          BddTest().then('it should hide the confirm associate traces modal', async () => {
            await vi.waitFor(() => {
              const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
              expect(confirmModal.props('show')).toBe(false)
            })
          })

          BddTest().then('it should show a success toaster with the correct count', async () => {
            await vi.waitFor(() => {
              expect(mockAddSuccessMessage).toHaveBeenCalledWith({
                timeout: 2000,
                description: 'Vous avez associé 2 traces. Retrouvez-les dans la catégorie "Mes traces associées".'
              })
            })
          })

          BddTest().then('it should not show an error toaster', () => {
            expect(mockAddErrorMessage).not.toHaveBeenCalled()
          })
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
  })

  BddTest().when('loading traces fails', () => {
    beforeEach(async () => {
      server.use(searchTracesForAssociationErrorHandler)

      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })

      await flushPromises()
    })

    BddTest().then('it should add an error toaster message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
          description: 'Internal Server Error',
        })
      })
    })

    BddTest().then('it should not add a success toaster message', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should pass empty options to the layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('options')).toEqual([])
    })
  })

  BddTest().when('associating traces fails', () => {
    beforeEach(async () => {
      server.use(associateActivityWithTracesErrorHandler)

      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('options')).toHaveLength(5)
      })

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:modelValue', selectedTraceOptions)
      await wrapper.vm.$nextTick()
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvModalStub).vm.$emit('confirm')
        await wrapper.vm.$nextTick()

        wrapper.findComponent(ConfirmAssociateModalStub).vm.$emit('confirm')
        await flushPromises()
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Internal Server Error',
          })
        })
      })

      BddTest().then('it should not add a success toaster message', () => {
        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should not emit associated event', () => {
        expect(wrapper.emitted('associated')).toBeFalsy()
      })

      BddTest().then('it should keep the confirm modal opened', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
        expect(confirmModal.props('show')).toBe(true)
      })
    })
  })
})
