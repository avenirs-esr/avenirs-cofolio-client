import type { ActivityContentDTO, FileDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EFileType } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ActivityDescriptionContentStub } from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import { ActivityExecutionPeriodListStub } from '@/common/activities/components/ActivityExecutionPeriodList/ActivityExecutionPeriodList.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ICONS } from '@/common/constants'
import { ActivityResourcesListStub } from '@/features/staff/activities/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { NationalActivitySettingDetailsStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.stub'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityContentTab>>

  const stubs = {
    AvIconText: AvIconTextStub,
    Card: CardStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    ActivityDescriptionContent: ActivityDescriptionContentStub,
    ActivityExecutionPeriodList: ActivityExecutionPeriodListStub,
    NationalActivitySettingDetails: NationalActivitySettingDetailsStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    ActivityResourcesList: ActivityResourcesListStub,
  }

  const fileResource: FileDTO = {
    id: 'file-1',
    fileName: 'document.pdf',
    fileType: EFileType.PDF,
    fileSize: 1024,
    url: 'https://example.com/document.pdf',
    uploadedAt: '2026-07-07T00:00:00Z',
  }
  const links = ['https://example.com', 'https://avenirs.fr']
  const activityWithResources: ActivityContentDTO = {
    ...mockedActivityContent,
    files: [fileResource],
    links,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(NationalActivityContentTab, {
      props: { activity: mockedActivityContent },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the content tab container', () => {
      expect(wrapper.find('[data-testid="national-activity-catalog-content-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render the activity title with icon and typography', () => {
      const title = wrapper.find('[data-testid="national-activity-content-tab-title"]')
      const titleComponent = title.getComponent(AvIconTextStub)
      expect(titleComponent.props('text')).toBe(mockedActivityContent.title)
      expect(titleComponent.props('icon')).toBe(ICONS.ACTIVITY)
      expect(title.attributes('typography-class')).toBe('n4 av-text-regular')
    })

    BddTest().then('it should render the thematic badge with the activity thematic', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(mockedActivityContent.thematic)
    })

    BddTest().then('it should render the schedule card', () => {
      expect(wrapper.find('[data-testid="national-activity-content-tab-schedule-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the consign title with the matching label', () => {
      const consignTitle = wrapper.find('[data-testid="national-activity-content-tab-consign-title"]')
      expect(consignTitle.exists()).toBe(true)
      expect(consignTitle.text()).toBe('Consigne')
    })

    BddTest().then('it should render the activity description', () => {
      const description = wrapper.findComponent(ActivityDescriptionContentStub)
      expect(description.exists()).toBe(true)
      expect(description.props('description')).toBe(mockedActivityContent.description)
    })

    BddTest().then('it should render the context title with the matching label', () => {
      const contextTitle = wrapper.find('[data-testid="national-activity-content-tab-context-title"]')
      expect(contextTitle.exists()).toBe(true)
      expect(contextTitle.text()).toBe('Contexte(s) de réalisation conseillé(s)')
    })

    BddTest().then('it should render the execution period list', () => {
      const periodList = wrapper.findComponent(ActivityExecutionPeriodListStub)
      expect(periodList.exists()).toBe(true)
      expect(periodList.props('executionPeriodInfo')).toBe(mockedActivityContent.executionPeriodInfo)
    })

    BddTest().then('it should render the setting details component with the activity', () => {
      const settingDetails = wrapper.findComponent(NationalActivitySettingDetailsStub)
      expect(settingDetails.exists()).toBe(true)
      expect(settingDetails.props('activity')).toEqual(mockedActivityContent)
    })

    BddTest().then('it should not render the resources section when the activity has no resource', () => {
      expect(wrapper.find('[data-testid="national-activity-content-tab-documents"]').exists()).toBe(false)
      expect(wrapper.findComponent(ActivityResourcesListStub).exists()).toBe(false)
    })
  })

  BddTest().when('the activity has files and links', () => {
    beforeEach(() => {
      wrapper = mount(NationalActivityContentTab, {
        props: { activity: activityWithResources },
        global: { stubs },
      })
    })

    BddTest().then('it should render the resources section', () => {
      expect(wrapper.find('[data-testid="national-activity-content-tab-resources"]').exists()).toBe(true)
    })

    BddTest().then('it should render the resources title with the total count', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.props('title')).toBe('Documents et liens utiles (3)')
    })

    BddTest().then('it should forward the files and links to the resources list without add card', () => {
      const list = wrapper.findComponent(ActivityResourcesListStub)
      expect(list.props('files')).toEqual([fileResource])
      expect(list.props('links')).toEqual(links)
      expect(list.props('showAddCard')).toBeFalsy()
    })
  })
})
