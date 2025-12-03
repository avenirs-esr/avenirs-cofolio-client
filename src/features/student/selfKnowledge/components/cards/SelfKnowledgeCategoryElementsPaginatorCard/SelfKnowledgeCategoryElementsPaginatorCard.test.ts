import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { selfKnowledgeCategoryElementsErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategoryType, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import SelfKnowledgeCategoryElementsPaginatorCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeCategoryElementsPaginatorCard/SelfKnowledgeCategoryElementsPaginatorCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper, } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockOpenAddElementDrawer = vi.fn()

vi.mock('@/features/student/selfKnowledge/stores/self-knowledge.store', () => ({
  useSelfKnowledgeStore: vi.fn(() => ({
    openAddElementDrawer: mockOpenAddElementDrawer
  }))
}))

const SelfKnowledgeElementCardStub = defineComponent({
  name: 'SelfKnowledgeElementCard',
  props: {
    element: {
      type: Object,
      required: true
    },
    categoryType: {
      type: String,
      required: true
    }
  },
  template: '<div data-testid="self-knowledge-element-card" />'
})

const SelfKnowledgeElementsDropdownStub = defineComponent({
  name: 'SelfKnowledgeElementsDropdown',
  props: {
    categoryType: {
      type: String,
      required: true
    }
  },
  template: '<div data-testid="self-knowledge-elements-dropdown" />'
})

const DeleteSelfKnowledgeCategoryModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeCategoryModal',
  props: {
    show: Boolean,
    categoryId: String,
    categoryTitle: String,
    elementsCount: Number
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-self-knowledge-category-modal" />'
})

const DeleteSelfKnowledgeElementModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeElementModal',
  props: {
    show: Boolean,
    categoryType: String,
    elements: Array,
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-self-knowledge-element-modal" />'
})

const AvCardStub = defineComponent({
  name: 'AvCard',
  props: {
    backgroundColor: String,
    titleBackground: String,
    borderColor: String,
    collapsible: Boolean
  },
  template: '<div data-testid="av-card"><slot name="title" /><slot /></div>'
})

const AvIconTextStub = defineComponent({
  name: 'AvIconText',
  props: {
    typographyClass: String,
    icon: String,
    iconColor: String,
    text: String,
    textColor: String,
    gap: String
  },
  template: '<div data-testid="av-icon-text">{{ text }}</div>'
})

const AvPaginationStub = defineComponent({
  name: 'AvPagination',
  props: {
    currentPage: Number,
    pages: Array,
    compact: Boolean,
    prevPageLabel: String,
    nextPageLabel: String,
    compactCurrentPageLabel: String
  },
  emits: ['update:currentPage'],
  template: '<div data-testid="av-pagination" />'
})

const stubs = {
  SelfKnowledgeElementCard: SelfKnowledgeElementCardStub,
  SelfKnowledgeElementsDropdown: SelfKnowledgeElementsDropdownStub,
  AvCard: AvCardStub,
  AvIconText: AvIconTextStub,
  AvPagination: AvPaginationStub,
  DeleteSelfKnowledgeCategoryModal: DeleteSelfKnowledgeCategoryModalStub,
  DeleteSelfKnowledgeElementModal: DeleteSelfKnowledgeElementModalStub
}

