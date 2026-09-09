import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivityDescriptionContentStub } from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import ActivityDetailsDrawer from '@/common/activities/components/ActivityDetailsDrawer/ActivityDetailsDrawer.vue'
import { ActivityRecommendedCompletionContextsListStub } from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.stub'
import { AvAccordionStub, AvButtonStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the ActivityDetailsDrawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailsDrawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvIconText: AvIconTextStub,
    AvAccordion: AvAccordionStub,
    AvButton: AvButtonStub,
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
    BddTest().then('it should render AvDrawer with show=true', () => {
      const avDrawer = wrapper.findComponent({ name: 'AvDrawer' }) as VueWrapper<InstanceType<typeof AvDrawerStub>>
      expect(avDrawer.exists()).toBe(true)
      expect(avDrawer.props('show')).toBe(true)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.find('[data-testid="activity-details-drawer-title"]')
      expect(title.exists()).toBe(true)
      expect(title.getComponent(AvIconTextStub).props('text')).toBe(mockedActivityContent.title)
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

    BddTest().then('it should pass show=false to AvDrawer', () => {
      const avDrawer = wrapper.findComponent({ name: 'AvDrawer' }) as VueWrapper<InstanceType<typeof AvDrawerStub>>
      expect(avDrawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on the drawer', () => {
    beforeEach(async () => {
      const avDrawer = wrapper.findComponent({ name: 'AvDrawer' })
      await avDrawer.vm.$emit('escape-pressed')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit close', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  BddTest().when('the close button is clicked', () => {
    beforeEach(async () => {
      await wrapper.find('[data-testid="activity-details-drawer-close-button"]').trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit close', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  BddTest().when('a click occurs outside the drawer', () => {
    beforeEach(async () => {
      const avDrawer = wrapper.findComponent({ name: 'AvDrawer' })
      await avDrawer.vm.$emit('click-outside')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit close', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })
})
