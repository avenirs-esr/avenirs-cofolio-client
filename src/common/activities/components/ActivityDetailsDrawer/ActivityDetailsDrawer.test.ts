import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivityDescriptionContentStub } from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import ActivityDetailsDrawer from '@/common/activities/components/ActivityDetailsDrawer/ActivityDetailsDrawer.vue'
import { ActivityRecommendedCompletionContextsListStub } from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.stub'
import { DrawerStub } from '@/common/components/Drawer/Drawer.stub'
import { AvAccordionStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the ActivityDetailsDrawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailsDrawer>>

  const getDrawer = () => wrapper.findComponent(DrawerStub) as VueWrapper<InstanceType<typeof DrawerStub>>
  const stubs = {
    Drawer: DrawerStub,
    AvAccordion: AvAccordionStub,
    ActivityDescriptionContent: ActivityDescriptionContentStub,
    ActivityRecommendedCompletionContextsList: ActivityRecommendedCompletionContextsListStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(ActivityDetailsDrawer, {
      props: {
        show: true,
        activity: mockedActivityContent,
      },
      global: { stubs },
    })
  })

  BddTest().when('the drawer is mounted with show=true', () => {
    BddTest().then('it should render Drawer with show=true', () => {
      const drawer = getDrawer()
      expect(drawer.exists()).toBe(true)
      expect(drawer.props('show')).toBe(true)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.find('[data-testid="activity-details-drawer-title"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe(mockedActivityContent.title)
    })

    BddTest().then('it should render the consign accordion with the activity description', () => {
      const accordion = wrapper.find('[data-testid="activity-details-drawer-consign-accordion"]')
      expect(accordion.exists()).toBe(true)

      const description = wrapper.findComponent(ActivityDescriptionContentStub)
      expect(description.exists()).toBe(true)
      expect(description.props('description')).toBe(mockedActivityContent.description)
    })

    BddTest().then('it should render the context accordion with the recommended completion contexts', () => {
      const accordion = wrapper.find('[data-testid="activity-details-drawer-context-accordion"]')
      expect(accordion.exists()).toBe(true)

      const contextsList = wrapper.findComponent(ActivityRecommendedCompletionContextsListStub)
      expect(contextsList.exists()).toBe(true)
      expect(contextsList.props('recommendedCompletionContexts')).toBe(mockedActivityContent.recommendedCompletionContexts)
    })
  })

  BddTest().when('the drawer is mounted with show=false', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityDetailsDrawer, {
        props: {
          show: false,
          activity: mockedActivityContent,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should pass show=false to Drawer', () => {
      const drawer = getDrawer()
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on the drawer', () => {
    beforeEach(() => {
      const drawer = getDrawer()
      drawer.vm.$emit('close')
    })

    BddTest().then('it should emit close', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })
  })

  BddTest().when('the drawer is rendered', () => {
    BddTest().then('it should pass the close label to the drawer footer', () => {
      expect(wrapper.findComponent(DrawerStub).props('confirmCancelProps')).toEqual({ cancelLabel: 'Fermer' })
    })

    BddTest().then('it should enable close on click outside', () => {
      expect(wrapper.findComponent(DrawerStub).props('closeOnClickOutside')).toBe(true)
    })
  })
})
