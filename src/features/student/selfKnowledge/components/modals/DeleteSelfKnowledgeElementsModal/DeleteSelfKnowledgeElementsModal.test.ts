import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import DeleteSelfKnowledgeElementsModal, { type DeleteSelfKnowledgeElementsModalProps } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeElementsModal/DeleteSelfKnowledgeElementsModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

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
        wrapper = mount(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title for zero elements', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Aucun point fort à supprimer')
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
        wrapper = mount(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Quel point fort souhaitez-vous supprimer ?')
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
            beforeEach(() => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              confirmModal.vm.$emit('confirm')
            })

            BddTest().then('the delete self knowledge elements modal should emit confirm event', () => {
              expect(wrapper.emitted()).toHaveProperty('confirm')
            })

            BddTest().then('the confirm delete modal should be hidden', () => {
              const confirmModal = wrapper.findComponent(ConfirmDeleteSelfKnowledgeElementsModalStub)
              expect(confirmModal.props('show')).toBe(false)
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
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with the provided elements', () => {
      beforeEach(() => {
        wrapper = mount(DeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title with element count', () => {
        const header = wrapper.find('.header')
        expect(header.text()).toBe('Quels points forts souhaitez-vous supprimer ?')
      })
    })
  })
})
