import type { VueWrapper } from '@vue/test-utils'
import ActivityPeriodDisplay, {
  type ActivityPeriodDisplayProps
} from '@/common/activities/components/ActivityPeriodDisplay/ActivityPeriodDisplay.vue'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity period display component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPeriodDisplay>>
  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub
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

    BddTest().then('it should render the icon title card container', () => {
      const cardContainer = wrapper.findComponent(IconTitleCardContainerStub)
      expect(cardContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the period with localized dates', () => {
      expect(wrapper.find('span.s2-regular').text()).toBe('01/02/2025 - 29/10/2025')
    })

    BddTest().then('it should pass the period title to the icon title card container', () => {
      const cardContainer = wrapper.findComponent(IconTitleCardContainerStub)
      expect(cardContainer.props('title')).toBe('Période de réalisation')
    })
  })
})
