import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import { ActivityCatalogHeaderStub } from '@/common/activities/components/ActivityCatalogHeader/ActivityCatalogHeader.stub'
import { ActivityCatalogPreviewCardStub } from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import NationalActivityCatalogPreviewTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityCatalogPreviewTab/NationalActivityCatalogPreviewTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity catalog preview tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityCatalogPreviewTab>>

  const stubs = {
    ActivityCatalogHeader: ActivityCatalogHeaderStub,
    ActivityCatalogPreviewCard: ActivityCatalogPreviewCardStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountTab = (activityId = 'activity-1') => mountComponent(NationalActivityCatalogPreviewTab, {
    props: { activityId, status: EActivityStatus.DRAFT },
    global: { stubs },
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountTab()
    await vi.waitFor(() => {
      expect(wrapper.findComponent(ActivityCatalogHeaderStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a valid activityId', () => {
    BddTest().then('it should render the container', () => {
      expect(wrapper.find('[data-testid="national-activity-catalog-preview-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render ActivityCatalogHeader with the correct title', () => {
      expect(wrapper.findComponent(ActivityCatalogHeaderStub).props('title')).toBe(mockedActivityDetail.title)
    })

    BddTest().then('it should render ActivityCatalogHeader with the correct thematic', () => {
      expect(wrapper.findComponent(ActivityCatalogHeaderStub).props('thematic')).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('it should render ActivityCatalogHeader with the correct banner', () => {
      expect(wrapper.findComponent(ActivityCatalogHeaderStub).props('banner')).toEqual(mockedActivityDetail.banner)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with the correct summary', () => {
      expect(wrapper.findComponent(ActivityCatalogPreviewCardStub).props('summary')).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with the correct executionPeriodInfo', () => {
      expect(wrapper.findComponent(ActivityCatalogPreviewCardStub).props('executionPeriodInfo')).toBe(mockedActivityDetail.executionPeriodInfo)
    })
  })

  BddTest().when('the component is mounted with an invalid activityId', () => {
    beforeEach(() => {
      wrapper = mountTab('INVALID_ACTIVITY_ID')
    })

    BddTest().then('it should render QuerySuspense with an error', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
      })
    })

    BddTest().then('it should render QuerySuspense with the correct error title', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('errorTitle')).toBe('Impossible de charger l\'aperçu de l\'activité')
      })
    })
  })
})
