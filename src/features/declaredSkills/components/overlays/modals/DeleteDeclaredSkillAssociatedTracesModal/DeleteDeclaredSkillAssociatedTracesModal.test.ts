import type { VueWrapper } from '@vue/test-utils'
import { createMockedTraceAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import { deleteDeclaredSkillAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import DeleteDeclaredSkillAssociatedTracesModal, {
  type DeleteDeclaredSkillAssociatedTracesModalProps
} from '@/features/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedTracesModal/DeleteDeclaredSkillAssociatedTracesModal.vue'
import { CompactCardSelectorStub } from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeleteAssociationsModalStub } from '@/features/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
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

BddTest().given('a delete declared skill associated traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredSkillAssociatedTracesModal>>

  const stubs = {
    DeleteAssociationsModal: DeleteAssociationsModalStub,
    CompactCardSelector: CompactCardSelectorStub,
  }

  const associations = createMockedTraceAssociations(3)

  const props: DeleteDeclaredSkillAssociatedTracesModalProps = {
    show: true,
    declaredSkillProgressId: 'skill-1',
    associations,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredSkillAssociatedTracesModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the delete associations modal', () => {
      expect(wrapper.findComponent(DeleteAssociationsModalStub).exists()).toBe(true)
    })

    BddTest().then('it should render the compact card selector', () => {
      expect(wrapper.findComponent(CompactCardSelectorStub).exists()).toBe(true)
    })

    BddTest().then('it should map associations to id and title', () => {
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

    BddTest().and('deleting associated traces fails', () => {
      beforeEach(() => {
        server.use(deleteDeclaredSkillAssociationsErrorHandler)

        wrapper = mountComponent(DeleteDeclaredSkillAssociatedTracesModal, { props, global: { stubs } })
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
})
