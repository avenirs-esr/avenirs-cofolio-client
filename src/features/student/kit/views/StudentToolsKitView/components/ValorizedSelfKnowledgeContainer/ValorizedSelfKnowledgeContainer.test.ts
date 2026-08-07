import type { GetSelfKnowledgeElementsParams, PagedResponseSelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { createMockedPagedResponseSelfKnowledgeElementViewDTO } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementsHandler, selfKnowledgeCategoryElementsErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ProjectTrajectoryItems } from '@/features/student/global/views/StudentProjectTrajectoriesView/types'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import ValorizedSelfKnowledgeContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeContainer/ValorizedSelfKnowledgeContainer.vue'
import { ValorizedSelfKnowledgeItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeItem/ValorizedSelfKnowledgeItem.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const otherCategories = [
  ESelfKnowledgeCategory.STRENGTHS,
  ESelfKnowledgeCategory.VALUES,
  ESelfKnowledgeCategory.ASPIRATIONS,
  ESelfKnowledgeCategory.MOTIVATION,
  ESelfKnowledgeCategory.IMPROVEMENT,
  ESelfKnowledgeCategory.INSPIRATIONS,
  ESelfKnowledgeCategory.OBLIGATIONS,
  ESelfKnowledgeCategory.TESTIMONIALS
]

function createMixedCategoriesResponse (categories: ESelfKnowledgeCategory[]): PagedResponseSelfKnowledgeElementViewDTO {
  return {
    data: categories.map((type, index) => ({
      id: `element-${index}`,
      title: `Élément ${index}`,
      description: `Description ${index}`,
      category: { type, mandatory: true }
    })),
    page: { page: 0, pageSize: 100, totalElements: categories.length, totalPages: 1 }
  }
}

BddTest().given('a valorized self knowledge container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedSelfKnowledgeContainer>>
  let requestedParams: GetSelfKnowledgeElementsParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedSelfKnowledgeItem: ValorizedSelfKnowledgeItemStub
  }

  const mountContainer = async (interestsOnly: boolean) => {
    wrapper = mountComponent(ValorizedSelfKnowledgeContainer, { props: { interestsOnly }, global: { stubs } })
    await flushPromises()
  }

  BddTest().given('the interests only variant', () => {
    BddTest().when('the self knowledge elements request succeeds with 3 interests', () => {
      const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 3, 0)

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse, (params) => {
          requestedParams = params
        }))

        await mountContainer(true)
      })

      BddTest().then('it should fetch self knowledge elements with the interests category only, isValorized true and pageSize 100', () => {
        expect(requestedParams.selfKnowledgeCategories).toEqual([ESelfKnowledgeCategory.INTERESTS])
        expect(requestedParams.isValorized).toBe(true)
        expect(requestedParams.pageSize).toBe(100)
      })

      BddTest().then('it should render the title with the total elements count', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.exists()).toBe(true)
        expect(container.props('title')).toBe('Centres d\'intérêt (3)')
      })

      BddTest().then('it should not be loading and have no error once fetched', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.props('isLoading')).toBe(false)
        expect(container.props('error')).toBe(null)
      })

      BddTest().then('it should render one item per interest without the category badge', () => {
        const items = wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)
        expect(items).toHaveLength(3)
        expect(items.every(item => item.props('showCategoryBadge') === false)).toBe(true)
      })

      BddTest().then('it should not be empty and pass the empty state message and see all link to the interests category', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.props('isEmpty')).toBe(false)
        expect(container.props('emptyStateMessage')).toBe('Vous n\'avez pas encore valorisé ce type de contenu, ajoutez et valorisez un centre d\'intérêt afin de constituer votre kit')
        expect(container.props('seeAllLabel')).toBe('Voir tous mes centres d\'intérêt')
        expect(container.props('seeAllTo')).toEqual({
          name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
          params: { id: ESelfKnowledgeCategory.INTERESTS }
        })
      })

      BddTest().then('it should expose the interests container test id', () => {
        expect(wrapper.find('[data-testid="valorized-self-knowledge-interests-container"]').exists()).toBe(true)
      })
    })

    BddTest().when('the self knowledge elements request succeeds with a single interest', () => {
      const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 1, 0)

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse))

        await mountContainer(true)
      })

      BddTest().then('it should render the title in the singular form', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Centre d\'intérêt (1)')
      })

      BddTest().then('it should render a single item', () => {
        expect(wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)).toHaveLength(1)
      })
    })

    BddTest().when('the self knowledge elements request succeeds with 0 interests', () => {
      const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 0, 0)

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse))

        await mountContainer(true)
      })

      BddTest().then('it should render no item', () => {
        expect(wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)).toHaveLength(0)
      })

      BddTest().then('it should mark the container as empty', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
      })

      BddTest().then('it should fall back to the self knowledge section link', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('seeAllTo')).toEqual({
          name: ROUTES.STUDENT.PROJECT_TRAJECTORIES.name,
          query: { section: ProjectTrajectoryItems.SELF_KNOWLEDGE }
        })
      })
    })

    BddTest().when('the self knowledge elements request fails', () => {
      beforeEach(async () => {
        server.use(selfKnowledgeCategoryElementsErrorHandler)

        await mountContainer(true)
      })

      BddTest().then('it should forward the error to the card container', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
      })
    })
  })

  BddTest().given('the other information variant', () => {
    BddTest().when('the self knowledge elements request succeeds with 3 elements of mixed categories', () => {
      const mockedResponse = createMixedCategoriesResponse([
        ESelfKnowledgeCategory.VALUES,
        ESelfKnowledgeCategory.STRENGTHS,
        ESelfKnowledgeCategory.MOTIVATION
      ])

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse, (params) => {
          requestedParams = params
        }))

        await mountContainer(false)
      })

      BddTest().then('it should fetch every category but interests, with isValorized true and pageSize 100', () => {
        expect(requestedParams.selfKnowledgeCategories).toEqual(otherCategories)
        expect(requestedParams.selfKnowledgeCategories).not.toContain(ESelfKnowledgeCategory.INTERESTS)
        expect(requestedParams.isValorized).toBe(true)
        expect(requestedParams.pageSize).toBe(100)
      })

      BddTest().then('it should render the title with the total elements count', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Autres informations (3)')
      })

      BddTest().then('it should render one item per element with the category badge, in the api order', () => {
        const items = wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)
        expect(items).toHaveLength(3)
        expect(items.every(item => item.props('showCategoryBadge') === true)).toBe(true)
        expect(items.map(item => item.props('element').category.type)).toEqual([
          ESelfKnowledgeCategory.VALUES,
          ESelfKnowledgeCategory.STRENGTHS,
          ESelfKnowledgeCategory.MOTIVATION
        ])
      })

      BddTest().then('it should pass the empty state message and see all link to the self knowledge section', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.props('isEmpty')).toBe(false)
        expect(container.props('emptyStateMessage')).toBe('Vous n\'avez pas encore valorisé ce type de contenu, ajoutez et valorisez une information afin de constituer votre kit')
        expect(container.props('seeAllLabel')).toBe('Voir toutes mes autres informations')
        expect(container.props('seeAllTo')).toEqual({
          name: ROUTES.STUDENT.PROJECT_TRAJECTORIES.name,
          query: { section: ProjectTrajectoryItems.SELF_KNOWLEDGE }
        })
      })

      BddTest().then('it should expose the other information container test id', () => {
        expect(wrapper.find('[data-testid="valorized-self-knowledge-others-container"]').exists()).toBe(true)
      })
    })

    BddTest().when('the self knowledge elements request succeeds with a single element', () => {
      const mockedResponse = createMixedCategoriesResponse([ESelfKnowledgeCategory.TESTIMONIALS])

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse))

        await mountContainer(false)
      })

      BddTest().then('it should render the title in the singular form', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Autre information (1)')
      })

      BddTest().then('it should render a single item', () => {
        expect(wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)).toHaveLength(1)
      })
    })

    BddTest().when('the self knowledge elements request succeeds with 0 element', () => {
      const mockedResponse = createMixedCategoriesResponse([])

      beforeEach(async () => {
        server.use(createSelfKnowledgeElementsHandler(mockedResponse))

        await mountContainer(false)
      })

      BddTest().then('it should render no item', () => {
        expect(wrapper.findAllComponents(ValorizedSelfKnowledgeItemStub)).toHaveLength(0)
      })

      BddTest().then('it should mark the container as empty', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
      })
    })

    BddTest().when('the self knowledge elements request fails', () => {
      beforeEach(async () => {
        server.use(selfKnowledgeCategoryElementsErrorHandler)

        await mountContainer(false)
      })

      BddTest().then('it should forward the error to the card container', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
      })
    })
  })
})
