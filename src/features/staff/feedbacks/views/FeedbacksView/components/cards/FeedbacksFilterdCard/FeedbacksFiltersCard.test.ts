import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import FeedbacksFiltersCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksFilterdCard/FeedbacksFiltersCard.vue'
import { FeedbackActivityFilterSelectStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/interaction/inputs/FeedbackActivityFilterSelect/FeedbackActivityFilterSelect.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a feedbacks filters card', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksFiltersCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    FeedbackActivityFilterSelect: FeedbackActivityFilterSelectStub,
  }

  const setSelectedActivity = async (activity?: ActivityItemNavigationDTO) => {
    wrapper.findComponent(FeedbackActivityFilterSelectStub).vm.$emit('change', activity)
    await flushPromises()
  }

  beforeEach(() => {
    wrapper = mountComponent(FeedbacksFiltersCard, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the feedbacks filters card', () => {
      expect(wrapper.find('[data-testid="feedbacks-filters-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the IconTitleCardContainer with the correct title and icon', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.props('title')).toBe('Filtrer mes demandes')
      expect(container.props('titleIcon')).toBe(MDI_ICONS.FILTER_OUTLINE)
    })

    BddTest().then('it should render the FeedbackActivityFilterSelect', () => {
      expect(wrapper.findComponent(FeedbackActivityFilterSelectStub).exists()).toBe(true)
    })

    BddTest().then('it should not emit selectedActivityChange', () => {
      expect(wrapper.emitted('selectedActivityChange')).toBeFalsy()
    })
  })

  BddTest().when('the FeedbackActivityFilterSelect emits a change event with an activity', () => {
    const activity: ActivityItemNavigationDTO = { id: 'activity-1', title: 'Activité de test' }

    BddTest().then('it should emit selectedActivityChange with the activity', async () => {
      await setSelectedActivity(activity)
      expect(wrapper.emitted('selectedActivityChange')?.[0]).toEqual([activity])
    })
  })

  BddTest().when('the FeedbackActivityFilterSelect emits a change event with undefined', () => {
    BddTest().then('it should emit selectedActivityChange with undefined', async () => {
      await setSelectedActivity()
      expect(wrapper.emitted('selectedActivityChange')?.[0]).toEqual([undefined])
    })
  })
})
