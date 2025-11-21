import DeleteSelfKnowledgeCategoryModal, { type DeleteSelfKnowledgeCategoryModalProps } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoryModal/DeleteSelfKnowledgeCategoryModal.vue'
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

BddTest().given('the DeleteSelfKnowledgeCategoryModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeCategoryModal>>

  const stubs = { AvModal: AvModalStub }

  BddTest().when('the component is mounted with many elements', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Category with 3 elements',
      elementsCount: 3,
    }

    beforeEach(() => {
      wrapper = mount(DeleteSelfKnowledgeCategoryModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the AvModal with correct props', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
      expect(modal.props('closeButtonLabel')).toBe('Annuler')
      expect(modal.props('confirmButtonLabel')).toBe('Confirmer')
    })

    BddTest().then('it should render the correct title', () => {
      const title = wrapper.find('.delete-self-knowledge-category-modal__header')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Êtes-vous certain(e) de vouloir supprimer la catégorie Category with 3 elements ?')
    })

    BddTest().then('it should render the description with elements count in plural', () => {
      const description = wrapper.find('.delete-self-knowledge-category-modal__body')
      expect(description.exists()).toBe(true)
      expect(description.text()).toBe(`${props.elementsCount} éléments renseignés dans cette catégorie seront définitivement supprimés.`)
    })

    BddTest().and('the user clicks on the cancel button', () => {
      BddTest().then('it should emit the cancel event', () => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
        expect(wrapper.emitted()).toHaveProperty('cancel')
      })
    })

    BddTest().and('the user clicks on the confirm button', () => {
      BddTest().then('it should emit the confirm event', () => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
        expect(wrapper.emitted()).toHaveProperty('confirm')
      })
    })
  })

  BddTest().when('the component is mounted with one element', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Category with 1 element',
      elementsCount: 1,
    }

    beforeEach(() => {
      wrapper = mount(DeleteSelfKnowledgeCategoryModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the correct title', () => {
      const title = wrapper.find('.delete-self-knowledge-category-modal__header')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Êtes-vous certain(e) de vouloir supprimer la catégorie Category with 1 element ?')
    })

    BddTest().then('it should render the description with element count in singular', () => {
      const description = wrapper.find('.delete-self-knowledge-category-modal__body')
      expect(description.exists()).toBe(true)
      expect(description.text()).toBe(`L'élément renseigné dans cette catégorie sera définitivement supprimé.`)
    })
  })

  BddTest().when('the component is mounted without elements', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Empty Category',
      elementsCount: 0,
    }

    beforeEach(() => {
      wrapper = mount(DeleteSelfKnowledgeCategoryModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the correct title', () => {
      const title = wrapper.find('.delete-self-knowledge-category-modal__header')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Êtes-vous certain(e) de vouloir supprimer la catégorie Empty Category ?')
    })

    BddTest().then('it should not render a description', () => {
      const description = wrapper.find('.delete-self-knowledge-category-modal__body')
      expect(description.exists()).toBe(false)
    })
  })
})
