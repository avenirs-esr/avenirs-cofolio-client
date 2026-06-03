import { mockedSkillDetailed } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createDetailedSkillHandler, detailedSkillNotFoundErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ErrorMessageStub } from '@/common/components/feedback/ErrorMessage/ErrorMessage.stub'
import { ROUTES } from '@/common/constants'
import StudentSkillView from '@/features/student/skills/views/StudentSkillView/StudentSkillView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { useRoute } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

BddTest().given('a student skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillView>>
  let routeName: string

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    ErrorMessage: ErrorMessageStub,
    StudentSkillViewContainer: {
      name: 'StudentSkillViewContainer',
      props: ['skillDetailed'],
      template: '<div class="student-skill-view-container-stub" />'
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeName = ROUTES.STUDENT.EDUCATION_SKILL.name
    mockedUseRoute.mockReturnValue({
      get name () {
        return routeName
      }
    } as ReturnType<typeof useRoute>)
  })

  BddTest().when('the query succeeds', () => {
    beforeEach(() => {
      server.use(createDetailedSkillHandler(mockedSkillDetailed))

      wrapper = mountComponent(StudentSkillView, {
        props: { skillId: '1' },
        global: { stubs },
        useI18n: true,
      })
    })

    BddTest().then('it should render DetailedPageTitle with correct props', async () => {
      await flushPromises()

      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.props('title')).toBe('Réaliser un cahier des charges fonctionnels')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Réussir ma formation' },
        { text: 'Mes compétences', to: ROUTES.STUDENT.EDUCATION_SKILLS },
        { text: 'Réaliser un cahier des charges fonctionnels' },
      ])
    })

    BddTest().then('it should render StudentSkillViewContainer and not ErrorMessage', async () => {
      await flushPromises()

      expect(wrapper.find('.student-skill-view-container-stub').exists()).toBe(true)
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(false)

      const container = wrapper.findComponent({ name: 'StudentSkillViewContainer' })
      expect(container.props('skillDetailed')).toStrictEqual(mockedSkillDetailed)
    })
  })

  BddTest().when('the query succeeds on project skill route', () => {
    beforeEach(() => {
      routeName = ROUTES.STUDENT.PROJECT_SKILL.name
      server.use(createDetailedSkillHandler(mockedSkillDetailed))

      wrapper = mountComponent(StudentSkillView, {
        props: { skillId: '1' },
        global: { stubs },
        useI18n: true,
      })
    })

    BddTest().then('it should render project breadcrumb links', async () => {
      await flushPromises()

      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Construire mon projet de vie' },
        { text: 'Toutes mes compétences', to: ROUTES.STUDENT.PROJECT_SKILLS },
        { text: 'Compétence Réaliser un cahier des charges fonctionnels' },
      ])
    })
  })

  BddTest().when('the query succeeds on default skill route', () => {
    beforeEach(() => {
      routeName = ROUTES.STUDENT.SKILL.name
      server.use(createDetailedSkillHandler(mockedSkillDetailed))

      wrapper = mountComponent(StudentSkillView, {
        props: { skillId: '1' },
        global: { stubs },
        useI18n: true,
      })
    })

    BddTest().then('it should render home breadcrumb links', async () => {
      await flushPromises()

      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Compétence Réaliser un cahier des charges fonctionnels' },
      ])
    })
  })

  BddTest().when('the query fails with SKILL_NOT_FOUND', () => {
    beforeEach(() => {
      server.use(detailedSkillNotFoundErrorHandler)

      wrapper = mountComponent(StudentSkillView, {
        props: { skillId: 'skill-404' },
        global: { stubs },
        useI18n: true,
      })
    })

    BddTest().then('it should render ErrorMessage and not StudentSkillViewContainer', async () => {
      await flushPromises()

      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
      expect(wrapper.find('.student-skill-view-container-stub').exists()).toBe(false)

      const notFound = wrapper.findComponent({ name: 'ErrorMessage' })
      expect(notFound.props('title')).toBe('Compétence introuvable')
      expect(notFound.props('description')).toBe('La compétence que vous recherchez n\'existe pas ou n\'est pas accessible.')
    })

    BddTest().then('it should render DetailedPageTitle with empty title', async () => {
      await flushPromises()

      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.props('title')).toBe('')
    })
  })
})
