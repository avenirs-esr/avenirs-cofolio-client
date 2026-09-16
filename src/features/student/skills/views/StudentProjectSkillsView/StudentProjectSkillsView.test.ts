import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { SkillsViewOtherTabStub } from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.stub'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  PageTitle: PageTitleStub,
  SkillsViewOtherTab: SkillsViewOtherTabStub
}

BddTest().given('a student project skills view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectSkillsView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentProjectSkillsView, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Mes compétences')
      expect(pageTitle.props('trailingLinks')).toBeUndefined()
    })

    BddTest().then('it should render SkillsViewOtherTab', () => {
      const skillsViewOtherTab = wrapper.findComponent({ name: 'SkillsViewOtherTab' })

      expect(skillsViewOtherTab.exists()).toBe(true)
    })
  })
})
