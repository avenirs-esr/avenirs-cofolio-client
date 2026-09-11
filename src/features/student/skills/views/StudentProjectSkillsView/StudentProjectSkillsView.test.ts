import type { BreadcrumbLinkRaw } from '@/common/types'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { SkillsViewOtherTabStub } from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.stub'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

const stubs = {
  PageTitle: PageTitleStub,
  SkillsViewOtherTab: SkillsViewOtherTabStub
}

BddTest().given('a student project skills view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectSkillsView>>

  const route = reactive<{ name: string, meta: { breadcrumb: BreadcrumbLinkRaw[] } }>({
    name: ROUTES.STUDENT.PROJECT_SKILLS.name,
    meta: {
      breadcrumb: [
        META_BREADCRUMBS.STUDENT.HOME,
        META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
        META_BREADCRUMBS.STUDENT.PROJECT.SKILLS,
      ]
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseRoute.mockReturnValue(route as ReturnType<typeof useRoute>)

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

    BddTest().then('it should render SkillsViewOtherTab', () => {
      const skillsViewOtherTab = wrapper.findComponent({ name: 'SkillsViewOtherTab' })

      expect(skillsViewOtherTab.exists()).toBe(true)
    })
  })
})
