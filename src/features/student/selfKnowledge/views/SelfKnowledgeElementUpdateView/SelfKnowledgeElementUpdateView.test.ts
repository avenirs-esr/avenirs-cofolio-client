import type { PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementDetailsHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { SelfKnowledgeElementDetailsContainerStub } from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.stub'
import { SelfKnowledgeElementsSideMenuStub } from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.stub'
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

// --- Mock du composable useSelfKnowledgePaginatedElements ---

const elementsMock = ref<SelfKnowledgeElementViewDTO[]>([])
const pageInfoMock = ref<PageInfoDTO>({
  page: 0,
  pageSize: 3,
  totalElements: 0,
  totalPages: 0
})
const pageMock = ref(0)
const isFetchingMock = ref(false)
let loadMoreElementsSpy = vi.fn()
let resetPaginationSpy = vi.fn()

vi.mock(
  '@/features/student/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements',
  () => ({
    useSelfKnowledgePaginatedElements: vi.fn(() => ({
      elements: elementsMock,
      pageInfo: pageInfoMock,
      page: pageMock,
      isFetching: isFetchingMock,
      loadMoreElements: loadMoreElementsSpy,
      resetPagination: resetPaginationSpy
    }))
  })
)

// --- Stubs locaux ---

const SelfKnowledgeElementTabsStub = defineComponent({
  name: 'SelfKnowledgeElementTabs',
  props: {
    selfKnowledgeElement: {
      type: Object,
      required: true
    },
    categoryType: {
      type: [String, Number],
      required: true
    }
  },
  template: `
    <div class="self-knowledge-element-tabs-stub">
      <slot name="element" />
      <slot name="associations" />
    </div>
  `
})

const SelfKnowledgeElementUpdateFormStub = defineComponent({
  name: 'SelfKnowledgeElementUpdateForm',
  props: {
    element: {
      type: Object,
      required: true
    },
    categoryType: {
      type: [String, Number],
      required: true
    }
  },
  template: '<div class="self-knowledge-element-update-form-stub" />'
})

const AvBadgeStub = defineComponent({
  name: 'AvBadge',
  props: {
    label: String,
    backgroundColor: String,
    color: String,
    icon: String
  },
  template: '<div class="av-badge-stub" />'
})

BddTest().given('a self knowledge element update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementUpdateView>>

  const stubs = {
    PageTitle: PageTitleStub,
    SelfKnowledgeElementsSideMenu: SelfKnowledgeElementsSideMenuStub,
    SelfKnowledgeElementTabs: SelfKnowledgeElementTabsStub,
    SelfKnowledgeElementDetailsContainer: SelfKnowledgeElementDetailsContainerStub,
    SelfKnowledgeElementUpdateForm: SelfKnowledgeElementUpdateFormStub,
    AvBadge: AvBadgeStub
  }

  const categoryId = 'strengths'
  const elementId = '1'

  BddTest().when('the view is rendered', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      // Reset des mocks du composable
      loadMoreElementsSpy = vi.fn()
      resetPaginationSpy = vi.fn()
      elementsMock.value = [
        { id: '1', title: 'Element 1' } as SelfKnowledgeElementViewDTO,
        { id: '2', title: 'Element 2' } as SelfKnowledgeElementViewDTO
      ]
      pageInfoMock.value = {
        page: 0,
        pageSize: 3,
        totalElements: 10,
        totalPages: 4
      }
      pageMock.value = 0
      isFetchingMock.value = false

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

    BddTest().then('it should render the PageTitle component', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should render the SelfKnowledgeElementsSideMenu component', async () => {
      await vi.waitFor(() => {
        const sideMenu = wrapper.findComponent(SelfKnowledgeElementsSideMenuStub)
        expect(sideMenu.exists()).toBe(true)
      })
    })

    BddTest().then('it should pass elements and count to the side menu', async () => {
      await vi.waitFor(() => {
        const sideMenu = wrapper.findComponent(SelfKnowledgeElementsSideMenuStub)

        expect(sideMenu.exists()).toBe(true)
        expect(sideMenu.props('elements')).toEqual(elementsMock.value)
        expect(sideMenu.props('countElements')).toBe(pageInfoMock.value.totalElements)
      })
    })

    BddTest().then('it should render the element title in the details container', async () => {
      await vi.waitFor(() => {
        const container = wrapper.findComponent(SelfKnowledgeElementDetailsContainerStub)
        expect(container.exists()).toBe(true)
        expect(container.props('elementTitle')).toBe(mockedSelfKnowledgeElementDetails.title)
      })
    })

    BddTest().then('it should render SelfKnowledgeElementTabs with correct props', async () => {
      await vi.waitFor(() => {
        const tabs = wrapper.findComponent(SelfKnowledgeElementTabsStub)

        expect(tabs.exists()).toBe(true)
        expect(tabs.props('selfKnowledgeElement')).toEqual(mockedSelfKnowledgeElementDetails)
        expect(tabs.props('categoryType')).toBeDefined()
      })
    })

    BddTest().then('it should render the update form inside the tabs', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(SelfKnowledgeElementUpdateFormStub)

        expect(form.exists()).toBe(true)
        expect(form.props('element')).toEqual(mockedSelfKnowledgeElementDetails)
        expect(form.props('categoryType')).toBeDefined()
      })
    })

    BddTest().then('it should render the badge in the title slot', async () => {
      await vi.waitFor(() => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.props('label')).toBeDefined()
        expect(badge.props('icon')).toBeDefined()
      })
    })

    BddTest().and('an element is selected', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const sideMenu = wrapper.findComponent(SelfKnowledgeElementsSideMenuStub)
          expect(sideMenu.exists()).toBe(true)
          sideMenu.vm.$emit('selectElement', '2')
        })
      })

      BddTest().then('it should navigate to the element update view of the selected element', () => {
        expect(navigateToStudentSelfKnowledgeElementUpdate).toHaveBeenCalledWith({
          categoryId,
          elementId: '2',
          replace: true
        })
      })
    })

    BddTest().and('the side menu emits loadMoreElements', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const sideMenu = wrapper.findComponent(SelfKnowledgeElementsSideMenuStub)
          expect(sideMenu.exists()).toBe(true)
          sideMenu.vm.$emit('loadMoreElements')
        })
      })

      BddTest().then('it should call loadMoreElements from the paginated composable', () => {
        expect(loadMoreElementsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
