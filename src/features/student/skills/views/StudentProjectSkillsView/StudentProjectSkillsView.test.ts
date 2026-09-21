import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { AddDeclaredSkillDrawerStub } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/AddDeclaredSkillDrawer.stub'
import { SkillsViewOtherTabStub } from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.stub'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvButton: AvButtonStub,
  PageTitle: PageTitleStub,
  SkillsViewOtherTab: SkillsViewOtherTabStub,
  AddDeclaredSkillDrawer: AddDeclaredSkillDrawerStub,
}

BddTest().given('a student project skills view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectSkillsView>>

  const getAvButton = () => wrapper.findComponent(AvButtonStub)

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(StudentProjectSkillsView, {
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
      expect(wrapper.findComponent(SkillsViewOtherTabStub).exists()).toBe(true)
    })

    BddTest().then('it should render the add skill button', () => {
      expect(getAvButton().exists()).toBe(true)
    })

    BddTest().then('it should render the AddDeclaredSkillDrawer component', () => {
      expect(wrapper.findComponent(AddDeclaredSkillDrawerStub).exists()).toBe(true)
    })
  })
})
