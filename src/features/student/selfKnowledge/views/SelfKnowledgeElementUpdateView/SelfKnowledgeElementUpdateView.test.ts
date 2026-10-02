import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementDetailsHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants'
import { SelfKnowledgeElementUpdateFormStub } from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.stub'
import SelfKnowledgeElementUpdateView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentSelfKnowledgeElementUpdate = vi.fn()
const navigateToStudentSelfKnowledgeCategory = vi.fn()
const navigateToStudentToolsKitSelfKnowledgeCategory = vi.fn()
const route = reactive<{ name: string }>({ name: ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name })

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return { ...actual, useRoute: () => route }
})

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSelfKnowledgeElementUpdate,
      navigateToStudentSelfKnowledgeCategory,
      navigateToStudentToolsKitSelfKnowledgeCategory
    })
  }
})

BddTest().given('a self knowledge element update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementUpdateView>>

  const stubs = {
    UpdatePageTitle: UpdatePageTitleStub,
    SelfKnowledgeElementUpdateForm: SelfKnowledgeElementUpdateFormStub,
    UpdateInProgressBadge: UpdateInProgressBadgeStub
  }

  const getPageTitle = () => wrapper.findComponent(UpdatePageTitleStub)

  const categoryId = 'STRENGTHS'
  const elementId = '1'

  BddTest().when('the view is rendered', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      route.name = ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name

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
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should link the element breadcrumb to the project category route', async () => {
      await vi.waitFor(() => {
        const pageTitle = getPageTitle()
        expect(pageTitle.props('trailingLinks')).toBeDefined()
        expect(pageTitle.props('trailingLinks')).toHaveLength(3)
        expect(pageTitle.props('trailingLinks')![1].to).toEqual({
          name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
          params: { id: categoryId },
          query: { elementId }
        })
      })
    })

    BddTest().then('it should render the update form inside the tabs', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(SelfKnowledgeElementUpdateFormStub)

        expect(form.exists()).toBe(true)
        expect(form.props('element')).toEqual(mockedSelfKnowledgeElementDetails)
        expect(form.props('category')).toBe(categoryId)
      })
    })

    BddTest().then('it should render the badge in the title slot', async () => {
      await vi.waitFor(() => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
        expect(badge.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the view is opened from the tools kit', () => {
    beforeEach(() => {
      route.name = ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_ELEMENT_UPDATE.name
      server.use(createSelfKnowledgeElementDetailsHandler(mockedSelfKnowledgeElementDetails))
      wrapper = mountComponent(SelfKnowledgeElementUpdateView, {
        props: { categoryId, elementId },
        global: { stubs }
      })
    })

    BddTest().then('it should link the element breadcrumb to the tools kit category route', async () => {
      await vi.waitFor(() => {
        const pageTitle = getPageTitle()
        expect(pageTitle.props('trailingLinks')).toBeDefined()
        expect(pageTitle.props('trailingLinks')).toHaveLength(3)
        expect(pageTitle.props('trailingLinks')![1].to).toEqual({
          name: ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_CATEGORY.name,
          params: { id: categoryId },
          query: { elementId }
        })
      })
    })

    BddTest().then('it should return to the tools kit category when cancelling', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent(SelfKnowledgeElementUpdateFormStub).exists()).toBe(true))
      wrapper.findComponent(SelfKnowledgeElementUpdateFormStub).props('onCancel')!()
      expect(navigateToStudentToolsKitSelfKnowledgeCategory).toHaveBeenCalledWith({
        categoryId,
        elementId
      })
      expect(navigateToStudentSelfKnowledgeCategory).not.toHaveBeenCalled()
    })
  })
})
