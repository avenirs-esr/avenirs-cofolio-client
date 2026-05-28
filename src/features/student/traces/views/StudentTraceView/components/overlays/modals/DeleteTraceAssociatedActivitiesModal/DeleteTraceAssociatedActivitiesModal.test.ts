import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { deleteTraceAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeleteAssociationsModalStub } from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import DeleteTraceAssociatedActivitiesModal, {
  type DeleteTraceAssociatedActivitiesModalProps
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

BddTest().given('a delete trace associated activities modal', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof DeleteTraceAssociatedActivitiesModal>>

  const stubs = {
    DeleteAssociationsModal: DeleteAssociationsModalStub,
    CompactCardSelector: CompactCardSelectorStub,
  }

  const associations: DeclaredActivityAssociationDTO[] = [
    {
      associationId: 'assoc-1',
      declaredActivity: {
        id: 'activity-1',
        activityId: 'act-1',
        title: 'Activité 1',
        thematic: EActivityThematic.PROGRAMS,
        status: EDeclaredActivityStatus.IN_PROGRESS,
        summary: 'Summary 1',
        description: '<h3>Description 1</h3><p>Rich text description</p>',
      }
    },
    {
      associationId: 'assoc-2',
      declaredActivity: {
        id: 'activity-2',
        activityId: 'act-2',
        title: 'Activité 2',
        thematic: EActivityThematic.EXPERIENCES,
        status: EDeclaredActivityStatus.COMPLETED,
        summary: 'Summary 2',
        description: '<h3>Description 2</h3><p>Rich text description</p>',
      }
    }
  ]

  const props: DeleteTraceAssociatedActivitiesModalProps = {
    show: true,
    traceId: 'trace-1',
    associations,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteTraceAssociatedActivitiesModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the delete associations modal', () => {
      const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
      expect(confirmModal.exists()).toBe(true)
    })

    BddTest().then('it should render the compact card selector', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.exists()).toBe(true)
    })

    BddTest().then('it should pass selectable elements derived from associations to the compact card selector', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.props('elements')).toEqual([
        { id: 'assoc-1', title: 'Activité 1' },
        { id: 'assoc-2', title: 'Activité 2' },
      ])
    })

    BddTest().then('it should initialize selectedIds as empty', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.props('modelValue')).toEqual([])
    })

    BddTest().and('the user selects associations from the compact card selector', () => {
      beforeEach(() => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        selector.vm.$emit('update:modelValue', ['assoc-1', 'assoc-2'])
      })

      BddTest().then('the selectedIds should be updated accordingly', () => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        expect(selector.props('modelValue')).toEqual(['assoc-1', 'assoc-2'])
      })
    })

    BddTest().and('the delete associations modal emits cancel', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('cancel')
      })

      BddTest().then('the modal should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })

      BddTest().then('the selectedIds should be reset', () => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        expect(selector.props('modelValue')).toEqual([])
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete successfully', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('confirmDelete')
      })

      BddTest().then('the modal should emit deleted', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })

      BddTest().then('it should add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Les associations sélectionnées ont été supprimées avec succès',
          })
        })
      })

      BddTest().then('it should not add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('the selectedIds should be reset', async () => {
        await vi.waitFor(() => {
          const selector = wrapper.findComponent(CompactCardSelectorStub)
          expect(selector.props('modelValue')).toEqual([])
        })
      })
    })
  })

  BddTest().when('deleting associated activities fails', () => {
    beforeEach(() => {
      server.use(deleteTraceAssociationsErrorHandler)

      wrapper = mountComponent(DeleteTraceAssociatedActivitiesModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('confirmDelete')
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: expect.any(String),
          })
        })
      })

      BddTest().then('it should not add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('the modal should not emit deleted', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })
})
