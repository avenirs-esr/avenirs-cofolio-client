import type { VueWrapper } from '@vue/test-utils'
import { deleteDeclaredActivityAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import DeleteActivityAssociatedTracesModal, {
  type DeleteActivityAssociatedTracesModalProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.vue'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeleteAssociationsModalStub } from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
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

BddTest().given('a delete activity associated traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteActivityAssociatedTracesModal>>

  const stubs = {
    CompactCardSelector: CompactCardSelectorStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub,
  }

  const props: DeleteActivityAssociatedTracesModalProps = {
    show: true,
    declaredActivityId: 'declared-activity-1',
    associations: [
      {
        id: 'association-1',
        title: 'Trace 1'
      },
      {
        id: 'association-2',
        title: 'Trace 2'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityAssociatedTracesModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the delete associations modal', () => {
      const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
      expect(confirmModal.exists()).toBe(true)
    })

    BddTest().and('the delete associations modal emits cancel', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('cancel')
      })

      BddTest().then('the delete activity associated traces modal should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user selects traces to delete from the selector', () => {
      beforeEach(() => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        selector.vm.$emit('update:modelValue', ['association-1', 'association-2'])
      })

      BddTest().then('the selectedIds should be updated accordingly', () => {
        expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue')).toEqual(['association-1', 'association-2'])
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete successfully', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('confirmDelete')
      })

      BddTest().then('the delete activity associated traces modal should emit deleted', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })

      BddTest().then('it should add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Les associations sélectionnées ont été supprimées avec succès.',
          })
        })
      })

      BddTest().then('it should not add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('deleting associated traces fails', () => {
    beforeEach(() => {
      server.use(deleteDeclaredActivityAssociationsErrorHandler)

      wrapper = mountComponent(DeleteActivityAssociatedTracesModal, {
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

      BddTest().then('the delete activity associated traces modal should not emit deleted', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })
})
