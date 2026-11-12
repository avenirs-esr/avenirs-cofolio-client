import type { VueWrapper } from '@vue/test-utils'
import type { SubActivitiesListProps } from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QuerySuspenseStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ROUTES } from '@/common/constants'
import SubActivitiesSortableList from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.vue'

const EMPTY_STATE_MESSAGE = 'Aucune sous-activité pour le moment'

const defaultProps: SubActivitiesListProps = {
  subActivities: []
}

BddTest().given('a SubActivitiesSortableList component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubActivitiesSortableList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    RouterLink: RouterLinkStub,
  }

  const mountWith = (props: Partial<SubActivitiesListProps> = {}) => {
    wrapper = mountComponent(SubActivitiesSortableList, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs }
    })
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  const getLinks = () => wrapper.findAllComponents(RouterLinkStub)

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the empty state message', () => {
      expect(getQuerySuspense().props()).toMatchObject({
        isEmpty: true,
        emptyStateMessage: EMPTY_STATE_MESSAGE,
      })
    })

    BddTest().then('it should not render any sub-activity link', () => {
      expect(getLinks()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with sub-activities', () => {
    beforeEach(() => {
      mountWith({
        subActivities: mockedSubActivitiesOverviewDTO
      })
    })

    BddTest().then('it should not display the empty state', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should render each sub-activity title as a link', () => {
      expect(getLinks().map(link => link.text())).toEqual(mockedSubActivitiesOverviewDTO.map(({ title }) => title))
    })

    BddTest().then('it should link each sub-activity to its edit page', () => {
      expect(getLinks().map(link => link.props('to'))).toEqual(
        mockedSubActivitiesOverviewDTO.map(({ id }) => ({
          name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
          params: { id }
        }))
      )
    })
  })
})
