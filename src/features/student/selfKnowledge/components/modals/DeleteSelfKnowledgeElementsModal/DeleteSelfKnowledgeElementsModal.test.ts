import type { VueWrapper } from '@vue/test-utils'
import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
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
  props: ['opened', 'id', 'closeButtonLabel', 'confirmButtonLabel'],
  emits: ['close', 'confirm']
})

const ConfirmDeleteSelfKnowledgeElementsModalStub = defineComponent({
  name: 'ConfirmDeleteSelfKnowledgeElementsModal',
  props: ['show', 'elements', 'categoryType'],
  emits: ['cancel', 'confirm'],
  template: `<div class="confirm-delete-self-knowledge-elements-modal-stub"></div>`
})

const SelfKnowledgeElementsSelectorStub = defineComponent({
  name: 'SelfKnowledgeElementSelector',
  props: ['elements', 'categoryType', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="self-knowledge-element-selector-stub"></div>`
})

BddTest().given('a delete self knowledge element modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeElementsModal>>

  const stubs = {
    AvModal: AvModalStub,
    SelfKnowledgeElementsSelector: SelfKnowledgeElementsSelectorStub,
    ConfirmDeleteSelfKnowledgeElementsModal: ConfirmDeleteSelfKnowledgeElementsModalStub
  }

  BddTest().and('no elements to delete are provided', () => {
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      elements: [],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with no elements', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title for zero elements', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Aucun élément à supprimer')
      })
    })
  })

  BddTest().and('a single element to delete is provided', () => {
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      elements: [
        { id: '1', title: 'Element 1', description: 'Description 1' }
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with the provided element', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Quel élément souhaitez-vous supprimer ?')
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
        beforeEach(() => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          selector.vm.$emit('update:modelValue', ['1'])
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['1'])
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
              await vi.waitFor(() => expect(mockAddSuccessMessage).toHaveBeenCalledWith('1 élément supprimé avec succès'))
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
    const props: DeleteSelfKnowledgeElementsModalProps = {
      show: true,
      elements: [
        { id: '1', title: 'Element 1', description: 'Description 1' },
        { id: '2', title: 'Element 2', description: 'Description 2' },
        { id: '3', title: 'Element 3', description: 'Description 3' },
        { id: 'INVALID_ELEMENT_ID', title: 'Element 4', description: 'Description 4' },
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with the provided elements', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title with element count', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Quels éléments souhaitez-vous supprimer ?')
      })

      BddTest().and('many elements are selected', () => {
        beforeEach(() => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          selector.vm.$emit('update:modelValue', ['1', '2', '3'])
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['1', '2', '3'])
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
              await vi.waitFor(() => expect(mockAddSuccessMessage).toHaveBeenCalledWith('3 éléments supprimés avec succès'))
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
        beforeEach(() => {
          vi.clearAllMocks()
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          selector.vm.$emit('update:modelValue', ['1', '3', 'INVALID_ELEMENT_ID'])
        })

        BddTest().then('the selectedElementIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(SelfKnowledgeElementsSelectorStub)
          expect(selector.props('modelValue')).toEqual(['1', '3', 'INVALID_ELEMENT_ID'])
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
