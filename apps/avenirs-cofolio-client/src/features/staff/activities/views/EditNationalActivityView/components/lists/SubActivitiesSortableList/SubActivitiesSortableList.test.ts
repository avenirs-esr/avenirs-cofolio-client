import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QuerySuspenseStub, SortableListStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO, mockedSubActivitiesOverviewDTOWithUnpublishable } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { WarningBadgeStub } from '@/common/components/badges/WarningBadge/WarningBadge.stub'
import { ROUTES } from '@/common/constants'
import SubActivitiesSortableList from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.vue'

const ANNOUNCEMENT_MESSAGE = 'Sous-activité {subActivityName} déplacée de la position {fromPos} à la position {toPos} sur {subActivitiesLength}'
const EMPTY_STATE_MESSAGE = 'Aucune sous-activité pour le moment'
const UNPUBLISHABLE_LABEL = 'Non publiable'

type MountProps = InstanceType<typeof SubActivitiesSortableList>['$props']

const defaultProps: MountProps = {
  modelValue: [],
}

function toItems (subActivities: SubActivityOverviewDTO[]) {
  return subActivities.map(({ id, title, publishable }) => ({
    id,
    label: title,
    publishable
  }))
}

BddTest().given('a SubActivitiesSortableList component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubActivitiesSortableList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    RouterLink: RouterLinkStub,
    SortableList: SortableListStub,
    WarningBadge: WarningBadgeStub,
  }

  const mountWith = (props: Partial<MountProps> = {}) => {
    wrapper = mountComponent(SubActivitiesSortableList, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs }
    })
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getSortableList = () => wrapper.findComponent(SortableListStub)
  const getLinks = () => wrapper.findAllComponents(RouterLinkStub)
  const getBadges = () => wrapper.findAllComponents(WarningBadgeStub)
  const getRenderedSubActivities = () => wrapper.findAll('.sortable-list-stub__item').map((item) => {
    const badge = item.findComponent(WarningBadgeStub)

    return {
      title: item.findComponent(RouterLinkStub).text(),
      badgeLabel: badge.exists() ? badge.props('label') : undefined
    }
  })

  const getAnnouncementMessage = (
    subActivityName: string,
    fromPos: number,
    toPos: number,
    subActivitiesLength: number,
  ): string => {
    return ANNOUNCEMENT_MESSAGE.replace(
      /\{(\w+)\}/g,
      (_, key: string) => String({
        subActivityName,
        fromPos,
        toPos,
        subActivitiesLength,
      }[key])
    )
  }

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the empty state message', () => {
      expect(getQuerySuspense().props()).toMatchObject({
        isEmpty: true,
        emptyStateMessage: EMPTY_STATE_MESSAGE
      })
    })

    BddTest().then('it should not render any sub-activity link', () => {
      expect(getLinks()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with sub-activities', () => {
    beforeEach(() => {
      mountWith({
        modelValue: mockedSubActivitiesOverviewDTO
      })
    })

    BddTest().then('it should not display the empty state', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should give the sub-activities to the sortable list', () => {
      expect(getSortableList().props('modelValue')).toEqual(toItems(mockedSubActivitiesOverviewDTO))
    })

    BddTest().then('it should not be loading', () => {
      expect(getSortableList().props('isLoading')).toBe(false)
    })

    BddTest().then('it should render each sub-activity title as a link', () => {
      const expectedContent = mockedSubActivitiesOverviewDTO.map(({ title }) => title)
      expect(getLinks().map(link => link.text())).toEqual(expectedContent)
    })

    BddTest().then('it should link each sub-activity to its edit page', () => {
      const expectedLinks = mockedSubActivitiesOverviewDTO.map(({ id }) => ({
        name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
        params: { id }
      }))
      expect(getLinks().map(link => link.props('to'))).toEqual(expectedLinks)
    })

    BddTest().then('it should not flag any sub-activity as unpublishable', () => {
      expect(getBadges()).toHaveLength(0)
    })

    BddTest().then('it should announce moves with the sub-activity name and positions', () => {
      const { id, title } = mockedSubActivitiesOverviewDTO[0]!
      const lastIndex = mockedSubActivitiesOverviewDTO.length - 1
      const formatAnnouncement = getSortableList().props('announcementFormatter')!

      const formattedAnnouncement = formatAnnouncement({ id, label: title }, 0, lastIndex)
      const expectedAnnouncement = getAnnouncementMessage(title, 1, lastIndex + 1, mockedSubActivitiesOverviewDTO.length)
      expect(formattedAnnouncement).toBe(expectedAnnouncement)
    })

    BddTest().and('the sortable list is reordered', () => {
      const reversedSubActivities = [...mockedSubActivitiesOverviewDTO].reverse()

      beforeEach(async () => {
        getSortableList().vm.$emit('update:modelValue', toItems(reversedSubActivities))
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit the sub-activities in the new order', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[reversedSubActivities]])
      })
    })
  })

  BddTest().when('some sub-activities are not publishable', () => {
    beforeEach(() => {
      mountWith({
        modelValue: mockedSubActivitiesOverviewDTOWithUnpublishable
      })
    })

    BddTest().then('it should flag only the unpublishable sub-activities', () => {
      const expectedSubActivities = mockedSubActivitiesOverviewDTOWithUnpublishable.map(({ title, publishable }) => ({
        title,
        badgeLabel: publishable ? undefined : UNPUBLISHABLE_LABEL
      }))
      expect(getRenderedSubActivities()).toEqual(expectedSubActivities)
    })
  })

  BddTest().when('the order is being saved', () => {
    beforeEach(() => {
      mountWith({
        modelValue: mockedSubActivitiesOverviewDTO,
        isLoading: true
      })
    })

    BddTest().then('it should show the sortable list as loading', () => {
      expect(getSortableList().props('isLoading')).toBe(true)
    })
  })
})
