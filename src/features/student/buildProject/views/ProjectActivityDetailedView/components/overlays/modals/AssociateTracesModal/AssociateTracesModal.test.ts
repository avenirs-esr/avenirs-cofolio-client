import type { VueWrapper } from '@vue/test-utils'
import { associateActivityWithTracesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EDeclaredActivityAssociationType } from '@/api/avenir-esr'
import AssociateTracesModal, {
  type AssociateTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import { ConfirmAssociateTracesModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.stub'
import { TracesTypeSelectStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    ConfirmAssociateTracesModal: ConfirmAssociateTracesModalStub,
    TracesTypeSelect: TracesTypeSelectStub
  }

  const props: AssociateTracesModalProps = {
    show: true,
    declaredActivityId: 'declared-activity-1'
  }

  const selectedTraceOptions = [
    { label: 'Prévenir la pollution à la source', value: 'trace1' },
    { label: 'Mettre en place des filières d’économies circulaires', value: 'trace2' }
  ]

  const expectedSelectedAssociations = [
    { id: 'trace1', title: 'Prévenir la pollution à la source' },
    { id: 'trace2', title: 'Mettre en place des filières d’économies circulaires' }
  ]

  const expectedSelectedAssociationsAfterDelete = [
    { id: 'trace1', title: 'Prévenir la pollution à la source' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

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

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)

      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)

      expect(layout.props('modelValue')).toEqual([])
      expect(layout.props('traces')).toEqual([])
      expect(layout.props('options')).toEqual([
        { label: 'Prévenir la pollution à la source', value: 'trace1' },
        { label: 'Mettre en place des filières d’économies circulaires', value: 'trace2' },
        { label: 'Évaluer l’impact environnemental et économique', value: 'trace3' }
      ])
      expect(layout.props('inputOptions')).toEqual({
        placeholder: 'Rechercher une trace non associée'
      })
      expect(layout.props('getOptionKey')).toBeTypeOf('function')
      expect(layout.props('getOptionLabel')).toBeTypeOf('function')
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
      expect(confirmModal.props('traces')).toEqual([])
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

    BddTest().and('the user searches in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('search', 'pollution')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should filter the options passed to the layout', () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)

        expect(layout.props('options')).toEqual([
          { label: 'Prévenir la pollution à la source', value: 'trace1' }
        ])
      })
    })

    BddTest().and('the user selects traces in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:modelValue', selectedTraceOptions)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the selected traces passed to the layout', () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)

        expect(layout.props('traces')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should update the confirm associate traces modal traces', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)

        expect(confirmModal.props('traces')).toEqual(expectedSelectedAssociations)
      })

      BddTest().and('the search association layout emits delete event', () => {
        beforeEach(async () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          layout.vm.$emit('delete', 'trace2')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted trace from the selected traces', () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)

          expect(layout.props('traces')).toEqual(expectedSelectedAssociationsAfterDelete)
        })

        BddTest().then('it should also update the confirm associate traces modal traces', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)

          expect(confirmModal.props('traces')).toEqual(expectedSelectedAssociationsAfterDelete)
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

        BddTest().and('the confirm associate traces modal emits confirm event successfully', () => {
          beforeEach(async () => {
            await wrapper.vm.$nextTick()
            wrapper.findComponent(ConfirmAssociateTracesModalStub).vm.$emit('confirm')
          })

          BddTest().then('it should emit associated event', async () => {
            await vi.waitFor(() => {
              expect(wrapper.emitted('associated')).toBeTruthy()
            })
          })

          BddTest().then('it should hide the confirm associate traces modal', async () => {
            await vi.waitFor(() => {
              const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
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

          BddTest().then('it should not show an error toaster', async () => {
            await vi.waitFor(() => {
              expect(mockAddErrorMessage).not.toHaveBeenCalled()
            })
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

  BddTest().when('associating traces fails', () => {
    beforeEach(async () => {
      server.use(associateActivityWithTracesErrorHandler)

      wrapper = mountComponent(AssociateTracesModal, {
        props,
        global: { stubs }
      })

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:modelValue', selectedTraceOptions)
      await wrapper.vm.$nextTick()
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvModalStub).vm.$emit('confirm')
        await wrapper.vm.$nextTick()
        wrapper.findComponent(ConfirmAssociateTracesModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Internal Server Error',
          })
        })
      })

      BddTest().then('it should not add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should not emit associated event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('associated')).toBeFalsy()
        })
      })

      BddTest().then('it should keep the confirm modal opened', async () => {
        await vi.waitFor(() => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateTracesModalStub)
          expect(confirmModal.props('show')).toBe(true)
        })
      })
    })
  })
})
