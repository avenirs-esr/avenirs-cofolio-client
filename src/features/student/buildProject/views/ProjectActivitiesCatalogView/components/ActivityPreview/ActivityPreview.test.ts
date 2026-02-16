import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type DOMWrapper, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import { ActivityThemacticBadgeStub } from '@/features/student/buildProject/components/badges/ActivityThemacticBadge/ActivityThematicBadge.stub'
import ActivityPreview, { type ActivityPreviewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'

BddTest().given('an activity preview', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPreview>>
  let bannerImage: DOMWrapper<Element>

  const props: ActivityPreviewProps = {
    activity: mockedActivityDetail
  }

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    ActivityThemacticBadge: ActivityThemacticBadgeStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render the activity banner', () => {
      bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.exists()).toBe(true)
      expect(bannerImage.attributes('src')).toBe(mockedActivityDetail.banner!.url)
      expect(bannerImage.attributes('alt')).toBe(mockedActivityDetail.banner!.fileName)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedActivityDetail.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThemacticBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('it should render the activity summary', () => {
      const summary = wrapper.find('[data-testid="activity-summary"]')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render the execution period info', () => {
      const executionPeriodInfo = wrapper.find('[data-testid="activity-execution-period-info"]')
      expect(executionPeriodInfo.exists()).toBe(true)
      expect(executionPeriodInfo.text()).toBe(mockedActivityDetail.executionPeriodInfo)
    })
  })

  BddTest().when('the activity has no banner', () => {
    beforeEach(() => {
      const activityWithoutBanner = { ...mockedActivityDetail, banner: undefined }
      wrapper = mount(ActivityPreview, { props: { activity: activityWithoutBanner }, global: { stubs } })
    })

    BddTest().then('it should not render the banner image', () => {
      bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.exists()).toBe(false)
    })
  })
})
