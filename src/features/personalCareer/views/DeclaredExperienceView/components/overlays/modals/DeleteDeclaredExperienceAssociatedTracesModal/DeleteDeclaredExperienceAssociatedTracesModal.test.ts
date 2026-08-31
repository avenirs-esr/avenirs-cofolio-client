import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { deleteDeclaredExperienceAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { CompactCardSelectorStub } from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeleteAssociationsModalStub } from '@/features/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import DeleteDeclaredExperienceAssociatedTracesModal, {
  type DeleteDeclaredExperienceAssociatedTracesModalProps
} from '@/features/personalCareer/views/DeclaredExperienceView/components/overlays/modals/DeleteDeclaredExperienceAssociatedTracesModal/DeleteDeclaredExperienceAssociatedTracesModal.vue'
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

BddTest().given('a delete declared experience associated traces modal', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof DeleteDeclaredExperienceAssociatedTracesModal>>

  const stubs = {
    DeleteAssociationsModal: DeleteAssociationsModalStub,
    CompactCardSelector: CompactCardSelectorStub,
  }

  const associations: TraceAssociationDTO[] = mockedTraceOverview.map((trace, index) => ({
    associationId: `declared-experience-trace-association-${index + 1}`,
    trace
  }))

  const props: DeleteDeclaredExperienceAssociatedTracesModalProps = {
    show: true,
    experienceId: 'experience-1',
    associations,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceAssociatedTracesModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the delete associations modal', () => {
      expect(wrapper.findComponent(DeleteAssociationsModalStub).exists()).toBe(true)
    })

    BddTest().then('it should render the compact card selector', () => {
      expect(wrapper.findComponent(CompactCardSelectorStub).exists()).toBe(true)
    })

    BddTest().then('it should map associations to id and title only', () => {
      const expectedElements = associations.map(({ associationId, trace }) => ({
        id: associationId,
        title: trace.title
      }))
      expect(wrapper.findComponent(CompactCardSelectorStub).props('elements')).toEqual(expectedElements)
      expect(wrapper.findComponent(DeleteAssociationsModalStub).props('associations')).toEqual(expectedElements)
    })

    BddTest().then('it should initialize selectedIds as empty', () => {
      expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue')).toEqual([])
    })

    BddTest().and('the user selects associations from the selector', () => {
      beforeEach(async () => {
        await wrapper.findComponent(CompactCardSelectorStub)
          .vm
          .$emit('update:modelValue', [associations[0].associationId, associations[1].associationId])
      })

      BddTest().then('the selectedIds should be updated accordingly', () => {
        expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue'))
          .toEqual([associations[0].associationId, associations[1].associationId])
      })

      BddTest().then('the selected ids should be forwarded to the delete associations modal', () => {
        expect(wrapper.findComponent(DeleteAssociationsModalStub).props('selectedAssociationIds'))
          .toEqual([associations[0].associationId, associations[1].associationId])
      })
    })

    BddTest().and('the delete associations modal emits cancel', () => {
      beforeEach(() => {
        wrapper.findComponent(DeleteAssociationsModalStub).vm.$emit('cancel')
      })

      BddTest().then('the modal should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })

      BddTest().then('the selectedIds should be reset', () => {
        expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue')).toEqual([])
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete successfully', () => {
      beforeEach(async () => {
        await wrapper.findComponent(CompactCardSelectorStub)
          .vm
          .$emit('update:modelValue', [associations[0].associationId])
        wrapper.findComponent(DeleteAssociationsModalStub).vm.$emit('confirmDelete')
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
            description: 'L\'association sélectionnée a été supprimée avec succès',
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
          expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue')).toEqual([])
        })
      })
    })
  })

  BddTest().when('deleting associated traces fails', () => {
    beforeEach(() => {
      server.use(deleteDeclaredExperienceAssociationsErrorHandler)

      wrapper = mountComponent(DeleteDeclaredExperienceAssociatedTracesModal, { props, global: { stubs } })
    })

    BddTest().and('the delete associations modal emits confirmDelete', () => {
      beforeEach(() => {
        wrapper.findComponent(DeleteAssociationsModalStub).vm.$emit('confirmDelete')
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
