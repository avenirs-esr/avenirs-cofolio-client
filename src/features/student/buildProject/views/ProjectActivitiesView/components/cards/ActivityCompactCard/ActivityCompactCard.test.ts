import type { VueWrapper } from '@vue/test-utils'
import { ValorizedBadgeStub } from '@/common/components/ValorizedBadge/ValorizedBadge.stub'
import ActivityCompactCard, { type ActivityCompactCardProps } from '@/features/student/buildProject/views/ProjectActivitiesView/components/cards/ActivityCompactCard/ActivityCompactCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('an activity compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub, ValorizedBadge: ValorizedBadgeStub }

  const props: ActivityCompactCardProps = {
    title: 'Element Title',
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityCompactCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.exists()).toBe(true)
    })
  })
})
