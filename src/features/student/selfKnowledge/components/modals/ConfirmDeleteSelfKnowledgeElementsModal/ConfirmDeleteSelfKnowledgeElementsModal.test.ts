import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import ConfirmDeleteSelfKnowledgeElementsModal, { type ConfirmDeleteSelfKnowledgeElementsModalProps } from '@/features/student/selfKnowledge/components/modals/ConfirmDeleteSelfKnowledgeElementsModal/ConfirmDeleteSelfKnowledgeElementsModal.vue'
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

BddTest().given('a confirm delete self knowledge element modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmDeleteSelfKnowledgeElementsModal>>

  const stubs = { AvModal: AvModalStub }

  BddTest().and('a single element to delete is provided', () => {
    const props: ConfirmDeleteSelfKnowledgeElementsModalProps = {
      show: true,
      elements: [
        { id: '1', title: 'Element 1', description: 'Description 1' }
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with the provided element', () => {
      beforeEach(() => {
        wrapper = mount(ConfirmDeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title', () => {
        const header = wrapper.find('.b2-bold')
        expect(header.text()).toBe('Êtes-vous certain(e) de vouloir supprimer ce point fort ?')
      })

      BddTest().then('it should list the element to delete', () => {
        const listItems = wrapper.findAll('li')
        expect(listItems).toHaveLength(1)
        expect(listItems[0].text()).toBe('Element 1')
      })

      BddTest().and('the modal emits close event', () => {
        beforeEach(() => {
          wrapper.findComponent(AvModalStub).vm.$emit('close')
        })

        BddTest().then('the cancel event should be emitted', () => {
          expect(wrapper.emitted()).toHaveProperty('cancel')
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(() => {
          wrapper.findComponent(AvModalStub).vm.$emit('confirm')
        })

        BddTest().then('the confirm event should be emitted', () => {
          expect(wrapper.emitted()).toHaveProperty('confirm')
        })
      })
    })
  })

  BddTest().and('many elements to delete are provided', () => {
    const props: ConfirmDeleteSelfKnowledgeElementsModalProps = {
      show: true,
      elements: [
        { id: '1', title: 'Element 1', description: 'Description 1' },
        { id: '2', title: 'Element 2', description: 'Description 2' },
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
    }

    BddTest().when('the modal is rendered with the provided elements', () => {
      beforeEach(() => {
        wrapper = mount(ConfirmDeleteSelfKnowledgeElementsModal, { props, global: { stubs } })
      })

      BddTest().then('it should display the correct title with element count', () => {
        const header = wrapper.find('.b2-bold')
        expect(header.text()).toBe('Êtes-vous certain(e) de vouloir supprimer ces points forts ?')
      })

      BddTest().then('it should list the element to delete', () => {
        const listItems = wrapper.findAll('li')
        expect(listItems).toHaveLength(2)
        expect(listItems[0].text()).toBe('Element 1')
        expect(listItems[1].text()).toBe('Element 2')
      })

      BddTest().and('the modal emits close event', () => {
        beforeEach(() => {
          wrapper.findComponent(AvModalStub).vm.$emit('close')
        })

        BddTest().then('the cancel event should be emitted', () => {
          expect(wrapper.emitted()).toHaveProperty('cancel')
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(() => {
          wrapper.findComponent(AvModalStub).vm.$emit('confirm')
        })

        BddTest().then('the confirm event should be emitted', () => {
          expect(wrapper.emitted()).toHaveProperty('confirm')
        })
      })
    })
  })
})
