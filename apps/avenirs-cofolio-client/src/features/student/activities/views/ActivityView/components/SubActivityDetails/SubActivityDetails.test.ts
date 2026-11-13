import type { VueWrapper } from '@vue/test-utils'
import type { SubActivityDetailsProps } from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub, ICONS } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import SubActivityDetails from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'

BddTest().given('a sub-activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubActivityDetails>>

  const props: SubActivityDetailsProps = {
    subActivity: {
      id: 'sub-activity-1',
      title: 'Ma sous-activité',
    },
  }

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SubActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container', () => {
      expect(wrapper.find('[data-testid="sub-activity-details"]').exists()).toBe(true)
    })

    BddTest().then('it should render the sub-activity title in AvIconText', () => {
      const title = wrapper.findComponent(AvIconTextStub)

      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(props.subActivity.title)
      expect(title.props('icon')).toBe(ICONS.ACTIVITY)
    })
  })
})