BddTest().given('a self knowledge category elements paginator card', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryElementsPaginatorCard>>

  function mountCard (category: SelfKnowledgeCategoryDTO): VueWrapper<InstanceType<typeof SelfKnowledgeCategoryElementsPaginatorCard>> {
    return mountComponent(SelfKnowledgeCategoryElementsPaginatorCard, {
      props: { category },
      global: { stubs }
    })
  }

  const categoryTestCases = [
    {
      name: 'strengths',
      category: mockedSelfKnowledgeCategories[0],
      expectedTitle: 'Mes points forts',
      expectedDescription: 'Identifier et valoriser mes qualités, talents et réussites marquantes.',
      expectedType: ESelfKnowledgeCategoryType.STRENGTHS
    },
    {
      name: 'values',
      category: mockedSelfKnowledgeCategories[1],
      expectedTitle: 'Mes valeurs',
      expectedDescription: 'Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.',
      expectedType: ESelfKnowledgeCategoryType.VALUES
    },
    {
      name: 'aspirations',
      category: mockedSelfKnowledgeCategories[2],
      expectedTitle: 'Mes envies',
      expectedDescription: 'Clarifier ce que j\'ai envie d\'explorer, d\'apprendre ou de vivre à court et moyen terme.',
      expectedType: ESelfKnowledgeCategoryType.ASPIRATIONS
    }
  ]

  categoryTestCases.forEach(({ name, category, expectedTitle, expectedDescription, expectedType }) => {
    BddTest().and(`the category is ${name}`, () => {
      BddTest().when('the component is mounted', () => {
        beforeEach(() => {
          wrapper = mountCard(category)
        })

        BddTest().then('it should render the card component', () => {
          expect(wrapper.exists()).toBe(true)
          expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
        })

        BddTest().then('it should display the category title with total elements count', async () => {
          await vi.waitFor(() => {
            const iconText = wrapper.findComponent(AvIconTextStub)
            expect(iconText.exists()).toBe(true)
            expect(iconText.props('text')).toContain(expectedTitle)
          })
        })

        BddTest().then('it should display the category description', () => {
          expect(wrapper.text()).toContain(expectedDescription)
        })

        BddTest().then('it should render the elements dropdown', () => {
          const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
          expect(dropdown.exists()).toBe(true)
          expect(dropdown.props('categoryType')).toBe(expectedType)
        })

        BddTest().then('it should display pagination', async () => {
          await vi.waitFor(() => {
            const pagination = wrapper.findComponent(AvPaginationStub)
            expect(pagination.exists()).toBe(true)
          })
        })

        BddTest().then('it should render element cards', async () => {
          await vi.waitFor(() => {
            const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
            expect(elementCards.length).toBeGreaterThan(0)
          })
        })

        BddTest().then('it should pass correct props to element cards', async () => {
          await vi.waitFor(() => {
            const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
            const firstCard = elementCards[0]
            expect(firstCard.props('element')).toBeDefined()
            expect(firstCard.props('element')).toHaveProperty('id')
            expect(firstCard.props('element')).toHaveProperty('title')
            expect(firstCard.props('element')).toHaveProperty('description')
            expect(firstCard.props('categoryType')).toBe(expectedType)
          })
        })

        BddTest().and('the delete option is selected from the dropdown', () => {
          beforeEach(async () => {
            await vi.waitFor(() => {
              const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
              expect(elementCards.length).toBeGreaterThan(0)
            })

            const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
            dropdown.vm.$emit('delete-selected')
          })

          BddTest().then('it should display the delete elements confirmation modal', async () => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeElementModalStub)
            expect(deleteModal.exists()).toBe(true)
            expect(deleteModal.props('show')).toBe(true)
            expect(deleteModal.props('categoryType')).toBe(expectedType)
            expect(deleteModal.props('elements')).toBeDefined()
            expect(Array.isArray(deleteModal.props('elements'))).toBe(true)
            expect(deleteModal.props('elements')!.length).toBeGreaterThan(0)
          })
        })
      })

      if (name === 'strengths') {
        BddTest().when('the pagination is changed', () => {
          beforeEach(async () => {
            wrapper = mountCard(category)
            await vi.waitFor(() => {
              expect(wrapper.findComponent(AvPaginationStub).exists()).toBe(true)
            })
          })

          BddTest().then('it should update the current page', async () => {
            const pagination = wrapper.findComponent(AvPaginationStub)
            await pagination.vm.$emit('update:currentPage', 1)

            await vi.waitFor(() => {
              expect(pagination.props('currentPage')).toBe(1)
            })
          })
        })
      }
    })
  })

  BddTest().and('the category has no elements', () => {
    const emptyCategoryId = 'non-existent-id'
    const emptyCategory: SelfKnowledgeCategoryDTO = {
      id: emptyCategoryId,
      title: 'Empty Category',
      description: 'A category with no elements',
      type: ESelfKnowledgeCategoryType.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(async () => {
        wrapper = mountCard(emptyCategory)
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the empty state message', async () => {
        await vi.waitFor(() => {
          expect(wrapper.text()).toContain('Aucun élément dans cette catégorie')
        })
      })

      BddTest().then('it should not display pagination', () => {
        const pagination = wrapper.findComponent(AvPaginationStub)
        expect(pagination.exists()).toBe(false)
      })

      BddTest().then('it should not display element cards', () => {
        const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
        expect(elementCards.length).toBe(0)
      })
    })
  })

  BddTest().and('the query fails with server error', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    BddTest().when('the component is mounted', () => {
      beforeEach(async () => {
        server.use(selfKnowledgeCategoryElementsErrorHandler)
        wrapper = mountCard(strengthsCategory)
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the empty state message', async () => {
        await vi.waitFor(() => {
          expect(wrapper.text()).toContain('Aucun élément dans cette catégorie')
        })
      })

      BddTest().then('it should not display element cards', () => {
        const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
        expect(elementCards.length).toBe(0)
      })
    })
  })

  BddTest().and('the component displays loading state', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountCard(strengthsCategory)
      })

      BddTest().then('it should not display element cards during loading', () => {
        const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
        expect(elementCards.length).toBe(0)
      })

      BddTest().then('it should not display pagination during loading', () => {
        const pagination = wrapper.findComponent(AvPaginationStub)
        expect(pagination.exists()).toBe(false)
      })

      BddTest().then('it should display element cards after loading completes', async () => {
        await vi.waitFor(() => {
          const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
          expect(elementCards.length).toBeGreaterThan(0)
        })
      })
    })
  })

  BddTest().and('pagination configuration', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    BddTest().when('the component is mounted and data is loaded', () => {
      beforeEach(async () => {
        wrapper = mountCard(strengthsCategory)
        await vi.waitFor(() => {
          expect(wrapper.findComponent(AvPaginationStub).exists()).toBe(true)
        })
      })

      BddTest().then('it should configure pagination with correct props', () => {
        const pagination = wrapper.findComponent(AvPaginationStub)
        expect(pagination.props('compact')).toBe(true)
        expect(pagination.props('prevPageLabel')).toBe('Page précédente')
        expect(pagination.props('nextPageLabel')).toBe('Page suivante')
        expect(pagination.props('compactCurrentPageLabel')).toBeDefined()
      })

      BddTest().then('it should have pages array', () => {
        const pagination = wrapper.findComponent(AvPaginationStub)
        expect(pagination.props('pages')).toBeDefined()
        expect(Array.isArray(pagination.props('pages'))).toBe(true)
      })

      BddTest().then('it should start at page 0', () => {
        const pagination = wrapper.findComponent(AvPaginationStub)
        expect(pagination.props('currentPage')).toBe(0)
      })
    })
  })

  BddTest().and('a deletable category', () => {
    const obligationsCategory = {
      id: 'deletable-category-id',
      title: 'My obligations',
      description: 'Some description.',
      type: ESelfKnowledgeCategoryType.OBLIGATIONS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(async () => {
        wrapper = mountCard(obligationsCategory)
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })
      })

      BddTest().then('it should not display the delete confirmation modal initially', () => {
        const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
        expect(deleteModal.exists()).toBe(true)
        expect(deleteModal.props('show')).toBe(false)
      })

      BddTest().and('the delete option is selected from the dropdown', () => {
        beforeEach(async () => {
          const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
          dropdown.vm.$emit('delete-category-selected')
        })

        BddTest().then('it should display the delete confirmation modal', async () => {
          await vi.waitFor(() => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
            expect(deleteModal.exists()).toBe(true)
            expect(deleteModal.props('show')).toBe(true)
            expect(deleteModal.props('categoryId')).toBe(obligationsCategory.id)
            expect(deleteModal.props('categoryTitle')).toBe(obligationsCategory.title)
            expect(deleteModal.props('elementsCount')).toBe(0)
          })
        })

        BddTest().and('the cancel event is emitted from the modal', () => {
          beforeEach(async () => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
            deleteModal.vm.$emit('cancel')
          })

          BddTest().then('it should hide the delete confirmation modal', async () => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
            await vi.waitFor(() => {
              expect(deleteModal.props('show')).toBe(false)
            })
          })
        })

        BddTest().and('the confirm event is emitted from the modal', () => {
          beforeEach(async () => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
            deleteModal.vm.$emit('confirm')
          })

          BddTest().then('it should hide the delete confirmation modal', async () => {
            const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeCategoryModalStub)
            await vi.waitFor(() => {
              expect(deleteModal.props('show')).toBe(false)
            })
          })
        })
      })
    })
  })

  BddTest().and('the add elements option is selected from dropdown', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    beforeEach(async () => {
      vi.clearAllMocks()
    })

    BddTest().when('the add option is clicked', () => {
      beforeEach(async () => {
        wrapper = mountCard(strengthsCategory)
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })

        const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
        dropdown.vm.$emit('add-selected')
        await flushPromises()
      })

      BddTest().then('it should call openAddElementDrawer from store', () => {
        expect(mockOpenAddElementDrawer).toHaveBeenCalledWith(strengthsCategory)
        expect(mockOpenAddElementDrawer).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('the delete element modal is confirmed', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    BddTest().when('the confirm event is emitted from delete element modal', () => {
      beforeEach(async () => {
        wrapper = mountCard(strengthsCategory)

        await vi.waitFor(() => {
          const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
          expect(elementCards.length).toBeGreaterThan(0)
        })

        const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
        dropdown.vm.$emit('delete-selected')
        await wrapper.vm.$nextTick()

        const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeElementModalStub)
        deleteModal.vm.$emit('confirm')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the delete elements modal', () => {
        const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeElementModalStub)
        expect(deleteModal.props('show')).toBe(false)
      })
    })
  })

  BddTest().and('confirming element deletion from cancel modal', () => {
    const strengthsCategory = mockedSelfKnowledgeCategories[0]

    BddTest().when('delete elements modal is cancelled', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = mountCard(strengthsCategory)

        await vi.waitFor(() => {
          const elementCards = wrapper.findAllComponents(SelfKnowledgeElementCardStub)
          expect(elementCards.length).toBeGreaterThan(0)
        })

        const dropdown = wrapper.findComponent(SelfKnowledgeElementsDropdownStub)
        dropdown.vm.$emit('delete-selected')
        await wrapper.vm.$nextTick()

        const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeElementModalStub)
        deleteModal.vm.$emit('cancel')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the delete elements modal', () => {
        const deleteModal = wrapper.findComponent(DeleteSelfKnowledgeElementModalStub)
        expect(deleteModal.props('show')).toBe(false)
      })
    })
  })
})
