import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QuerySuspenseStub, SortableListStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { addDays, format, parseISO } from 'date-fns'
import { beforeEach, expect } from 'vitest'
import {
  mockedSubActivitiesOverviewDTO,
  mockedSubActivitiesOverviewDTOWithPeriod,
  mockedSubActivitiesOverviewDTOWithUnpublishable,
} from '@/__mocks__/fixtures/shared/activities.fixtures'
import { ErrorBadgeStub } from '@/common/components/badges/ErrorBadge/ErrorBadge.stub'
import { WarningBadgeStub } from '@/common/components/badges/WarningBadge/WarningBadge.stub'
import { ROUTES } from '@/common/constants'
import SubActivitiesSortableList from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.vue'

const ANNOUNCEMENT_MESSAGE = 'Sous-activité {subActivityName} déplacée de la position {fromPos} à la position {toPos} sur {subActivitiesLength}'
const EMPTY_STATE_MESSAGE = 'Aucune sous-activité pour le moment'
const OUTSIDE_ACTIVITY_PERIOD_LABEL = 'Période à couvrir'
const UNPUBLISHABLE_LABEL = 'Non publiable'

type MountProps = InstanceType<typeof SubActivitiesSortableList>['$props']

const defaultProps: MountProps = {
  modelValue: [],
}

BddTest().given('a SubActivitiesSortableList component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubActivitiesSortableList>>

  const stubs = {
    AvButton: AvButtonStub,
    ErrorBadge: ErrorBadgeStub,
    QuerySuspense: QuerySuspenseStub,
    SortableList: SortableListStub,
    WarningBadge: WarningBadgeStub,
  }

  const mountWith = (props: Partial<MountProps> = {}) => {
    wrapper = mountComponent(SubActivitiesSortableList, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs },
    })
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getSortableList = () => wrapper.findComponent(SortableListStub)

  const getRenderedSubActivities = () => wrapper.findAll('.sortable-list-stub__item').map(item => ({
    title: item.find('[data-testid="sub-activity-title"]'),
    button: item.findComponent(AvButtonStub),
    errorBadge: item.findComponent(ErrorBadgeStub),
    warningBadge: item.findComponent(WarningBadgeStub),
  }))

  const toItems = (list: SubActivityOverviewDTO[]) => {
    return list.map(({ id, title, publishable }) => ({
      id,
      label: title,
      publishable,
      isOutsideActivityPeriod: false,
    }))
  }

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
      }[key]),
    )
  }

  const shiftDate = (date: string, days: number) => {
    return format(addDays(parseISO(date), days), 'yyyy-MM-dd')
  }

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

    BddTest().then('it should not render any sub-activity', () => {
      expect(getRenderedSubActivities()).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with sub-activities', () => {
    const subActivities = mockedSubActivitiesOverviewDTO

    beforeEach(() => {
      mountWith({
        modelValue: subActivities,
      })
    })

    BddTest().then('it should not display the empty state', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should give the sub-activities to the sortable list', () => {
      expect(getSortableList().props('modelValue')).toEqual(toItems(subActivities))
    })

    BddTest().then('it should not be loading', () => {
      expect(getSortableList().props('isLoading')).toBe(false)
    })

    BddTest().then('it should render each sub-activity title', () => {
      const expectedTitles = subActivities.map(({ title }) => title)
      expect(getRenderedSubActivities().map(({ title }) => title.text())).toEqual(expectedTitles)
    })

    BddTest().then('it should link each sub-activity to its edit page', () => {
      const expectedLinks = subActivities.map(({ id }) => ({
        to: {
          name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
          params: { id },
        },
        target: '_blank',
        rel: 'noopener noreferrer',
      }))

      const actualLinks = getRenderedSubActivities().map(({ button }) => ({
        to: button.props('to'),
        target: button.attributes('target'),
        rel: button.attributes('rel'),
      }))

      expect(actualLinks).toEqual(expectedLinks)
    })

    BddTest().then('it should not flag any sub-activity as unpublishable', () => {
      expect(getRenderedSubActivities().map(({ warningBadge }) => warningBadge.exists())).not.toContain(true)
    })

    BddTest().then('it should announce moves with the sub-activity name and positions', () => {
      const { id, title } = subActivities[0]!
      const lastIndex = subActivities.length - 1
      const formatAnnouncement = getSortableList().props('announcementFormatter')!

      const formattedAnnouncement = formatAnnouncement({ id, label: title }, 0, lastIndex)
      const expectedAnnouncement = getAnnouncementMessage(title, 1, lastIndex + 1, subActivities.length)

      expect(formattedAnnouncement).toBe(expectedAnnouncement)
    })

    BddTest().and('the sortable list is reordered', () => {
      const reversedSubActivities = [...subActivities].reverse()

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
    const subActivities = mockedSubActivitiesOverviewDTOWithUnpublishable

    beforeEach(() => {
      mountWith({
        modelValue: subActivities,
      })
    })

    BddTest().then('it should flag only the unpublishable sub-activities', () => {
      const expectedLabels = subActivities.map(({ publishable }) => publishable
        ? undefined
        : UNPUBLISHABLE_LABEL)

      const labels = getRenderedSubActivities().map(({ warningBadge }) => warningBadge.exists()
        ? warningBadge.props('label')
        : undefined)

      expect(labels).toEqual(expectedLabels)
    })
  })

  BddTest().when('some sub-activities have a period', () => {
    const subActivities = mockedSubActivitiesOverviewDTOWithPeriod
    const subActivityWithPeriod = subActivities.find(({ startDate }) => startDate)!
    const subActivityStartDate = subActivityWithPeriod.startDate!
    const subActivityEndDate = subActivityWithPeriod.endDate!

    BddTest().and('the activity period does not cover one of them', () => {
      beforeEach(() => {
        mountWith({
          modelValue: subActivities,
          activityStartDate: shiftDate(subActivityStartDate, 1),
          activityEndDate: subActivityEndDate,
        })
      })

      BddTest().then('it should flag only this sub-activity', () => {
        const expectedLabels = subActivities.map(({ id }) => id === subActivityWithPeriod.id
          ? OUTSIDE_ACTIVITY_PERIOD_LABEL
          : undefined)

        const labels = getRenderedSubActivities().map(({ errorBadge }) => errorBadge.exists()
          ? errorBadge.props('label')
          : undefined)

        expect(labels).toEqual(expectedLabels)
      })
    })

    BddTest().and('the activity period covers them', () => {
      beforeEach(() => {
        mountWith({
          modelValue: subActivities,
          activityStartDate: shiftDate(subActivityStartDate, -1),
          activityEndDate: shiftDate(subActivityEndDate, 1),
        })
      })

      BddTest().then('it should not flag any sub-activity', () => {
        expect(getRenderedSubActivities().map(({ errorBadge }) => errorBadge.exists())).not.toContain(true)
      })
    })

    BddTest().and('the activity period is incomplete', () => {
      beforeEach(() => {
        mountWith({
          modelValue: subActivities,
          activityStartDate: shiftDate(subActivityStartDate, 1),
        })
      })

      BddTest().then('it should not flag any sub-activity', () => {
        expect(getRenderedSubActivities().map(({ errorBadge }) => errorBadge.exists())).not.toContain(true)
      })
    })
  })

  BddTest().when('the order is being saved', () => {
    const subActivities = mockedSubActivitiesOverviewDTO

    beforeEach(() => {
      mountWith({
        modelValue: subActivities,
        isLoading: true,
      })
    })

    BddTest().then('it should show the sortable list as loading', () => {
      expect(getSortableList().props('isLoading')).toBe(true)
    })
  })
})
