import { mockedActivityOverview, mockedNewActivityOverview } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { LongIconCardStub } from '@/common/components/cards/LongIconCard/LongIconCard.stub'
import ActivityLongIconCard from '@/features/global/views/StudentHomeView/components/ActivityLongIconCard/ActivityLongIconCard.vue'
import { IX_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

  BddTest().when('the component is mounted with a not new activity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLongIconCard, {
        props: { activity: mockedActivityOverview },
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
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(mockedActivityOverview.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the declared activity status badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the not new activity icon', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('icon')).toEqual({
        name: RI_ICONS.BOOK_SHELF_LINE,
        color: 'var(--icon)'
      })
    })
  })

  BddTest().when('the component is mounted with a new activity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLongIconCard, {
        props: { activity: mockedNewActivityOverview },
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
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(mockedNewActivityOverview.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the declared activity status badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the new activity icon', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('icon')).toEqual({
        name: IX_ICONS.LIBRARY_NEW,
        color: 'var(--dark-background-success)'
      })
    })
  })

  BddTest().when('the component is mounted with an activity without status', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLongIconCard, {
        props: { activity: { ...mockedActivityOverview, status: undefined } },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render the declared activity status badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(false)
    })
  })
})
