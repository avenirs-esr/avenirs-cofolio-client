import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import DeleteSelfKnowledgeElementsModal, { type DeleteSelfKnowledgeElementsModalProps } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeElementsModal/DeleteSelfKnowledgeElementsModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const AvModalStub = defineComponent({
  name: 'AvModal',
  template: `
      <div class="av-modal-stub">
        <slot name="header" />
        <slot />
      </div>
    `,
  props: ['opened', 'id', 'closeButtonLabel', 'confirmButtonLabel', 'confirmButtonIcon', 'confirmButtonDisabled'],
  emits: ['close', 'confirm']
})

const ConfirmDeleteSelfKnowledgeElementsModalStub = defineComponent({
  name: 'ConfirmDeleteSelfKnowledgeElementsModal',
  props: ['show', 'elements'],
  emits: ['cancel', 'confirm'],
  template: `<div class="confirm-delete-self-knowledge-elements-modal-stub"></div>`
})

const SelfKnowledgeElementsSelectorStub = defineComponent({
  name: 'SelfKnowledgeElementsSelector',
  props: ['elements', 'categoryType', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="self-knowledge-element-selector-stub"></div>`
})

BddTest().given('a delete self knowledge element modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeElementsModal>>

  const stubs = {
    AvModal: AvModalStub,
    SelfKnowledgeElementsSelector: SelfKnowledgeElementsSelectorStub,
    ConfirmDeleteSelfKnowledgeElementsModal: ConfirmDeleteSelfKnowledgeElementsModalStub,
  }

  BddTest().and('no elements to delete are provided', () => {
    const nonExistentCategoryId = 'non-existent-category-id'
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      categoryId: nonExistentCategoryId,
      totalCount: 0
    }

    BddTest().when('the modal is rendered with no elements', () => {
      beforeEach(async () => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the correct title for zero elements', async () => {
        await vi.waitFor(() => {
          const header = wrapper.find('[data-testid="header"]')
          expect(header.text()).toBe('Aucun élément à supprimer')
        })
      })
    })
  })

  BddTest().and('a single element to delete is provided', () => {
    const strengthsCategoryId = mockedSelfKnowledgeCategories[0].id
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      categoryId: strengthsCategoryId,
      totalCount: 1
    }

    BddTest().when('the modal is rendered with the provided element', () => {
      beforeEach(async () => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
        await vi.waitFor(() => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the correct title', async () => {
        await vi.waitFor(() => {
          const header = wrapper.find('[data-testid="header"]')
          expect(header.text()).toContain('souhaitez-vous supprimer')
        })
      })

      BddTest().then('it should render the SelfKnowledgeElementSelector component', () => {
        const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
        expect(selector.exists()).toBe(true)
      })

      BddTest().then('no element should be selected initially', () => {
        const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
        expect(selector.props('modelValue')).toEqual([])
      })

      BddTest().and('the element is selected', () => {
        beforeEach(async () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          await selector.vm.$emit('update:modelValue', ['element-1'])
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['element-1'])
        })

        BddTest().and('the modal is closed by close event and reopened', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            await modal.vm.$emit('close')

            await wrapper.setProps({ show: true })
          })

          BddTest().then('the selectedElementIds should be reset', () => {
            const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
            expect(selector.props('modelValue')).toEqual([])
          })
        })

        BddTest().and('the modal emits confirm event', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            modal.vm.$emit('confirm')
          })

          BddTest().then('the confirm delete modal should be shown', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('show')).toBe(true)
          })

          BddTest().and('the confirm delete modal emits confirm event', () => {
            beforeEach(async () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('confirm')
            })

            BddTest().then('a success message should be added', async () => {
              await vi.waitFor(() => expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.stringContaining('élément supprimé avec succès')))
            })

            BddTest().then('no error message should be added', () => {
              expect(mockAddErrorMessage).not.toHaveBeenCalled()
            })

            BddTest().then('the delete self knowledge elements modal should emit confirm event', async () => {
              await vi.waitFor(() => expect(wrapper.emitted()).toHaveProperty('confirm'))
            })

            BddTest().then('the confirm delete modal should be hidden', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('show')).toBe(false)
              })
            })
          })

          BddTest().and('the confirm delete modal emits cancel event', () => {
            beforeEach(() => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('cancel')
            })

            BddTest().then('the confirm delete modal should be hidden', () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              expect(confirmModal.props('show')).toBe(false)
            })
          })
        })
      })
    })
  })

  BddTest().and('many elements to delete are provided', () => {
    const strengthsCategoryId = mockedSelfKnowledgeCategories[0].id
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      categoryId: strengthsCategoryId,
      totalCount: 10
    }

    BddTest().when('the modal is rendered with the provided elements', () => {
      beforeEach(async () => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
        await vi.waitFor(() => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the correct title with element count', () => {
        const header = wrapper.find('[data-testid="header"]')
        expect(header.text()).toContain('Quels éléments souhaitez-vous supprimer')
      })

      BddTest().and('many elements are selected', () => {
        beforeEach(async () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          await selector.vm.$emit('update:modelValue', ['element-1', 'element-2', 'element-3'])
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['element-1', 'element-2', 'element-3'])
        })

        BddTest().and('the modal is closed by close event and reopened', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            await modal.vm.$emit('close')

            await wrapper.setProps({ show: true })
          })

          BddTest().then('the selectedElementIds should be reset', () => {
            const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
            expect(selector.props('modelValue')).toEqual([])
          })
        })

        BddTest().and('the modal emits confirm event', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            modal.vm.$emit('confirm')
          })

          BddTest().then('the confirm delete modal should be shown', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('show')).toBe(true)
          })

          BddTest().and('the confirm delete modal emits confirm event', () => {
            beforeEach(async () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('confirm')
            })

            BddTest().then('a success message should be added', async () => {
              await vi.waitFor(() => expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.stringContaining('éléments supprimés avec succès')))
            })

            BddTest().then('no error message should be added', () => {
              expect(mockAddErrorMessage).not.toHaveBeenCalled()
            })

            BddTest().then('the delete self knowledge elements modal should emit confirm event', async () => {
              await vi.waitFor(() => expect(wrapper.emitted()).toHaveProperty('confirm'))
            })

            BddTest().then('the confirm delete modal should be hidden', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('show')).toBe(false)
              })
            })
          })
        })
      })

      BddTest().and('many elements including the invalid one are selected', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          await selector.vm.$emit('update:modelValue', ['element-1', 'element-3', 'INVALID_ELEMENT_ID'])
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['element-1', 'element-3', 'INVALID_ELEMENT_ID'])
        })

        BddTest().and('the modal is closed by close event and reopened', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            await modal.vm.$emit('close')

            await wrapper.setProps({ show: true })
          })

          BddTest().then('the selectedElementIds should be reset', () => {
            const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
            expect(selector.props('modelValue')).toEqual([])
          })
        })

        BddTest().and('the modal emits confirm event', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            modal.vm.$emit('confirm')
          })

          BddTest().then('the confirm delete modal should be shown', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('show')).toBe(true)
          })

          BddTest().and('the confirm delete modal emits confirm event', () => {
            beforeEach(async () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('confirm')
            })

            BddTest().then('no success message should be added', () => {
              expect(mockAddSuccessMessage).not.toHaveBeenCalled()
            })

            BddTest().then('an error message should be added', async () => {
              await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
            })

            BddTest().then('the delete self knowledge elements modal should not emit confirm event', async () => {
              await vi.waitFor(() => expect(wrapper.emitted()).not.toHaveProperty('confirm'))
            })

            BddTest().then('the confirm delete modal should not be hidden', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('show')).toBe(true)
              })
            })
          })
        })
      })
    })
  })
})
