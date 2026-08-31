import { mockedActivityDetail, mockedSubscribedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import ActivityCatalogHeader from '@/common/activities/components/ActivityCatalogHeader/ActivityCatalogHeader.vue'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity catalog banner', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCatalogHeader>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
  }

  BddTest().when('the component is mounted with a banner and subscribed declared activity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCatalogHeader, {
        props: {
          title: mockedSubscribedActivityDetail.title,
          thematic: mockedSubscribedActivityDetail.thematic,
          banner: mockedSubscribedActivityDetail.banner,
          subscribedDeclaredActivity: mockedSubscribedActivityDetail.subscribedDeclaredActivity,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the banner image with correct src', () => {
      const bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.exists()).toBe(true)
      expect(bannerImage.attributes('src')).toBe(mockedSubscribedActivityDetail.banner!.url)
    })

    BddTest().then('it should render the banner image with correct alt', () => {
      const bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.attributes('alt')).toBe(mockedSubscribedActivityDetail.banner!.fileName)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedSubscribedActivityDetail.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(mockedSubscribedActivityDetail.thematic)
    })

    BddTest().then('it should render the declared activity status badge with SUBSCRIBED status', () => {
      const badge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('status')).toBe(EDeclaredActivityStatus.SUBSCRIBED)
    })
  })

  BddTest().when('the component is mounted without a banner', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCatalogHeader, {
        props: {
          title: mockedActivityDetail.title,
          thematic: mockedActivityDetail.thematic,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the banner image', () => {
      expect(wrapper.find('[data-testid="activity-banner"]').exists()).toBe(false)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedActivityDetail.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(EActivityThematic.SELF_KNOWLEDGE)
    })

    BddTest().then('it should not render the declared activity status badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a banner but without subscribedDeclaredActivity', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCatalogHeader, {
        props: {
          title: mockedActivityDetail.title,
          thematic: mockedActivityDetail.thematic,
          banner: mockedActivityDetail.banner,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the banner image', () => {
      expect(wrapper.find('[data-testid="activity-banner"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the declared activity status badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(false)
    })
  })
})
