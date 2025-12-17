import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { SelfKnowledgeElementDetailsContainerStub } from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.stub'
import { SelfKnowledgeElementsSideMenuStub } from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.stub'
import SelfKnowledgeCategoryView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const navigateToStudentSelfKnowledgeElementUpdate = vi.fn()
const mockSelectedElementId = ref('')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn((key: string, defaultValue: string) => {
    if (key === 'elementId') {
      return mockSelectedElementId
    }
    return ref(defaultValue)
  })
}))

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSelfKnowledgeElementUpdate,
    }),
  }
})

const SelfKnowledgeElementDetailsDropdownStub = defineComponent({
  name: 'SelfKnowledgeElementDetailsDropdown',
  emits: ['updateSelected', 'shareSelected', 'deleteSelected'],
  template: '<div data-testid="self-knowledge-element-details-dropdown" />'
})

const SelfKnowledgeElementDetailsStub = defineComponent({
  name: 'SelfKnowledgeElementDetails',
  props: ['element'],
  template: '<div data-testid="self-knowledge-element-details" />'
})

const SelfKnowledgeElementTabsStub = defineComponent({
  name: 'SelfKnowledgeElementTabs',
  props: ['categoryType'],
  template: '<div data-testid="self-knowledge-element-tabs"><slot name="element" /><slot name="associations" /></div>'
})

const stubs = {
  PageTitle: PageTitleStub,
  SelfKnowledgeElementsSideMenu: SelfKnowledgeElementsSideMenuStub,
  SelfKnowledgeElementDetailsContainer: SelfKnowledgeElementDetailsContainerStub,
  SelfKnowledgeElementDetailsDropdown: SelfKnowledgeElementDetailsDropdownStub,
  SelfKnowledgeElementDetails: SelfKnowledgeElementDetailsStub,
  SelfKnowledgeElementTabs: SelfKnowledgeElementTabsStub
}

