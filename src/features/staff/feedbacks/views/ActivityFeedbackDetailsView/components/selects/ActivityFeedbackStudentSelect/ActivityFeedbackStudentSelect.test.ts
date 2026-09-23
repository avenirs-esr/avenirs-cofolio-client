import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import { EFeedbackStatus, EGroupType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants/route-names'
import ActivityFeedbackStudentSelect
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.vue'
import { AvButtonStub, AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { getAvButtonByTestId, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStaffStudentTrackingActivityFeedbackDetailsMock = vi.fn()
const navigateToStaffActivityFeedbackDetailsMock = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStaffStudentTrackingActivityFeedbackDetails: navigateToStaffStudentTrackingActivityFeedbackDetailsMock,
    navigateToStaffActivityFeedbackDetails: navigateToStaffActivityFeedbackDetailsMock,
  }),
}))

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

const feedbacks = [
  {
    feedbackId: 'feedback-1',
    status: EFeedbackStatus.NEW,
    student: {
      id: 'student-1',
      firstName: 'Lucas',
      lastName: 'Tessier',
      email: 'lucas.tessier@test.fr',
      programs: [
        {
          id: 'program-1',
          name: 'Licence Informatique',
          type: EGroupType.PROGRAM,
        },
        {
          id: 'program-2',
          name: 'Licence Mathématiques',
          type: EGroupType.PROGRAM,
        },
      ],
    },
  },
  {
    feedbackId: 'feedback-2',
    status: EFeedbackStatus.SUBMITTED,
    student: {
      id: 'student-2',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.fr',
    },
  },
] as StudentFeedbackItemListDTO[]

const feedbacksWithUndefinedFeedbackId = [
  ...feedbacks,
  {
    feedbackId: undefined,
    status: EFeedbackStatus.SEEN,
    student: {
      id: 'student-3',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.fr',
    },
  },
] as StudentFeedbackItemListDTO[]

const feedbacksWithEmptyPrograms = [
  {
    feedbackId: 'feedback-3',
    status: EFeedbackStatus.NEW,
    student: {
      id: 'student-3',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.fr',
      programs: [],
    },
  },
] as StudentFeedbackItemListDTO[]

const expectedOptions: { id: string, feedbackId: string, label: string }[] = [
  {
    id: 'student-1',
    feedbackId: 'feedback-1',
    label: 'Lucas Tessier • Nouveau',
  },
  {
    id: 'student-2',
    feedbackId: 'feedback-2',
    label: 'John Doe • Envoyé',
  },
]

const stubs = { AvSelect: AvSelectStub, AvButton: AvButtonStub }

