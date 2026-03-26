import type { VueWrapper } from '@vue/test-utils'
import {
  associateTraceWithActivitiesErrorHandler,
  searchActivitiesForAssociationErrorHandler
} from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { DeclaredActivityCompactCardStub } from '@/features/student/buildProject/components/cards/DeclaredActivityCompactCard/DeclaredActivityCompactCard.stub'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import { ConfirmAssociateModalStub } from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import AssociateActivitiesModal, {
  type AssociateActivitiesModalProps
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
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

BddTest().given('an associate activities modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateActivitiesModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    DeclaredActivityCompactCard: DeclaredActivityCompactCardStub
  }

  const props: AssociateActivitiesModalProps = {
    show: true,
    traceId: 'trace-1'
  }

  const selectedActivityOptions = [
    { label: 'Définir ses valeurs', value: 'activity-search-1' },
    { label: 'Explorer ses pistes d\'orientation', value: 'activity-search-2' }
  ]

  const expectedSelectedAssociations = [
    { id: 'activity-search-1', title: 'Définir ses valeurs' },
    { id: 'activity-search-2', title: 'Explorer ses pistes d\'orientation' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateActivitiesModal, {
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
      expect(header.text()).toContain('Quelle(s) activité(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should render the confirm associate activities modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().then('it should load activities from the query and pass enabled ones to the layout', async () => {
      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        const options = layout.props('options')
        expect(options.length).toBeGreaterThan(0)
        expect(options.every((option: { disabled?: boolean }) => !option.disabled)).toBe(true)
      })
    })

    BddTest().then('it should pass the correct initial props to the search association layout', async () => {
      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('modelValue')).toEqual([])
        expect(layout.props('items')).toEqual([])
        expect(layout.props('inputOptions')).toEqual({
          placeholder: 'Entrer le nom d\'une activité'
        })
        expect(layout.props('getOptionKey')).toBeTypeOf('function')
        expect(layout.props('getOptionLabel')).toBeTypeOf('function')
      })
    })

    BddTest().and('the user searches in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('search', 'valeurs')
        await flushPromises()
      })

      BddTest().then('it should filter the options through the query', async () => {
        await vi.waitFor(() => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          const options = layout.props('options')
          expect(options.length).toBeGreaterThanOrEqual(1)
          expect(options[0].label).toContain('valeurs')
        })
      })
    })

    BddTest().and('the user selects activities in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:modelValue', selectedActivityOptions)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the selected items passed to the layout', () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should update the confirm associate activities modal activities', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
        expect(confirmModal.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().and('the search association layout emits delete event', () => {
        beforeEach(async () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          layout.vm.$emit('delete', 'activity-search-2')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted activity from the selected items', () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          expect(layout.props('items')).toEqual([
            { id: 'activity-search-1', title: 'Définir ses valeurs' }
          ])
        })

        BddTest().then('it should update the confirm modal activities', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          expect(confirmModal.props('items')).toEqual([
            { id: 'activity-search-1', title: 'Définir ses valeurs' }
          ])
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AvModalStub)
          modal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the confirm associate activities modal', () => {
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

          BddTest().then('it should not emit associated event', () => {
            expect(wrapper.emitted('associated')).toBeFalsy()
          })
        })

        BddTest().and('the confirm modal emits confirm event successfully', () => {
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

          BddTest().then('it should hide the confirm modal', async () => {
            await vi.waitFor(() => {
              const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
              expect(confirmModal.props('show')).toBe(false)
            })
          })

          BddTest().then('it should show a success toaster with the correct count', async () => {
            await vi.waitFor(() => {
              expect(mockAddSuccessMessage).toHaveBeenCalledWith({
                timeout: 2000,
                description: expect.stringContaining('2')
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

  BddTest().when('loading activities fails', () => {
    beforeEach(async () => {
      server.use(searchActivitiesForAssociationErrorHandler)

      wrapper = mountComponent(AssociateActivitiesModal, {
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

  BddTest().when('associating activities fails', () => {
    beforeEach(async () => {
      server.use(associateTraceWithActivitiesErrorHandler)

      wrapper = mountComponent(AssociateActivitiesModal, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('options').length).toBeGreaterThan(0)
      })

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:modelValue', selectedActivityOptions)
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
