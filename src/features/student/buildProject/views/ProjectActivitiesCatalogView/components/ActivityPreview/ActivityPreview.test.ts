import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import { ActivityThematicBadgeStub } from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityPreview, { type ActivityPreviewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { AvButtonStub, AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type DOMWrapper, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity preview', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPreview>>
  let bannerImage: DOMWrapper<Element>

  const props: ActivityPreviewProps = {
    activity: mockedActivityDetail
  }

  const stubs = {
    AvButton: AvButtonStub,
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    ActivityThematicBadge: ActivityThematicBadgeStub
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
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
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

    BddTest().then('it should render the unsubscribe button', () => {
      const unsubscribeButton = wrapper.findComponent(AvButtonStub).find('[data-testid="unsubscribe-button"]')
      expect(unsubscribeButton.exists()).toBe(true)
      expect(unsubscribeButton.text()).toBe('Me désinscrire')
    })

    BddTest().then('it should render the unsubscribe confirmation modal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('activities')).toEqual([{ id: mockedActivityDetail.id, title: mockedActivityDetail.title }])
    })

    BddTest().and('the user clicks the unsubscribe button', () => {
      beforeEach(() => {
        const unsubscribeButton = wrapper.findComponent(AvButtonStub).find('[data-testid="unsubscribe-button"]')
        unsubscribeButton.trigger('click')
      })

      BddTest().then('it should display the confirmation modal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.props('show')).toBe(true)
      })

      BddTest().and('the user cancels the unsubscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          modal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the unsubscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          modal.vm.$emit('unsubscribed')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })
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
