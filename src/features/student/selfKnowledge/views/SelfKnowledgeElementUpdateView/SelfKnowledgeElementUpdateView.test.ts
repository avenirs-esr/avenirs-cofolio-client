import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementDetailsHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { SelfKnowledgeElementDetailsContainerStub } from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.stub'
import { SelfKnowledgeElementUpdateFormStub } from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.stub'
import SelfKnowledgeElementUpdateView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentSelfKnowledgeElementUpdate = vi.fn()

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSelfKnowledgeElementUpdate
    })
  }
})

BddTest().given('a self knowledge element update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementUpdateView>>

  const stubs = {
    UpdatePageTitle: UpdatePageTitleStub,
    SelfKnowledgeElementDetailsContainer: SelfKnowledgeElementDetailsContainerStub,
    SelfKnowledgeElementUpdateForm: SelfKnowledgeElementUpdateFormStub,
    UpdateInProgressBadge: UpdateInProgressBadgeStub
  }

  const categoryId = 'STRENGTHS'
  const elementId = '1'

  BddTest().when('the view is rendered', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      const handler = createSelfKnowledgeElementDetailsHandler(mockedSelfKnowledgeElementDetails)
      server.use(handler)

      wrapper = mountComponent(SelfKnowledgeElementUpdateView, {
        props: {
          categoryId,
          elementId
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the UpdatePageTitle component', () => {
      const pageTitle = wrapper.findComponent(UpdatePageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should render the element title in the details container', async () => {
      await vi.waitFor(() => {
        const container = wrapper.findComponent(SelfKnowledgeElementDetailsContainerStub)
        expect(container.exists()).toBe(true)
        expect(container.props('elementTitle')).toBe(mockedSelfKnowledgeElementDetails.title)
      })
    })

    BddTest().then('it should render the update form inside the tabs', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(SelfKnowledgeElementUpdateFormStub)

        expect(form.exists()).toBe(true)
        expect(form.props('element')).toEqual(mockedSelfKnowledgeElementDetails)
      })
    })

    BddTest().then('it should render the badge in the title slot', async () => {
      await vi.waitFor(() => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
        expect(badge.exists()).toBe(true)
      })
    })
  })
})
