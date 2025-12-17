import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { SkillsViewTabsStub } from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.stub'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  PageTitle: PageTitleStub,
  SkillsViewTabs: SkillsViewTabsStub
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
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Toutes mes compétences')

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Toutes mes compétences'
      })
    })

    BddTest().then('it should render SkillsViewTabs', () => {
      const skillsViewTabs = wrapper.findComponent({ name: 'SkillsViewTabs' })

      expect(skillsViewTabs.exists()).toBe(true)
    })
  })
})
