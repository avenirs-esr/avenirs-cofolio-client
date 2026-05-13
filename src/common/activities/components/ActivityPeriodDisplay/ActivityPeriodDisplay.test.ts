import type { VueWrapper } from '@vue/test-utils'
import ActivityPeriodDisplay, {
  type ActivityPeriodDisplayProps
} from '@/common/activities/components/ActivityPeriodDisplay/ActivityPeriodDisplay.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity period display component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPeriodDisplay>>
  const stubs = {
    AvPeriodInput: AvPeriodInputStub
  }

  BddTest().when('the component is mounted with startDate and endDate', () => {
    const props: ActivityPeriodDisplayProps = {
      startDate: '2025-02-01',
      endDate: '2025-10-29'
    }
    beforeEach(() => {
      wrapper = mountComponent(ActivityPeriodDisplay, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render AvPeriodInput', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to AvPeriodInput', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.props('startModelValue')).toBe('2025-02-01')
      expect(periodInput.props('endModelValue')).toBe('2025-10-29')
    })
  })
})
