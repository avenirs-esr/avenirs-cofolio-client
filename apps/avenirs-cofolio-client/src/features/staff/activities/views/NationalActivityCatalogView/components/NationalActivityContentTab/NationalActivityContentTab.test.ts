import type { ActivityContentDTO, FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { NationalActivityContentTabProps } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub, ICONS } from '@avenirs-esr/shared'
import { EActivityStatus, EFileType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedActivityContent, mockedActivityContentWithSubActivities, mockedSubActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ActivityDescriptionContentStub } from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import { ActivityRecommendedCompletionContextsListStub } from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.stub'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityResourcesListStub } from '@/common/components/interaction/lists/ActivityResourcesList/ActivityResourcesList.stub'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { NationalActivitySettingDetailsStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.stub'
import { NationalActivitySubActivitiesListStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySubActivitiesList/NationalActivitySubActivitiesList.stub'

const CONSIGN_TITLE = 'Consigne'
const CONTEXT_TITLE = 'Contexte(s) de réalisation conseillé(s)'
const RESOURCES_TITLE = 'Documents et liens utiles ({count})'

const defaultProps: NationalActivityContentTabProps = {
  activity: mockedActivityContent,
  status: EActivityStatus.PUBLISHED,
}

const fileResource: FileDTO = {
  id: 'file-1',
  fileName: 'document.pdf',
  fileType: EFileType.PDF,
  fileSize: 1024,
  url: 'https://example.com/document.pdf',
  uploadedAt: '2026-07-07T00:00:00Z',
}
const files = [fileResource]
const links = ['https://example.com', 'https://avenirs.fr']
const activityWithResources: ActivityContentDTO = {
  ...mockedActivityContent,
  files,
  links,
}
const activityWithoutThematic: ActivityContentDTO = {
  ...mockedActivityContent,
  thematic: undefined,
}

BddTest().given('a national activity content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityContentTab>>

  const stubs = {
    ActivityDescriptionContent: ActivityDescriptionContentStub,
    ActivityRecommendedCompletionContextsList: ActivityRecommendedCompletionContextsListStub,
    ActivityResourcesList: ActivityResourcesListStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    AvIconText: AvIconTextStub,
    Card: CardStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    NationalActivitySettingDetails: NationalActivitySettingDetailsStub,
    NationalActivitySubActivitiesList: NationalActivitySubActivitiesListStub,
  }

  const mountWith = (props: Partial<NationalActivityContentTabProps> = {}) => {
    wrapper = mount(NationalActivityContentTab, {
      props: { ...defaultProps, ...props },
      global: { stubs },
    })
  }

  const getContentTab = () => wrapper.find('[data-testid="national-activity-catalog-content-tab"]')
  const getTitle = () => wrapper.findComponent(AvIconTextStub)
  const getActivityThematicBadge = () => wrapper.findComponent(ActivityThematicBadgeStub)
  const getScheduleCard = () => wrapper.findComponent(CardStub)
  const getConsignTitle = () => wrapper.find('[data-testid="national-activity-content-tab-consign-title"]')
  const getActivityDescriptionContent = () => wrapper.findComponent(ActivityDescriptionContentStub)
  const getContextTitle = () => wrapper.find('[data-testid="national-activity-content-tab-context-title"]')
  const getActivityRecommendedCompletionContextsList = () => wrapper.findComponent(ActivityRecommendedCompletionContextsListStub)
  const getResourcesSection = () => wrapper.findComponent(IconTitleCardContainerStub)
  const getActivityResourcesList = () => wrapper.findComponent(ActivityResourcesListStub)
  const getNationalActivitySettingDetails = () => wrapper.findComponent(NationalActivitySettingDetailsStub)
  const getNationalActivitySubActivitiesList = () => wrapper.findComponent(NationalActivitySubActivitiesListStub)

  const resourcesTitle = (count: number) => {
    return RESOURCES_TITLE.replace('{count}', String(count))
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the content tab container', () => {
      expect(getContentTab().exists()).toBe(true)
    })

    BddTest().then('it should render the activity title with icon and typography', () => {
      const title = getTitle()
      expect(title.props('text')).toBe(mockedActivityContent.title)
      expect(title.props('icon')).toBe(ICONS.ACTIVITY)
      expect(title.props('typographyClass')).toBe('n4 av-text-regular')
    })

    BddTest().then('it should render the thematic badge with the activity thematic', () => {
      const badge = getActivityThematicBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(mockedActivityContent.thematic)
    })

    BddTest().then('it should render the schedule card', () => {
      expect(getScheduleCard().exists()).toBe(true)
    })

    BddTest().then('it should render the consign title with the matching label', () => {
      const consignTitle = getConsignTitle()
      expect(consignTitle.exists()).toBe(true)
      expect(consignTitle.text()).toBe(CONSIGN_TITLE)
    })

    BddTest().then('it should render the activity description', () => {
      const description = getActivityDescriptionContent()
      expect(description.exists()).toBe(true)
      expect(description.props('description')).toBe(mockedActivityContent.description)
    })

    BddTest().then('it should render the context title with the matching label', () => {
      const contextTitle = getContextTitle()
      expect(contextTitle.exists()).toBe(true)
      expect(contextTitle.text()).toBe(CONTEXT_TITLE)
    })

    BddTest().then('it should render the recommended completion contexts list', () => {
      const contextsList = getActivityRecommendedCompletionContextsList()
      expect(contextsList.exists()).toBe(true)
      expect(contextsList.props('recommendedCompletionContexts')).toBe(mockedActivityContent.recommendedCompletionContexts)
    })

    BddTest().then('it should render the setting details component with the activity', () => {
      const settingDetails = getNationalActivitySettingDetails()
      expect(settingDetails.exists()).toBe(true)
      expect(settingDetails.props('activity')).toEqual(mockedActivityContent)
    })

    BddTest().then('it should not render the resources section when the activity has no resource', () => {
      expect(getResourcesSection().exists()).toBe(false)
      expect(getActivityResourcesList().exists()).toBe(false)
    })

    BddTest().then('it should not render the sub-activities list when the activity has no sub-activity', () => {
      expect(getNationalActivitySubActivitiesList().exists()).toBe(false)
    })
  })

  BddTest().when('the activity has no thematic', () => {
    beforeEach(() => {
      mountWith({
        activity: activityWithoutThematic,
      })
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(getActivityThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should still render the activity title', () => {
      expect(getTitle().props('text')).toBe(mockedActivityContent.title)
    })
  })

  BddTest().when('the activity has files and links', () => {
    beforeEach(() => {
      mountWith({
        activity: activityWithResources,
      })
    })

    BddTest().then('it should render the resources section', () => {
      expect(getResourcesSection().exists()).toBe(true)
    })

    BddTest().then('it should render the resources title with the total count', () => {
      expect(getResourcesSection().props('title')).toBe(resourcesTitle(files.length + links.length))
    })

    BddTest().then('it should forward the files and links to the resources list', () => {
      const list = getActivityResourcesList()
      expect(list.props('files')).toEqual(files)
      expect(list.props('links')).toEqual(links)
      expect(list.props('isDraft')).toBe(false)
    })
  })

  BddTest().when('the activity is a draft', () => {
    beforeEach(() => {
      mountWith({
        activity: activityWithResources,
        status: EActivityStatus.DRAFT,
      })
    })

    BddTest().then('it should flag the resources list as draft', () => {
      expect(getActivityResourcesList().props('isDraft')).toBe(true)
    })
  })

  BddTest().when('the activity has sub-activities', () => {
    beforeEach(() => {
      mountWith({
        activity: mockedActivityContentWithSubActivities,
        status: EActivityStatus.DRAFT,
      })
    })

    BddTest().then('it should render the sub-activities list', () => {
      expect(getNationalActivitySubActivitiesList().exists()).toBe(true)
    })

    BddTest().then('it should forward the sub-activities and the activity status to the list', () => {
      const subActivitiesList = getNationalActivitySubActivitiesList()
      expect(subActivitiesList.props('subActivities')).toEqual(mockedActivityContentWithSubActivities.subActivities)
      expect(subActivitiesList.props('status')).toBe(EActivityStatus.DRAFT)
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountWith({
        activity: mockedSubActivityContent,
        status: EActivityStatus.DRAFT,
      })
    })

    BddTest().then('it should render the title with the sub-activity icon', () => {
      expect(getTitle().props('icon')).toBe(ICONS.SUB_ACTIVITY)
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(getActivityThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should still render the setting details', () => {
      expect(getNationalActivitySettingDetails().exists()).toBe(true)
    })

    BddTest().then('it should still render the consign and the recommended completion contexts', () => {
      expect(getActivityDescriptionContent().exists()).toBe(true)
      expect(getActivityRecommendedCompletionContextsList().exists()).toBe(true)
    })
  })
})
