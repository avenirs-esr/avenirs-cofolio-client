import type { VueWrapper } from '@vue/test-utils'
import DeleteSelfKnowledgeCategoryModal, { type DeleteSelfKnowledgeCategoryModalProps } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoryModal/DeleteSelfKnowledgeCategoryModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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

BddTest().given('the DeleteSelfKnowledgeCategoryModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeCategoryModal>>

  const stubs = { AvModal: AvModalStub }

  BddTest().when('the component is mounted with many elements', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Category with 3 elements',
      categoryId: 'category-1',
      elementsCount: 3,
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(DeleteSelfKnowledgeCategoryModal, {
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
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted()).toHaveProperty('cancel')
      })

      BddTest().then('it should not call the mutation and not show any message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().and('the user clicks on the confirm button', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should call the mutation and show a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith(`La catégorie ${props.categoryTitle} a été supprimée avec succès`)
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the confirm event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted()).toHaveProperty('confirm')
        })
      })
    })
  })

  BddTest().when('the component is mounted with one element', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Category with 1 element',
      categoryId: 'category-2',
      elementsCount: 1,
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(DeleteSelfKnowledgeCategoryModal, {
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

  BddTest().when('the component is mounted with one invalid element', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Category with 1 invalid element',
      categoryId: 'INVALID_CATEGORY_ID',
      elementsCount: 1,
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(DeleteSelfKnowledgeCategoryModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().and('the user clicks on the confirm button', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should call the mutation and show an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })
      })

      BddTest().then('it should not emit the confirm event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted()).not.toHaveProperty('confirm')
        })
      })
    })
  })

  BddTest().when('the component is mounted without elements', () => {
    const props: DeleteSelfKnowledgeCategoryModalProps = {
      show: true,
      categoryTitle: 'Empty Category',
      categoryId: 'category-3',
      elementsCount: 0,
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(DeleteSelfKnowledgeCategoryModal, {
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
