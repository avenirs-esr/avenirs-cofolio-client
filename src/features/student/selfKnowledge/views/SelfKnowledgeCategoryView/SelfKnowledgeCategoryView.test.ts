import { selfKnowledgeElementDetailsNotFoundHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ErrorMessageStub } from '@/common/components/feedback/ErrorMessage/ErrorMessage.stub'
import { SelfKnowledgeElementDetailsStub } from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.stub'
import { SelfKnowledgeElementDetailsDropdownStub } from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.stub'
import SelfKnowledgeCategoryView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentSelfKnowledgeElementUpdate = vi.fn()
const navigateToStudentBuildProject = vi.fn()
const mockSelectedElementId = ref('')

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

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

const route = reactive<{ query: { elementId: string } }>({
  query: { elementId: mockSelectedElementId.value },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSelfKnowledgeElementUpdate,
      navigateToStudentBuildProject
    }),
  }
})

const stubs = {
  DetailedPageTitle: DetailedPageTitleStub,
  ErrorMessage: ErrorMessageStub,
  SelfKnowledgeElementDetailsDropdown: SelfKnowledgeElementDetailsDropdownStub,
  SelfKnowledgeElementDetails: SelfKnowledgeElementDetailsStub,
  ConfirmationModal: ConfirmationModalStub
}

BddTest().given('a self knowledge category view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryView>>
  const categoryId = 'STRENGTHS'

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(SelfKnowledgeCategoryView, {
      props: {
        categoryId,
      },
      global: {
        stubs
      }
    })

    await flushPromises()
  }

  beforeEach(() => {
    mockSelectedElementId.value = 'element-123'
    route.query.elementId = mockSelectedElementId.value
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render DetailedPageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('trailingLinks')).toHaveLength(2)
    })

    BddTest().then('it should build the title using the selected element title', () => {
      const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })

      expect(pageTitle.props('title')).toContain('Créativité')
    })

    BddTest().then('it should not render ErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(false)
      })
    })

    BddTest().and('clicking the update option in dropdown', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(SelfKnowledgeElementDetailsDropdownStub)
        expect(dropdown.exists()).toBe(true)
        await dropdown.vm.$emit('update')
      })

      BddTest().then('it should navigate to the self knowledge element update view with correct params', () => {
        expect(navigateToStudentSelfKnowledgeElementUpdate).toHaveBeenCalledWith({
          categoryId,
          elementId: mockSelectedElementId.value
        })
      })
    })

    BddTest().and('confirming deletion of an element', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(SelfKnowledgeElementDetailsDropdownStub)
        expect(dropdown.exists()).toBe(true)
        await dropdown.vm.$emit('delete')

        const confirmModal = wrapper.findComponent({ name: 'ConfirmationModal' })
        expect(confirmModal.exists()).toBe(true)
        await confirmModal.vm.$emit('confirm')
      })

      BddTest().then('it should call the delete API and show success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalled()
        })
      })

      BddTest().then('it should navigate to the build project view', () => {
        return vi.waitFor(() => {
          expect(navigateToStudentBuildProject).toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('the query fails with SELF_KNOWLEDGE_ELEMENT_NOT_FOUND', () => {
    beforeEach(async () => {
      mockSelectedElementId.value = 'missing-element-id'
      route.query.elementId = mockSelectedElementId.value
      server.use(selfKnowledgeElementDetailsNotFoundHandler)

      wrapper = mountComponent(SelfKnowledgeCategoryView, {
        props: {
          categoryId,
        },
        global: {
          stubs
        }
      })

      await flushPromises()
    })

    BddTest().then('it should render ErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)

        const errorMessage = wrapper.findComponent({ name: 'ErrorMessage' })
        expect(errorMessage.props('title')).toBe('Connaissance introuvable')
        expect(errorMessage.props('description')).toBe('La connaissance que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should render DetailedPageTitle', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(pageTitle.exists()).toBe(true)
      })
    })

    BddTest().then('it should not render SelfKnowledgeElementDetails component', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="self-knowledge-element-details"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should not render SelfKnowledgeElementDetailsDropdown', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="self-knowledge-element-details-dropdown"]').exists()).toBe(false)
      })
    })
  })
})
