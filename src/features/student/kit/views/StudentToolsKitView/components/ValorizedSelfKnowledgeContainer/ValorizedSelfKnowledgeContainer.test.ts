import type { GetSelfKnowledgeElementsParams } from '@/api/avenir-esr'
import { createMockedPagedResponseSelfKnowledgeElementViewDTO } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementsHandler, selfKnowledgeCategoryElementsErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import ValorizedSelfKnowledgeContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeContainer/ValorizedSelfKnowledgeContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized self knowledge interests container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedSelfKnowledgeContainer>>
  let requestedParams: GetSelfKnowledgeElementsParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedItem: { template: '<div data-testid="valorized-item-stub" />' }
  }

  const mountInterestsContainer = async () => {
    wrapper = mountComponent(ValorizedSelfKnowledgeContainer, { props: { category: ESelfKnowledgeCategory.INTERESTS }, global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the self knowledge elements request succeeds with 3 interests', () => {
    const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 3, 0)

    beforeEach(async () => {
      server.use(createSelfKnowledgeElementsHandler(mockedResponse, (params) => {
        requestedParams = params
      }))

      await mountInterestsContainer()
    })

    BddTest().then('it should fetch self knowledge elements with INTERESTS category, isValorized true and pageSize 100', () => {
      expect(requestedParams.selfKnowledgeCategories).toContain(ESelfKnowledgeCategory.INTERESTS)
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

    BddTest().then('it should render one ValorizedItem per interest', () => {
      const items = wrapper.findAll('[data-testid="valorized-item-stub"]')
      expect(items).toHaveLength(3)
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
  })

  BddTest().when('the self knowledge elements request succeeds with a single interest', () => {
    const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 1, 0)

    beforeEach(async () => {
      server.use(createSelfKnowledgeElementsHandler(mockedResponse))

      await mountInterestsContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Centre d\'intérêt (1)')
    })

    BddTest().then('it should render a single ValorizedItem', () => {
      expect(wrapper.findAll('[data-testid="valorized-item-stub"]')).toHaveLength(1)
    })
  })

  BddTest().when('the self knowledge elements request succeeds with 0 interests', () => {
    const mockedResponse = createMockedPagedResponseSelfKnowledgeElementViewDTO(ESelfKnowledgeCategory.INTERESTS, 100, 0, 0)

    beforeEach(async () => {
      server.use(createSelfKnowledgeElementsHandler(mockedResponse))

      await mountInterestsContainer()
    })

    BddTest().then('it should render no ValorizedItem', () => {
      expect(wrapper.findAll('[data-testid="valorized-item-stub"]')).toHaveLength(0)
    })

    BddTest().then('it should mark the container as empty', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the self knowledge elements request fails', () => {
    beforeEach(async () => {
      server.use(selfKnowledgeCategoryElementsErrorHandler)

      await mountInterestsContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
