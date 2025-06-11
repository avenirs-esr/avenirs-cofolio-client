import { mockedPrograms } from '@/features/student/queries'
import { mount } from '@vue/test-utils'
import StudentEducationSkillsViewContainer from './StudentEducationSkillsViewContainer.vue'

describe('studentEducationSkillsViewContainer', () => {
  const stubs = {
    StudentDetailedSkillCard: {
      name: 'StudentDetailedSkillCard',
      template: `<div class="student-detailed-skill-card" />`,
      props: ['skill', 'skillColor']
    },
  }
  const baseProps = { course: mockedPrograms[0] }

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

    const detailedSkillsCards = wrapper.findAllComponents({ name: 'StudentDetailedSkillCard' })

    expect(wrapper.text()).toContain(baseProps.course.name)
    expect(detailedSkillsCards).toHaveLength(baseProps.course.skills.length)
  })
})
