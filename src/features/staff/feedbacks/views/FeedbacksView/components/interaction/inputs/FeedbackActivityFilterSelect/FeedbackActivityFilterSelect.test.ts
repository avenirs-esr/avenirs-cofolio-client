import { getMockedActivitiesWithFeedbacks } from '@/__mocks__/fixtures/staffs/activities-with-feedbacks.fixtures'
import { type ActivityItemNavigationDTO, EFeedbackStatus } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import FeedbackActivityFilterSelect, { type FeedbackActivityFilterSelectProps } from '@/features/staff/feedbacks/views/FeedbacksView/components/interaction/inputs/FeedbackActivityFilterSelect/FeedbackActivityFilterSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a feedback activity filter select', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackActivityFilterSelect>>
  let activities: ActivityItemNavigationDTO[]

  const stubs = {
    AvSelect: AvSelectStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = async (props: Partial<FeedbackActivityFilterSelectProps> = {}) => {
    wrapper = mountComponent(FeedbackActivityFilterSelect, {
      props,
      global: { stubs }
    })
    activities = getMockedActivitiesWithFeedbacks({ statuses: props.feedbackStatuses })
    await flushPromises()
  }

  BddTest().when('the activities are loading', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should forward isLoading to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(false)
    })

    BddTest().then('it should render the AvSelect component', () => {
      expect(wrapper.findComponent(AvSelectStub).exists()).toBe(true)
    })
  })

  BddTest().when('the activities are fetched successfully', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the feedback activity filter select', () => {
      expect(wrapper.find('[data-testid="feedback-activity-filter-select"]').exists()).toBe(true)
    })

    BddTest().then('it should render the placeholder, the default option and the fetched activities', () => {
      const select = wrapper.findComponent(AvSelectStub)
      const options = select.props('options')

      expect(select.props('placeholder')).toBe('Sélectionner une activité')
      expect(options).toHaveLength(activities.length + 1)
      expect(options[0]).toEqual({
        id: 'ALL',
        label: 'Toutes'
      })

      activities.forEach((activity, index) => {
        expect(options[index + 1]).toEqual({
          id: activity.id,
          label: activity.title
        })
      })
    })

    BddTest().then('it should select the default option by default', () => {
      expect(wrapper.find('select').element.value).toBe('ALL')
    })

    BddTest().then('it should use the translated label by default', () => {
      expect(wrapper.findComponent(AvSelectStub).props('label')).toBe('Filtrer par activité')
    })

    BddTest().then('it should not be disabled', () => {
      expect(wrapper.findComponent(AvSelectStub).props('disabled')).toBe(false)
    })

    BddTest().then('it should not emit a change event before any user interaction', () => {
      expect(wrapper.emitted('change')).toBeFalsy()
    })
  })

  BddTest().when('feedbackStatuses is provided', () => {
    beforeEach(async () => {
      await mountWith({ feedbackStatuses: [EFeedbackStatus.NEW] })
    })

    BddTest().then('it should only render activities matching the given statuses', () => {
      const select = wrapper.findComponent(AvSelectStub)
      const options = select.props('options')

      expect(options).toHaveLength(activities.length + 1)
      activities.forEach((activity, index) => {
        expect(options[index + 1]).toEqual({
          id: activity.id,
          label: activity.title
        })
      })
    })
  })

  BddTest().when('a custom label prop is provided', () => {
    beforeEach(async () => {
      await mountWith({ label: 'Mon activité' })
    })

    BddTest().then('it should use the custom label instead of the translated one', () => {
      expect(wrapper.findComponent(AvSelectStub).props('label')).toBe('Mon activité')
    })
  })

  BddTest().when('the disabled prop is set to true', () => {
    beforeEach(async () => {
      await mountWith({ disabled: true })
    })

    BddTest().then('it should forward disabled to the AvSelect component', () => {
      expect(wrapper.findComponent(AvSelectStub).props('disabled')).toBe(true)
    })
  })

  BddTest().when('no activity matches the given statuses', () => {
    beforeEach(async () => {
      await mountWith({ feedbackStatuses: ['UNDEFINED_FEEDBACK_STATUS' as EFeedbackStatus] })
    })

    BddTest().then('it should disable the AvSelect component', () => {
      expect(wrapper.findComponent(AvSelectStub).props('disabled')).toBe(true)
    })

    BddTest().then('it should only render the placeholder and the default option', () => {
      const options = wrapper.find('select').findAll('option')
      expect(options).toHaveLength(2)
      expect(options[1].attributes('value')).toBe('ALL')
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      await mountWith({ feedbackStatuses: ['INVALID_FEEDBACK_STATUS' as EFeedbackStatus] })
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
    })

    BddTest().then('it should not render the AvSelect component', () => {
      expect(wrapper.findComponent(AvSelectStub).exists()).toBe(false)
    })
  })

  BddTest().when('the user selects an activity', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should emit a change event with the selected activity', async () => {
      await wrapper.find('select').setValue(activities[0].id)
      expect(wrapper.find('select').element.value).toBe(activities[0].id)
      expect(wrapper.emitted('change')?.[0]).toEqual([activities[0]])
    })
  })

  BddTest().when('reset is called after selecting an activity', async () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should emit a change event with undefined', async () => {
      await wrapper.find('select').setValue(activities[0].id)
      wrapper.vm.reset()
      await flushPromises()

      expect(wrapper.find('select').element.value).toBe('ALL')
      expect(wrapper.emitted('change')?.at(-1)).toEqual([undefined])
    })
  })
})
