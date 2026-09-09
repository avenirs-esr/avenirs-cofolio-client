import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ConfirmDeleteSelfKnowledgeElementsModalStub } from '@/features/student/selfKnowledge/components/modals/ConfirmDeleteSelfKnowledgeElementsModal/ConfirmDeleteSelfKnowledgeElementsModal.stub'
import DeleteSelfKnowledgeElementsModal, { type DeleteSelfKnowledgeElementsModalProps } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeElementsModal/DeleteSelfKnowledgeElementsModal.vue'
import { SelfKnowledgeElementsSelectorStub } from '@/features/student/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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

BddTest().given('a delete self knowledge element modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeElementsModal>>

  const stubs = {
    AvModal: AvModalStub,
    SelfKnowledgeElementsSelector: SelfKnowledgeElementsSelectorStub,
    ConfirmDeleteSelfKnowledgeElementsModal: ConfirmDeleteSelfKnowledgeElementsModalStub,
  }

  BddTest().and('no elements to delete are provided', () => {
    const props: DeleteSelfKnowledgeElementsModalProps = {
      opened: true,
      categoryType: ESelfKnowledgeCategory.OBLIGATIONS,
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
    const strengthsCategoryType = mockedSelfKnowledgeCategories[0].type
    const props: DeleteSelfKnowledgeElementsModalProps = {
      opened: true,
      categoryType: strengthsCategoryType,
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

            await wrapper.setProps({ opened: true })
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

          BddTest().then('the confirm delete modal should be opened', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('opened')).toBe(true)
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

            BddTest().then('the confirm delete modal should be closed', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('opened')).toBe(false)
              })
            })
          })

          BddTest().and('the confirm delete modal emits cancel event', () => {
            beforeEach(() => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('cancel')
            })

            BddTest().then('the confirm delete modal should be closed', () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              expect(confirmModal.props('opened')).toBe(false)
            })
          })
        })
      })
    })
  })

  BddTest().and('many elements to delete are provided', () => {
    const strengthsCategoryType = mockedSelfKnowledgeCategories[0].type
    const props: DeleteSelfKnowledgeElementsModalProps = {
      opened: true,
      categoryType: strengthsCategoryType,
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

            await wrapper.setProps({ opened: true })
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

          BddTest().then('the confirm delete modal should be opened', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('opened')).toBe(true)
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

            BddTest().then('the confirm delete modal should be closed', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('opened')).toBe(false)
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

            await wrapper.setProps({ opened: true })
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

          BddTest().then('the confirm delete modal should be opened', () => {
            const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
            expect(confirmModal.props('opened')).toBe(true)
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

            BddTest().then('the confirm delete modal should not be closed', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
                expect(confirmModal.props('opened')).toBe(true)
              })
            })
          })
        })
      })
    })
  })
})
