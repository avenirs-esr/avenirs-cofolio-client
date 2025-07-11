import { mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import StudentEducationSkillsViewContainer from '@/features/student/views/StudentEducationSkillsView/components/StudentEducationSkillsViewContainer/StudentEducationSkillsViewContainer.vue'
import { mount } from '@vue/test-utils'

describe('studentEducationSkillsViewContainer', () => {
  const stubs = {
    StudentDetailedEducationalSkillCard: {
      name: 'StudentDetailedEducationalSkillCard',
      template: `<div class="student-detailed-skill-card" />`,
      props: ['skill', 'skillColor']
    },
  }
  const baseProps = { course: mockedProgramsProgressView[0] }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render properly with provided props', () => {
    const wrapper = mount(StudentEducationSkillsViewContainer, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const detailedSkillsCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })

    expect(wrapper.text()).toContain(baseProps.course.name)
    expect(detailedSkillsCards).toHaveLength(baseProps.course.skills.length)
  })
})
