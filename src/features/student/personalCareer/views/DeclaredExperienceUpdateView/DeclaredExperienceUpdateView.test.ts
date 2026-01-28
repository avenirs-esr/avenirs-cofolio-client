import type { VueWrapper } from '@vue/test-utils'
import { type DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants/route-names'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import UpdateDeclaredExperienceForm from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/UpdateDeclaredExperienceForm.vue'
import DeclaredExperienceUpdateView
, { type DeclaredExperienceUpdateViewProps } from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockRouteId = ref<string>('exp123')
const routerPush = vi.fn()

const declaredExperience: DeclaredExperienceViewDTO = {
  id: 'declared-experience-123-456-789',
  title: 'Développeur Web Full Stack',
  experienceType: EExperienceType.PROFESSIONAL,
  organization: 'Tech Startup Paris',
  activitySector: 'Technologie de l\'information',
  location: 'Paris, France',
  description: 'Développement d\'applications web avec Vue.js et Node.js',
  sourceOfInformation: 'LinkedIn',
  summary: 'Expérience enrichissante en startup',
  externalLink: 'https://www.techstartup.fr',
  startDate: '2023-01',
  endDate: '2024-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () { return mockRouteId.value }
      }
    }),
    useRouter: () => ({
      push: routerPush
    })
  }
})

vi.mock('@/features/student/personalCareer/queries/use-declared-experiences.query', () => {
  return {
    useDeclaredExperiencesViewQuery: vi.fn(() => ({
      declaredExperiences: ref([declaredExperience]),
      pageInfo: ref({ page: 0, pageSize: 12, totalElements: 1 }),
      isFetching: ref(false),
      data: ref(null),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn()
    })),

    useDeclaredExperienceDetailedViewQuery: vi.fn(() => ({
      declaredExperience: ref(declaredExperience),

      data: ref(declaredExperience),
      isLoading: ref(false)
    })),

    useCreateDeclaredExperienceMutation: vi.fn(() => ({ mutate: vi.fn() })),
    useGetCachedDeclaredExperiences: vi.fn(() => ({ getCachedDeclaredExperiences: vi.fn() })),
    useDeleteDeclaredExperienceMutation: vi.fn(() => ({ mutate: vi.fn() })),
    useUpdateDeclaredExperienceMutation: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

const UpdateDeclaredExperienceFormStub = {
  name: 'UpdateDeclaredExperienceForm',
  props: [
    'declaredExperience',
    'onExperienceUpdated',
    'onCancel'
  ],
  emits: ['dirtyChange', 'cancel', 'experience-updated'],
  template: '<div data-testid="update-declared-experience-form-stub"></div>'
}
const stubs = {
  AvIconText: AvIconTextStub,
  PageTitle: PageTitleStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub,
  UpdateDeclaredExperienceForm: UpdateDeclaredExperienceFormStub,
  AvTabs: { template: '<div><slot /></div>' },
  AvTab: { template: '<div><slot /></div>' }
}

BddTest().given('a declared experience update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceUpdateView>>
  const props: DeclaredExperienceUpdateViewProps = {
    experienceId: 'exp-123'
  }

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceUpdateView, {
      props,
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render PageTitle', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().and('the cancel event is emitted from the form', () => {
      beforeEach(async () => {
        const formComponent = wrapper.findComponent(UpdateDeclaredExperienceForm)

        if (!formComponent.exists()) {
          console.error(wrapper.html())
          throw new Error('UpdateDeclaredExperienceForm not found in DOM')
        }

        await formComponent.vm.$emit('cancel')
      })

      BddTest().then('it should navigate to the declared experience detail view', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
          params: { id: mockRouteId.value }
        })
      })
    })
  })
})
