import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { AssessmentTableRow } from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityAssessmentStatus, EActivityAssessmentType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { AssessmentStatusBadgeStub } from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.stub'
import { AssessmentTypeBadgeStub } from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.stub'
import { AssessmentActivityTitleStub } from '@/features/staff/assessments/views/AssessmentsView/components/AssessmentActivityTitle/AssessmentActivityTitle.stub'
import AssessmentOverviewList from '@/features/staff/assessments/views/AssessmentsView/components/base/AssessmentOverviewList.vue'
import { AssessmentOverviewCardStub } from '@/features/staff/assessments/views/AssessmentsView/components/cards/AssessmentOverviewCard.stub'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('an assessment overview list', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentOverviewList>>

  const rows: AssessmentTableRow[] = [
    {
      id: 'assessment-1',
      learner: {
        id: 'user-1',
        firstName: 'ALICE',
        lastName: 'DUPONT',
        email: 'alice.dupont@example.com',
      },
      activityTitle: 'Activité 1',
      types: [EActivityAssessmentType.VALIDATION],
      submitDate: '2024-01-15T12:00:00Z',
      status: EActivityAssessmentStatus.NEW,
      actions: 'declared-activity-1',
    },
    {
      id: 'assessment-2',
      learner: {
        id: 'user-2',
        firstName: 'BOB',
        lastName: 'MARTIN',
        email: 'bob.martin@example.com',
      },
      activityTitle: 'Activité 2',
      types: [],
      submitDate: '',
      status: EActivityAssessmentStatus.SENT,
      actions: 'declared-activity-2',
    },
  ]

  const columns: AvTableColumn<AssessmentTableRow>[] = [
    { key: 'learner', label: 'Apprenant' },
    { key: 'activityTitle', label: 'Activité' },
    { key: 'types', label: 'Type' },
    { key: 'submitDate', label: 'Date de dépôt' },
    { key: 'status', label: 'Statut' },
    { key: 'actions', label: 'Accéder' },
  ]

  const stubs = {
    AvTable: AvTableStub,
    AvButton: AvButtonStub,
    UserInfo: UserInfoStub,
    AssessmentActivityTitle: AssessmentActivityTitleStub,
    AssessmentTypeBadge: AssessmentTypeBadgeStub,
    AssessmentStatusBadge: AssessmentStatusBadgeStub,
    AssessmentOverviewCard: AssessmentOverviewCardStub,
  }

  const mountWith = (options: {
    belowLg?: boolean
    rows?: AssessmentTableRow[]
    columns?: AvTableColumn<AssessmentTableRow>[]
  } = {}) => {
    const {
      belowLg = false,
      rows: rowsProp = rows,
      columns: columnsProp = columns,
    } = options

    mockIsBelowLg.value = belowLg

    wrapper = mount(AssessmentOverviewList, {
      props: {
        rows: rowsProp,
        columns: columnsProp,
      },
      global: { stubs },
    })
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="group-overview-list-cards"]')
  const getCards = () => wrapper.findAllComponents(AssessmentOverviewCardStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsBelowLg.value = false
  })

  BddTest().when('the screen is at least the large breakpoint', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the table instead of the cards', () => {
      expect(getTable().exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should pass the rows and columns to the table', () => {
      expect(getTable().props('rows')).toEqual(rows)
      expect(getTable().props('columns')).toEqual(columns)
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should render user information in learner cell slot', () => {
      const userInfos = wrapper.findAllComponents(UserInfoStub)
      expect(userInfos).toHaveLength(rows.length)
      expect(userInfos[0].props('user')).toEqual(rows[0].learner)
      expect(userInfos[1].props('user')).toEqual(rows[1].learner)
    })

    BddTest().then('it should render activity title in activityTitle cell slot', () => {
      const titles = wrapper.findAllComponents(AssessmentActivityTitleStub)
      expect(titles).toHaveLength(rows.length)
      expect(titles[0].props('activityTitle')).toBe(rows[0].activityTitle)
      expect(titles[1].props('activityTitle')).toBe(rows[1].activityTitle)
    })

    BddTest().then('it should render type badges in type cell slot', () => {
      const expectedTypes = rows.flatMap(row => row.types)
      const typeBadges = wrapper.findAllComponents(AssessmentTypeBadgeStub)

      expect(typeBadges).toHaveLength(expectedTypes.length)
      expect(typeBadges[0].props('assessmentType')).toBe(expectedTypes[0])
    })

    BddTest().then('it should render status badges in status cell slot', () => {
      const statusBadges = wrapper.findAllComponents(AssessmentStatusBadgeStub)
      expect(statusBadges).toHaveLength(rows.length)

      expect(statusBadges[0].props('assessmentStatus')).toBe(rows[0].status)
      expect(statusBadges[1].props('assessmentStatus')).toBe(rows[1].status)
    })

    BddTest().then('it should render action buttons linking to assessment details', () => {
      const buttons = wrapper.findAllComponents(AvButtonStub)
      expect(buttons).toHaveLength(rows.length)
      expect(buttons[0].props('icon')).toBe(CUIDA_ICONS.VISIBILITY_ON_OUTLINE)
      expect(buttons[0].props('iconOnly')).toBe(true)
      expect(buttons[0].props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
        params: {
          declaredActivityId: rows[0].actions,
        },
      })
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(() => {
      mountWith({ belowLg: true })
    })

    BddTest().then('it should render cards instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render one card per assessment row', () => {
      expect(getCards()).toHaveLength(rows.length)
      expect(getCards()[0].props('assessment')).toEqual(rows[0])
      expect(getCards()[1].props('assessment')).toEqual(rows[1])
    })
  })
})
