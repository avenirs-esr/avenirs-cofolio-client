import type { VueWrapper } from '@vue/test-utils'
import {
  SKILL_ID_WITH_TRACE_ASSOCIATION_ERROR
} from '@/__mocks__/msw/handlers/student/skills.handlers'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import AssociateTracesToDeclaredSkillModal, {
  type AssociateTracesToDeclaredSkillModalProps
} from '@/features/student/declaredSkills/components/overlays/modals/AssociateTracesToDeclaredSkillModal/AssociateTracesToDeclaredSkillModal.vue'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import {
  ConfirmAssociateModalStub
} from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { TraceAssociationTypes } from '@/features/student/traces'
import { TraceCompactCardStub } from '@/features/student/traces/components/cards/TraceCompactCard/TraceCompactCard.stub'
import { TracesTypeSelectStub } from '@/features/student/traces/components/interactions/pickers/TracesTypeSelect/TracesTypeSelect.stub'
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

BddTest().given('an associate traces to declared skill modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateTracesToDeclaredSkillModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    TracesTypeSelect: TracesTypeSelectStub,
    TraceCompactCard: TraceCompactCardStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const props: AssociateTracesToDeclaredSkillModalProps = {
    show: true,
    declaredSkillId: 'declared-skill-1'
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
      wrapper = mountComponent(AssociateTracesToDeclaredSkillModal, {
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

    BddTest().then('it should render the cancel confirmation modal hidden by default', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
    })

    BddTest().then('it should load unassociated traces from the query and pass them to the layout', async () => {
      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        const options = layout.props('options')

        expect(options.length).toBeGreaterThan(0)
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

          BddTest().then('it should hide the confirm associate traces modal once the parent closes the modal', async () => {
            await wrapper.setProps({ show: false })
            await wrapper.vm.$nextTick()

            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            expect(confirmModal.props('show')).toBe(false)
          })

          BddTest().then('it should not show an error toaster', () => {
            expect(mockAddErrorMessage).not.toHaveBeenCalled()
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

        BddTest().then('it should not emit cancel event immediately', () => {
          expect(wrapper.emitted('cancel')).toBeFalsy()
        })

        BddTest().and('the cancel confirmation modal emits close event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('close')

            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit cancel event', () => {
            expect(wrapper.emitted('cancel')).toBeFalsy()
          })
        })

        BddTest().and('the cancel confirmation modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('confirm')

            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should emit cancel event', () => {
            expect(wrapper.emitted('cancel')).toBeTruthy()
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
      wrapper = mountComponent(AssociateTracesToDeclaredSkillModal, {
        props,
        global: { stubs }
      })

      await flushPromises()

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:search', 'INVALID_KEYWORD')

      await flushPromises()
    })

    BddTest().then('it should add an error toaster message and no success toaster', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
          description: 'Erreur serveur interne',
        })
      })

      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should pass empty options to the layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('options')).toEqual([])
    })
  })

  BddTest().when('associating traces fails', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateTracesToDeclaredSkillModal, {
        props: { ...props, declaredSkillId: SKILL_ID_WITH_TRACE_ASSOCIATION_ERROR },
        global: { stubs }
      })

      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('options').length).toBeGreaterThan(0)
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

      BddTest().then('it should add an error toaster message and no success toaster', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Erreur serveur interne',
          })
        })

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