BddTest().given('a self knowledge category view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryView>>
  const categoryId = '4aec2faa-d986-4553-a14b-2ecabba415c8'

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(SelfKnowledgeCategoryView, {
      props: {
        categoryId,
      },
      global: {
        stubs
      }
    })

    await vi.waitFor(() => {
      const sideMenu = wrapper.findComponent({ name: 'SelfKnowledgeElementsSideMenu' })
      const elements = sideMenu.props('elements') as SelfKnowledgeElementViewDTO[]
      expect(elements.length).toBeGreaterThan(0)
    })
  }

  const getSideMenu = () => wrapper.findComponent({ name: 'SelfKnowledgeElementsSideMenu' })

  const getSideMenuElements = () => {
    const sideMenu = getSideMenu()
    return sideMenu.props('elements') as SelfKnowledgeElementViewDTO[]
  }

  beforeEach(() => {
    mockSelectedElementId.value = ''
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>

      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Bâtir mon projet',
        to: ROUTES.STUDENT.PROJECT_TRAJECTORIES
      })
      expect(breadcrumbLinks[3]).toEqual({
        text: 'Me connaître'
      })
    })

    BddTest().then('it should build the title using the translated category type label', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Détail de mes points forts')
    })

    BddTest().then('it should render the side menu with correct props', () => {
      const sideMenu = getSideMenu()
      const elements = getSideMenuElements()

      expect(sideMenu.exists()).toBe(true)

      const categoryType = sideMenu.props('categoryType') as string
      const selectedElementId = sideMenu.props('selectedElementId') as string

      expect(elements).toHaveLength(3)
      expect(elements[0].title).toBe('Créativité')
      expect(elements[1].title).toBe('Esprit d\'équipe')
      expect(elements[2].title).toBe('Leadership')

      expect(categoryType).toBe('STRENGTHS')
      expect(selectedElementId).toBe('')
    })

    BddTest().then('it should render element details container with empty title initially', () => {
      const detailsContainer = wrapper.findComponent({ name: 'SelfKnowledgeElementDetailsContainer' })

      expect(detailsContainer.exists()).toBe(true)
      expect(detailsContainer.props('elementTitle')).toBe('')
    })

    BddTest().then('it should pass correct category type to element tabs', () => {
      const elementTabs = wrapper.findComponent({ name: 'SelfKnowledgeElementTabs' })

      expect(elementTabs.exists()).toBe(true)
      expect(elementTabs.props('categoryType')).toBe('STRENGTHS')
    })

    BddTest().and('selecting an element from the side menu', () => {
      let firstElementId: string

      beforeEach(async () => {
        const sideMenu = getSideMenu()
        const elements = getSideMenuElements()
        firstElementId = elements[0].id

        sideMenu.vm.$emit('selectElement', firstElementId)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should update selectedElementId', () => {
        const sideMenu = getSideMenu()

        expect(sideMenu.props('selectedElementId')).toBe(firstElementId)
      })

      BddTest().then('it should update the element title in details container', async () => {
        await vi.waitFor(() => {
          const detailsContainer = wrapper.findComponent({ name: 'SelfKnowledgeElementDetailsContainer' })
          expect(detailsContainer.props('elementTitle')).toBe('Créativité')
        })
      })

      BddTest().then('it should pass the selected element to element details component', async () => {
        await vi.waitFor(() => {
          const elementDetails = wrapper.findComponent(SelfKnowledgeElementDetailsStub)
          expect(elementDetails.exists()).toBe(true)
        })

        const elementDetails = wrapper.findComponent(SelfKnowledgeElementDetailsStub)
        const element = elementDetails.props('element') as SelfKnowledgeElementViewDTO

        expect(element.title).toBe('Créativité')
      })
    })

    BddTest().and('clicking the update option in dropdown', () => {
      let firstElementId: string

      beforeEach(async () => {
        const sideMenu = getSideMenu()
        const elements = getSideMenuElements()
        firstElementId = elements[0].id

        sideMenu.vm.$emit('selectElement', firstElementId)
        await nextTick()

        const dropdown = wrapper.findComponent(SelfKnowledgeElementDetailsDropdownStub)
        dropdown.vm.$emit('updateSelected')
      })

      BddTest().then('it should navigate to the self knowledge element update view with correct params', () => {
        expect(navigateToStudentSelfKnowledgeElementUpdate).toHaveBeenCalledWith({
          categoryId,
          elementId: firstElementId
        })
      })
    })

    BddTest().and('loading more elements when scrolling', () => {
      beforeEach(async () => {
        const sideMenu = getSideMenu()
        sideMenu.vm.$emit('loadMoreElements')
        await flushPromises()
      })

      BddTest().then('it should fetch the next page of elements', async () => {
        await vi.waitFor(() => {
          const elements = getSideMenuElements()
          expect(elements.length).toBeGreaterThan(3)
        })

        const elements = getSideMenuElements()

        expect(elements).toHaveLength(6)
        expect(elements[3].title).toBe('Persévérance')
      })

      BddTest().then('it should accumulate elements without duplicates', async () => {
        await vi.waitFor(() => {
          const elements = getSideMenuElements()
          expect(elements.length).toBe(6)
        })

        const elements = getSideMenuElements()
        const uniqueIds = new Set(elements.map(el => el.id))
        expect(uniqueIds.size).toBe(elements.length)
      })
    })

    BddTest().and('loading more elements multiple times', () => {
      beforeEach(async () => {
        const sideMenu = getSideMenu()

        await sideMenu.vm.$emit('loadMoreElements')
        await flushPromises()

        await vi.waitFor(() => {
          const elements = getSideMenuElements()
          expect(elements.length).toBe(6)
        })

        sideMenu.vm.$emit('loadMoreElements')
        await flushPromises()
      })

      BddTest().then('it should continue accumulating elements', async () => {
        await vi.waitFor(() => {
          const elements = getSideMenuElements()
          expect(elements.length).toBe(9)
        })

        const elements = getSideMenuElements()

        expect(elements).toHaveLength(9)
        expect(elements[6].title).toBe('Organisation')
      })
    })
  })

  BddTest().when('the component is mounted with an elementId query param', () => {
    beforeEach(async () => {
      mockSelectedElementId.value = 'existing-element-id'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should set selectedElementId from query param', () => {
      const sideMenu = getSideMenu()

      expect(sideMenu.props('selectedElementId')).toBe('existing-element-id')
    })
  })

  BddTest().when('the component is remounted after fetching data', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()

      await vi.waitFor(() => {
        const elements = getSideMenuElements()
        expect(elements.length).toBe(3)
      })

      const sideMenu = getSideMenu()
      sideMenu.vm.$emit('loadMoreElements')
      await flushPromises()

      await vi.waitFor(() => {
        const elements = getSideMenuElements()
        expect(elements.length).toBe(6)
      })
    })

    BddTest().then('it should have accumulated elements from multiple pages', () => {
      const elements = getSideMenuElements()

      expect(elements.length).toBe(6)
    })

    BddTest().then('it should show the total count of elements', () => {
      const sideMenu = getSideMenu()
      const countElements = sideMenu.props('countElements') as number

      expect(countElements).toBe(10)
    })
  })
})
