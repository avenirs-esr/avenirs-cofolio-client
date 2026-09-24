import type { VueWrapper } from '@vue/test-utils'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import DeleteSelfKnowledgeCategoriesConfirmModal, {
  type DeleteSelfKnowledgeCategoriesConfirmModalProps
} from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoriesConfirmModal/DeleteSelfKnowledgeCategoriesConfirmModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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

BddTest().given('the DeleteSelfKnowledgeCategoriesConfirmModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSelfKnowledgeCategoriesConfirmModal>>

  const stubs = { AvModal: AvModalStub }

  const mountWith = (props: DeleteSelfKnowledgeCategoriesConfirmModalProps) => {
    wrapper = mountComponent(DeleteSelfKnowledgeCategoriesConfirmModal, {
      props,
      global: { stubs }
    })
  }

  const getAvModal = () => wrapper.findComponent(AvModalStub)
  const getCategories = () => wrapper.findAll('[data-testid="delete-sf-categories-confirm-modal-category"]')
  const getTitle = () => wrapper.find('[data-testid="delete-sf-categories-confirm-modal-title"]')
  const getDescription = () => wrapper.find('[data-testid="delete-sf-categories-confirm-modal-description"]')

  BddTest().when('the component is mounted without categories', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountWith({ opened: true, categories: [] })
    })

    BddTest().then('it should render the AvModal', () => {
      expect(getAvModal().exists()).toBe(true)
    })

    BddTest().then('it should render the correct AvModal props', () => {
      expect(getAvModal().props('opened')).toBe(true)
      expect(getAvModal().props('closeButtonLabel')).toBe('Annuler')
      expect(getAvModal().props('confirmButtonLabel')).toBe('Confirmer')
    })

    BddTest().then('it should not render any categories', () => {
      expect(getCategories()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with multiple non mandatory categories', () => {
    const props: DeleteSelfKnowledgeCategoriesConfirmModalProps = {
      opened: true,
      categories: [
        {
          title: 'Mes témoignages',
          type: ESelfKnowledgeCategory.TESTIMONIALS
        },
        {
          title: 'Mes obligations',
          type: ESelfKnowledgeCategory.OBLIGATIONS
        },
        {
          title: 'Mes motivations',
          type: ESelfKnowledgeCategory.MOTIVATION
        }
      ]
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mountWith(props)
    })

    BddTest().then('it should render the AvModal with correct props', () => {
      expect(getAvModal().exists()).toBe(true)
      expect(getAvModal().props('opened')).toBe(true)
      expect(getAvModal().props('closeButtonLabel')).toBe('Annuler')
      expect(getAvModal().props('confirmButtonLabel')).toBe('Confirmer')
    })

    BddTest().then('it should render the correct title', () => {
      expect(getTitle().exists()).toBe(true)
      expect(getTitle().text()).toContain('Êtes-vous certain(e) de vouloir supprimer les catégories suivantes')
    })

    BddTest().then('it should render all category titles', () => {
      expect(getCategories()).toHaveLength(3)
      expect(getCategories().map(category => category.text())).toEqual([
        'Mes témoignages',
        'Mes obligations',
        'Mes motivations'
      ])
    })

    BddTest().then('it should render the description', () => {
      expect(getDescription().exists()).toBe(true)
    })

    BddTest().and('the user clicks on the cancel button', () => {
      beforeEach(() => {
        getAvModal().vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted()).toHaveProperty('cancel')
      })

      BddTest().then('it should not show any message', () => {
        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the user clicks on the confirm button', () => {
      beforeEach(() => {
        getAvModal().vm.$emit('confirm')
      })

      BddTest().then('it should call the mutation and show a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalled()
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with one non mandatory category', () => {
    const props: DeleteSelfKnowledgeCategoriesConfirmModalProps = {
      opened: true,
      categories: [
        {
          title: 'Mes témoignages',
          type: ESelfKnowledgeCategory.TESTIMONIALS
        }
      ]
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mountWith(props)
    })

    BddTest().then('it should render the category', () => {
      expect(getCategories()).toHaveLength(1)
      expect(getCategories()[0].text()).toBe('Mes témoignages')
    })

    BddTest().then('it should render the title with the singular count', () => {
      expect(getTitle().text()).toContain('Êtes-vous certain(e) de vouloir supprimer la catégorie suivante')
    })

    BddTest().and('the user clicks on the confirm button', () => {
      beforeEach(() => {
        getAvModal().vm.$emit('confirm')
      })

      BddTest().then('it should show a success message with the category title', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with a mandatory category', () => {
    const props: DeleteSelfKnowledgeCategoriesConfirmModalProps = {
      opened: true,
      categories: [
        {
          title: 'Mes points forts',
          type: ESelfKnowledgeCategory.STRENGTHS
        }
      ]
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mountWith(props)
    })

    BddTest().and('the user clicks on the confirm button', () => {
      beforeEach(() => {
        getAvModal().vm.$emit('confirm')
      })

      BddTest().then('it should show an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })
      })

      BddTest().then('it should not emit the deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })
})
