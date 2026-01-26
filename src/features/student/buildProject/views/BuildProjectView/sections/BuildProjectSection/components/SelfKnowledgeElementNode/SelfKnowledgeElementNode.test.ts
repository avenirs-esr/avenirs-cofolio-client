import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createPutUpdateSelfKnowledgeElementHandler, postCreateSelfKnowledgeElementErrorHandler, putUpdateSelfKnowledgeElementErrorHandler, putUpdateSelfKnowledgeElementErrorNotFoundHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { RatingStub } from '@/common/components'
import { TitleDescriptionNodeTemplateStub } from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.stub'
import { mandatoryNodeProps } from '@/common/utils/vue-flow/vue-flow-test'
import SelfKnowledgeElementNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeElementNode/SelfKnowledgeElementNode.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockUpdateNodeId = vi.fn()
const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()
const mockSetErrorCode = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
      setErrorCode: mockSetErrorCode
    }),
  }
})

vi.mock('@/common/composables/VueFlow/use-nodes/use-nodes', () => ({
  useNodes: () => ({
    updateNodeId: mockUpdateNodeId
  }),
}))

BddTest().given('a SelfKnowledgeElementNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementNode>>

  const stubs = {
    TitleDescriptionNodeTemplate: TitleDescriptionNodeTemplateStub,
    Rating: RatingStub
  }

  BddTest().when('the component is mounted witihout ratng', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeProps,
      flowId: 'test-flow',
      id: mockedSelfKnowledgeCategories[0].id,
      data: {
        categoryId: mockedSelfKnowledgeCategories[0].id,
        title: 'Maîtriser de nouvelles langues',
        description: 'Apprendre et pratiquer de nouvelles langues étrangères'
      }
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(SelfKnowledgeElementNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the TitleDescriptionNodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should not render the Rating component', () => {
      const rating = wrapper.findComponent(RatingStub)
      expect(rating.exists()).toBe(false)
    })

    BddTest().and('the user selects update self-knowledge element', () => {
      BddTest().and('the update mutation is successful', () => {
        beforeEach(() => {
          const handler = createPutUpdateSelfKnowledgeElementHandler({
            title: props.data.title,
            description: props.data.description,
            rating: props.data.rating,
            id: 'temp-id'
          })
          server.use(handler)
          wrapper.findComponent(TitleDescriptionNodeTemplateStub).vm.$emit(('updateInProfile'))
        })

        BddTest().then('it should call addSuccessMessage', async () => {
          await vi.waitFor(() => {
            expect(mockAddSuccessMessage).toHaveBeenCalled()
          })
        })
      })

      BddTest().and('the update mutation fails without SELF_KNOWLEDGE_ELEMENT_NOT_FOUND error', () => {
        beforeEach(() => {
          server.use(putUpdateSelfKnowledgeElementErrorHandler)
          wrapper.findComponent(TitleDescriptionNodeTemplateStub).vm.$emit(('updateInProfile'))
        })

        BddTest().then('it should call addErrorMessage', async () => {
          await vi.waitFor(() => {
            expect(mockAddErrorMessage).toHaveBeenCalled()
          })
        })
      })

      BddTest().and('the update mutation fails with SELF_KNOWLEDGE_ELEMENT_NOT_FOUND error', () => {
        beforeEach(() => {
          server.use(putUpdateSelfKnowledgeElementErrorNotFoundHandler)
          wrapper.findComponent(TitleDescriptionNodeTemplateStub).vm.$emit(('updateInProfile'))
        })

        BddTest().then('it should try and succeed to add a new self-knowledge element', async () => {
          await vi.waitFor(() => {
            expect(mockUpdateNodeId).toHaveBeenCalled()
            expect(mockAddSuccessMessage).toHaveBeenCalled()
            expect(mockAddErrorMessage).not.toHaveBeenCalled()
          })
        })
      })

      BddTest().and('the update mutation fails with SELF_KNOWLEDGE_ELEMENT_NOT_FOUND error but adding new element fails', () => {
        beforeEach(() => {
          server.use(
            putUpdateSelfKnowledgeElementErrorNotFoundHandler,
            postCreateSelfKnowledgeElementErrorHandler
          )
          wrapper.findComponent(TitleDescriptionNodeTemplateStub).vm.$emit(('updateInProfile'))
        })

        BddTest().then('it should call addErrorMessage', async () => {
          await vi.waitFor(() => {
            expect(mockAddErrorMessage).toHaveBeenCalled()
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with rating', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeProps,
      flowId: 'test-flow',
      id: mockedSelfKnowledgeCategories[0].id,
      data: {
        categoryId: mockedSelfKnowledgeCategories[0].id,
        title: 'Maîtriser de nouvelles langues',
        description: 'Apprendre et pratiquer de nouvelles langues étrangères',
        rating: 4
      }
    }

    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the Rating component', () => {
      const rating = wrapper.findComponent(RatingStub)
      expect(rating.exists()).toBe(true)
      expect(rating.props('rating')).toBe(4)
    })
  })
})
