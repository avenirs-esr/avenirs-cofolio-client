import type { VueWrapper } from '@vue/test-utils'
import { EActivityThematic } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import ActivityCompactCard, { type ActivityCompactCardProps } from '@/features/student/buildProject/views/ProjectActivitiesView/components/cards/ActivityCompactCard/ActivityCompactCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('an activity compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub, ActivityThematicBadge: ActivityThematicBadgeStub }

  const activity = { id: '1', title: 'Element Title' }

  BddTest().when('the component is mounted without thematic', () => {
    beforeEach(() => {
      const props: ActivityCompactCardProps = { activity }
      wrapper = mountComponent(ActivityCompactCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should not render the thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a thematic', () => {
    beforeEach(() => {
      const props: ActivityCompactCardProps = { activity, thematic: EActivityThematic.EXPERIENCES }
      wrapper = mountComponent(ActivityCompactCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render the thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
    })
  })
})
