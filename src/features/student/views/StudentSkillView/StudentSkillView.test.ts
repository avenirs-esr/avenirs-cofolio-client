import { mockedSkillDetailed } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createSkillDetailedHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentEducationSkillsRoute, studentHomeRoute } from '@/features/student/routes'
import StudentSkillView from '@/features/student/views/StudentSkillView/StudentSkillView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'

BddTest().given('a student skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillView>>

  const stubs = {
    PageTitle: PageTitleStub,
    StudentSkillViewContainer: {
      name: 'StudentSkillViewContainer',
      props: ['skillDetailed'],
      template: '<div class="student-skill-view-container-stub" />'
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    const handler = createSkillDetailedHandler(mockedSkillDetailed)
    server.use(handler)
    wrapper = mountComponent(StudentSkillView, {
      props: { skillId: 'skill-1-1' },
      global: { stubs },
      useTanstack: true,
      usePinia: true
    })
  })

  const title = `Compétence ${mockedSkillDetailed.name}`
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const skillsBreadcrumbLink = { text: 'Mes compétences', to: studentEducationSkillsRoute }
  const currentBreadcrumbLink = { text: mockedSkillDetailed.name }

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', async () => {
      await flushPromises()
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        skillsBreadcrumbLink,
        currentBreadcrumbLink
      ])
    })

    BddTest().then('it should render StudentSkillViewContainer with correct props', async () => {
      await flushPromises()
      const skillViewContainer = wrapper.findComponent({ name: 'StudentSkillViewContainer' })

      expect(skillViewContainer.exists()).toBe(true)
      expect(skillViewContainer.props('skillDetailed')).toStrictEqual(mockedSkillDetailed)
    })
  })
})
