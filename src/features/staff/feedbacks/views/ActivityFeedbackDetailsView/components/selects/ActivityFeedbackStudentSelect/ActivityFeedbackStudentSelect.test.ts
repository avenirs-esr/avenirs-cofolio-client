import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import ActivityFeedbackStudentSelect
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const feedbacks = [
  {
    feedbackId: 'feedback-1',
    student: {
      id: 'student-1',
      firstName: 'Lucas',
      lastName: 'Tessier',
      email: 'lucas.tessier@test.fr',
    },
  },
  {
    feedbackId: 'feedback-2',
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
    student: {
      id: 'student-3',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.fr',
    },
  },
] as StudentFeedbackItemListDTO[]

const stubs = { AvSelect: AvSelectStub }

BddTest().given('an ActivityFeedbackStudentSelect component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof ActivityFeedbackStudentSelect>>

  BddTest().when('the component is rendered with feedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityFeedbackStudentSelect, {
        props: {
          feedbacks,
          selectedStudent: { itemId: 'feedback-1' },
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the student select', () => {
      expect(wrapper.find('[data-testid="student-feedback-select"]').exists()).toBe(true)
    })

    BddTest().then('it should pass the student options to the select', () => {
      const select = wrapper.findComponent(AvSelectStub)

      expect(select.props('options')).toEqual([
        {
          id: 'feedback-1',
          label: 'Lucas Tessier',
        },
        {
          id: 'feedback-2',
          label: 'John Doe',
        },
      ])
    })

    BddTest().then('it should display the selected student email', () => {
      expect(wrapper.text()).toContain('lucas.tessier@test.fr')
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
      expect(wrapper.text()).not.toContain('lucas.tessier@test.fr')
      expect(wrapper.text()).not.toContain('Activité test')
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

      expect(select.props('options')).toEqual([
        {
          id: 'feedback-1',
          label: 'Lucas Tessier',
        },
        {
          id: 'feedback-2',
          label: 'John Doe',
        },
      ])
    })
  })
})
