import type { VueWrapper } from '@vue/test-utils'
import type { NationalActivitySubActivitiesListProps } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySubActivitiesList/NationalActivitySubActivitiesList.vue'
import { AvListItemStub, AvListStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ROUTES } from '@/common/constants'
import NationalActivitySubActivitiesList from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySubActivitiesList/NationalActivitySubActivitiesList.vue'

const SUB_ACTIVITIES_TITLE = 'Sous-activités'

const defaultProps: NationalActivitySubActivitiesListProps = {
  subActivities: [],
  status: EActivityStatus.PUBLISHED,
}

BddTest().given('a NationalActivitySubActivitiesList component', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivitySubActivitiesList>>

  const stubs = {
    AvList: AvListStub,
    AvListItem: AvListItemStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    RouterLink: RouterLinkStub,
  }

  const mountWith = (props: Partial<NationalActivitySubActivitiesListProps> = {}) => {
    wrapper = mountComponent(NationalActivitySubActivitiesList, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs }
    })
  }

  const getContainer = () => wrapper.findComponent(IconTitleCardContainerStub)
  const getList = () => wrapper.findComponent(AvListStub)
  const getItems = () => wrapper.findAllComponents(AvListItemStub)
  const getLinks = () => wrapper.findAllComponents(RouterLinkStub)

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the section title', () => {
      expect(getContainer().props('title')).toBe(SUB_ACTIVITIES_TITLE)
    })

    BddTest().then('it should label the list with the section title', () => {
      expect(getList().attributes('aria-label')).toBe(SUB_ACTIVITIES_TITLE)
    })

    BddTest().then('it should not render any sub-activity', () => {
      expect(getItems()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with sub-activities', () => {
    beforeEach(() => {
      mountWith({
        subActivities: mockedSubActivitiesOverviewDTO,
        status: EActivityStatus.DRAFT,
      })
    })

    BddTest().then('it should render one item per sub-activity with its title', () => {
      expect(getItems().map(item => item.props('title'))).toEqual(
        mockedSubActivitiesOverviewDTO.map(subActivity => subActivity.title)
      )
    })

    BddTest().then('it should number the sub-activities from 1', () => {
      expect(getItems().map(item => item.props('index'))).toEqual(
        mockedSubActivitiesOverviewDTO.map((_, index) => index + 1)
      )
    })

    BddTest().then('it should link each sub-activity to its catalog page with the parent status', () => {
      expect(getLinks().map(link => link.props('to'))).toEqual(
        mockedSubActivitiesOverviewDTO.map(subActivity => ({
          name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
          params: { status: EActivityStatus.DRAFT, id: subActivity.id },
        }))
      )
    })
  })
})
