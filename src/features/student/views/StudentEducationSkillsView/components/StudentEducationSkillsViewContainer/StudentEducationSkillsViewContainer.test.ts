import { mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import { StudentDetailedEducationalSkillCardStub } from '@/features/student/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.stub'
import StudentEducationSkillsViewContainer from '@/features/student/views/StudentEducationSkillsView/components/StudentEducationSkillsViewContainer/StudentEducationSkillsViewContainer.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student education skills view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentEducationSkillsViewContainer>>

  const stubs = {
    StudentDetailedEducationalSkillCard: StudentDetailedEducationalSkillCardStub,
  }
  const baseProps = { course: mockedProgramsProgressView[0] }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentEducationSkillsViewContainer, {
      props: baseProps,
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render properly with provided props', () => {
      const detailedSkillsCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })

      expect(wrapper.text()).toContain(baseProps.course.name)
      expect(detailedSkillsCards).toHaveLength(baseProps.course.skills.length)
    })
  })
})
