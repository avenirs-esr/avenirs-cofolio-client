import { allStaffActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { LongIconCardStub } from '@/common/components/cards/LongIconCard/LongIconCard.stub'
import ActivityLongIconCard, { type ActivityLongIconCardProps } from '@/features/staff/global/views/StaffHomeView/components/ActivityLongIconCard/ActivityLongIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

const draftActivity = { ...allStaffActivities[0], activityStatus: EActivityStatus.DRAFT }
const publishedActivity = { ...allStaffActivities[0], activityStatus: EActivityStatus.PUBLISHED }
const activityWithoutThematic = { ...allStaffActivities[0], thematic: undefined }

BddTest().given('an activity long icon card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLongIconCard>>

  const stubs = {
    LongIconCard: LongIconCardStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
  }

  const mountWith = (props: Partial<ActivityLongIconCardProps> = {}) => {
    wrapper = mount(ActivityLongIconCard, {
      props: {
        activity: draftActivity,
        ...props
      },
      global: {
        stubs
      }
    })
  }

  const getLongIconCard = () => wrapper.findComponent(LongIconCardStub)
  const getThematicBadge = () => wrapper.findComponent(ActivityThematicBadgeStub)

  BddTest().when('the component is mounted with a draft activity', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the LongIconCard component', () => {
      expect(getLongIconCard().exists()).toBe(true)
    })

    BddTest().then('it should render the activity title as LongIconCard title', () => {
      expect(getLongIconCard().props('title')).toBe(draftActivity.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = getThematicBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(draftActivity.thematic)
    })

    BddTest().then('it should render the draft activity icon', () => {
      expect(getLongIconCard().props('icon')).toEqual({
        name: MDI_ICONS.TEXT_BOX_EDIT_OUTLINE,
        color: 'var(--light-foreground-neutral)'
      })
    })
  })

  BddTest().when('the component is mounted with a published activity', () => {
    beforeEach(() => {
      mountWith({ activity: publishedActivity })
    })

    BddTest().then('it should render the LongIconCard component', () => {
      expect(getLongIconCard().exists()).toBe(true)
    })

    BddTest().then('it should render the activity title as LongIconCard title', () => {
      expect(getLongIconCard().props('title')).toBe(publishedActivity.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = getThematicBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(publishedActivity.thematic)
    })

    BddTest().then('it should render the published activity icon', () => {
      expect(getLongIconCard().props('icon')).toEqual({
        name: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE,
        color: 'var(--dark-background-success)'
      })
    })
  })

  BddTest().when('the component is mounted with an activity without thematic', () => {
    beforeEach(() => {
      mountWith({ activity: activityWithoutThematic })
    })

    BddTest().then('it should still render the LongIconCard component', () => {
      expect(getLongIconCard().exists()).toBe(true)
    })

    BddTest().then('it should not render the activity thematic badge', () => {
      expect(getThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should not render the empty badge wrapper', () => {
      expect(getLongIconCard().find('.av-row').exists()).toBe(false)
    })
  })
})
