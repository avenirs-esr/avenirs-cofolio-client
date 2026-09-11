import type { BreadcrumbLinkRaw } from '@/common/types'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { PersonalCareerLayoutStub } from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.stub'
import PersonalCareerView from '@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const route = reactive<{ name: string, meta: { breadcrumb: BreadcrumbLinkRaw[] } }>({
  name: ROUTES.STUDENT.PERSONAL_CAREER.name,
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
    ],
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

const stubs = {
  PageTitle: PageTitleStub,
  PersonalCareerLayout: PersonalCareerLayoutStub
}

BddTest().given('a student project experiences view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalCareerView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(PersonalCareerView, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Mon parcours')

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mon parcours'
      })
    })

    BddTest().then('it should render PersonalCareerLayout component', () => {
      const container = wrapper.findComponent({ name: 'PersonalCareerLayout' })

      expect(container.exists()).toBe(true)
    })
  })
})
