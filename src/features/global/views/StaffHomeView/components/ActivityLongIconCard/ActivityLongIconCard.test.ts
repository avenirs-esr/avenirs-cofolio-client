import { allStaffActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { LongIconCardStub } from '@/common/components/cards/LongIconCard/LongIconCard.stub'
import ActivityLongIconCard from '@/features/global/views/StaffHomeView/components/ActivityLongIconCard/ActivityLongIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('an activity long icon card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLongIconCard>>

  const stubs = {
    LongIconCard: LongIconCardStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
  }

  const draftActivity = { ...allStaffActivities[0], activityStatus: EActivityStatus.DRAFT }
  const publishedActivity = { ...allStaffActivities[0], activityStatus: EActivityStatus.PUBLISHED }

  BddTest().when('the component is mounted with a draft activity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLongIconCard, {
        props: { activity: draftActivity },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the LongIconCard component', () => {
      const longIconCard = wrapper.findComponent(LongIconCardStub)
      expect(longIconCard.exists()).toBe(true)
    })

    BddTest().then('it should render the activity title as LongIconCard title', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(draftActivity.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the draft activity icon', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('icon')).toEqual({
        name: MDI_ICONS.TEXT_BOX_EDIT_OUTLINE,
        color: 'var(--light-foreground-neutral)'
      })
    })
  })

  BddTest().when('the component is mounted with a published activity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLongIconCard, {
        props: { activity: publishedActivity },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the LongIconCard component', () => {
      const longIconCard = wrapper.findComponent(LongIconCardStub)
      expect(longIconCard.exists()).toBe(true)
    })

    BddTest().then('it should render the activity title as LongIconCard title', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(publishedActivity.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the published activity icon', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('icon')).toEqual({
        name: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE,
        color: 'var(--dark-background-success)'
      })
    })
  })
})
