import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementDetailsHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
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
    onCancel: {
      type: Function,
      required: false
    }
  },
  template: '<div class="self-knowledge-element-update-form-stub" />'
})

BddTest().given('a self knowledge element update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementUpdateView>>

  const stubs = {
    UpdatePageTitle: UpdatePageTitleStub,
    SelfKnowledgeElementsSideMenu: SelfKnowledgeElementsSideMenuStub,
    SelfKnowledgeElementTabs: SelfKnowledgeElementTabsStub,
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

        const elements = sideMenu.props('elements') as SelfKnowledgeElementViewDTO[]
        const countElements = sideMenu.props('countElements') as number

        expect(Array.isArray(elements)).toBe(true)
        expect(elements.length).toBeGreaterThan(0)
        expect(typeof countElements).toBe('number')
        expect(countElements).toBeGreaterThan(0)
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
      })
    })

    BddTest().then('it should render the badge in the title slot', async () => {
      await vi.waitFor(() => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
        expect(badge.exists()).toBe(true)
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
      let sideMenu: any

      beforeEach(async () => {
        await vi.waitFor(() => {
          sideMenu = wrapper.findComponent(SelfKnowledgeElementsSideMenuStub)
          expect(sideMenu.exists()).toBe(true)
        })

        sideMenu.vm.$emit('loadMoreElements')
      })

      BddTest().then('it should emit loadMoreElements from the side menu', () => {
        expect(sideMenu.emitted('loadMoreElements')).toBeTruthy()
        expect(sideMenu.emitted('loadMoreElements')!.length).toBe(1)
      })
    })
  })
})