BddTest().given('an ActivityFeedbackStudentSelect component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof ActivityFeedbackStudentSelect>>

  const getPreviousButton = () => getAvButtonByTestId(wrapper, 'previous-student-button')
  const getNextButton = () => getAvButtonByTestId(wrapper, 'next-student-button')
  const getDetails = () => wrapper.find('.activity-feedback-student-select__details')

  beforeEach(() => {
    vi.clearAllMocks()
    route.name = ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name
  })

  BddTest().when('the component is rendered with feedbacks and a selected student', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
          selectedStudentId: 'student-1',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the student select', () => {
      expect(wrapper.find('[data-testid="student-feedback-select"]').exists()).toBe(true)
    })

    BddTest().then('it should render the previous and next buttons', () => {
      expect(wrapper.find('[data-testid="previous-student-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="next-student-button"]').exists()).toBe(true)
    })

    BddTest().then('it should pass the student options to the select', () => {
      const select = wrapper.findComponent(AvSelectStub)

      expect(select.props('options')).toEqual(expectedOptions)
    })

    BddTest().then('it should display the selected student programs and email', () => {
      expect(getDetails().text()).toBe('Licence Informatique, Licence Mathématiques • lucas.tessier@test.fr')
    })

    BddTest().then('it should disable the previous button (first student in the list)', () => {
      expect(getPreviousButton()!.props('disabled')).toBe(true)
    })

    BddTest().then('it should explain why the previous button is disabled', () => {
      expect(getPreviousButton()!.props('disabledTooltip')).toBe('Vous consultez déjà le premier étudiant')
    })

    BddTest().then('it should link the next button to the next student, on the student tracking route', () => {
      expect(getNextButton()!.props('to')).toEqual({
        name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: 'feedback-2' },
      })
    })

    BddTest().and('the user picks a student directly in the native select', () => {
      beforeEach(async () => {
        const select = wrapper.findComponent(AvSelectStub)
        await select.vm.$emit('update:selectedItem', { itemId: 'student-2' })
      })

      BddTest().then('it should navigate to that student current feedback, on the student tracking route', () => {
        expect(navigateToStaffStudentTrackingActivityFeedbackDetailsMock).toHaveBeenCalledWith({ feedbackId: 'feedback-2' })
        expect(navigateToStaffActivityFeedbackDetailsMock).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the component is rendered outside the student tracking route (staff home)', () => {
    beforeEach(() => {
      route.name = ROUTES.STAFF.ACTIVITY_FEEDBACK.name

      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
          selectedStudentId: 'student-1',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should link the next button to the staff home feedback route', () => {
      expect(getNextButton()!.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: 'feedback-2' },
      })
    })

    BddTest().and('the user picks a student directly in the native select', () => {
      beforeEach(async () => {
        const select = wrapper.findComponent(AvSelectStub)
        await select.vm.$emit('update:selectedItem', { itemId: 'student-2' })
      })

      BddTest().then('it should navigate using the staff home route', () => {
        expect(navigateToStaffActivityFeedbackDetailsMock).toHaveBeenCalledWith({ feedbackId: 'feedback-2' })
        expect(navigateToStaffStudentTrackingActivityFeedbackDetailsMock).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the selected student is the last one in the list', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
          selectedStudentId: 'student-2',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should disable the next button', () => {
      expect(getNextButton()!.props('disabled')).toBe(true)
    })

    BddTest().then('it should explain why the next button is disabled', () => {
      expect(getNextButton()!.props('disabledTooltip')).toBe('Vous consultez déjà le dernier étudiant')
    })

    BddTest().then('it should link the previous button to the previous student', () => {
      expect(getPreviousButton()!.props('to')).toEqual({
        name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: 'feedback-1' },
      })
    })

    BddTest().then('it should display the email without the separator (no programs)', () => {
      expect(getDetails().text()).toBe('john.doe@test.fr')
    })
  })

  BddTest().when('the selected student has an empty programs list', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks: feedbacksWithEmptyPrograms,
          selectedStudentId: 'student-3',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should display the email without the separator', () => {
      expect(getDetails().text()).toBe('jane.doe@test.fr')
    })
  })

  BddTest().when('no student is selected', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should not display the student details', () => {
      expect(getDetails().exists()).toBe(false)
      expect(wrapper.text()).not.toContain('lucas.tessier@test.fr')
      expect(wrapper.text()).not.toContain('Licence Informatique')
    })

    BddTest().then('it should disable the previous and next buttons', () => {
      expect(getPreviousButton()!.props('disabled')).toBe(true)
      expect(getNextButton()!.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the selected student id does not match any known student', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
          selectedStudentId: 'unknown-student',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should not display any student details', () => {
      expect(getDetails().exists()).toBe(false)
      expect(wrapper.text()).not.toContain('lucas.tessier@test.fr')
      expect(wrapper.text()).not.toContain('john.doe@test.fr')
    })

    BddTest().then('it should disable the previous and next buttons', () => {
      expect(getPreviousButton()!.props('disabled')).toBe(true)
      expect(getNextButton()!.props('disabled')).toBe(true)
    })
  })

  BddTest().when('a feedback has no feedback id', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks: feedbacksWithUndefinedFeedbackId,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should not include it in the select options', () => {
      const select = wrapper.findComponent(AvSelectStub)

      expect(select.props('options')).toEqual(expectedOptions)
    })
  })
})
