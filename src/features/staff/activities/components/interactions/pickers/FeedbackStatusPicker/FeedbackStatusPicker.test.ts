import type { FeedbackStatusPickerProps } from '@/features/staff/activities/components/interactions/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import { EFeedbackStatus } from '@/api/avenir-esr'
import FeedbackStatusPicker from '@/features/staff/activities/components/interactions/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import { AvTagPickerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a feedback status picker', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackStatusPicker>>

  const props: FeedbackStatusPickerProps = {
    totalFeedbacks: 18,
    newFeedbacks: 4,
    unprocessedFeedbacks: 4,
    sentFeedbacks: 10,
  }

  const stubs = {
    AvTagPicker: AvTagPickerStub,
  }

  beforeEach(() => {
    wrapper = mount(FeedbackStatusPicker, {
      props,
      global: { stubs },
    })
  })

  BddTest().then('it should render the tag picker', () => {
    expect(wrapper.findComponent(AvTagPickerStub).exists()).toBe(true)
  })

  BddTest().then('it should provide all feedback status options', () => {
    const options = wrapper.findComponent(AvTagPickerStub).props('options')

    expect(options).toHaveLength(4)

    expect(options[0].value).toBe('ALL')
    expect(options[1].value).toBe(EFeedbackStatus.NEW)
    expect(options[2].value).toBe(EFeedbackStatus.IN_PROCESS)
    expect(options[3].value).toBe(EFeedbackStatus.SUBMITTED)
  })

  BddTest().then('it should select all feedbacks by default', () => {
    const selected = wrapper.findComponent(AvTagPickerStub).props('selected')

    expect(selected.value).toBe('ALL')
  })

  BddTest().then('it should pass a handleSelectChange function to tag picker', () => {
    expect(typeof wrapper.findComponent(AvTagPickerStub).props('handleSelectChange')).toBe('function')
  })
})
