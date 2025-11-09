import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { BaseApiException } from '@/common/exceptions'
import { useStudentSummaryQuery } from '@/features/student/global/queries/use-student-summary.query/use-student-summary.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import StudentOverviewWidget from 'src/features/student/global/views/StudentHomeView/components/StudentOverviewWidget/StudentOverviewWidget.vue'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountWithRouter, testUseBaseApiExceptionToast } from 'tests/utils'
import { capitalize, nextTick, type Ref } from 'vue'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentDeliverables = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentDeliverables,
    }),
  }
})

vi.mock('@/features/student/global/queries/use-student-summary.query/use-student-summary.query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/global/queries/use-student-summary.query/use-student-summary.query')>()
  return {
    ...actual,
    useStudentSummaryQuery: vi.fn(),
  }
})

const mockedUseStudentSummaryQuery = vi.mocked(useStudentSummaryQuery)

function mockUseStudentSummaryQuery (payload: ProfileOverviewDTO) {
  const mockData: Ref<ProfileOverviewDTO> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const refetch = vi.fn().mockResolvedValue(undefined)
  const queryMockedData = {
    data: mockData,
    error: mockError,
    refetch,
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>
  mockedUseStudentSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentSummaryQueryUndefined () {
  const mockData: Ref<ProfileOverviewDTO | undefined> = ref(undefined)
  const refetch = vi.fn().mockResolvedValue(undefined)
  mockedUseStudentSummaryQuery.mockReturnValue({
    data: mockData,
    error: toRef(new BaseApiException('Student summary not found')),
    refetch,
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>)
}

BddTest().given('a student overview widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentOverviewWidget>>

  let queryClient: QueryClient

  const stubs = {
    UpdateProfileDrawer: {
      name: 'UpdateProfileDrawer',
      props: ['show'],
      template: '<div class="update-profile-drawer" />'
    }
  }

  const studentSummary = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    email: 'j.moulin@example.com',
    profilePicture: {
      id: null,
      name: null,
      url: profile_picture_placeholder,
    },
    coverPicture: {
      id: null,
      name: null,
      url: profile_banner_placeholder,
    },
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      queryClient = new QueryClient()
      mockUseStudentSummaryQuery(studentSummary)
      wrapper = await mountWithRouter<typeof StudentOverviewWidget>(StudentOverviewWidget, {
        global: {
          stubs,
          plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
        },
      })
    })

    BddTest().then('it should render the full name capitalized', async () => {
      expect(wrapper.text()).toContain(`${capitalize(studentSummary.firstname)} ${capitalize(studentSummary.lastname)}`)
    })

    BddTest().then('it should display the bio', async () => {
      expect(wrapper.text()).toContain(studentSummary.bio)
    })

    BddTest().then('it should render 4 rich buttons', async () => {
      expect(wrapper.findAllComponents({ name: 'AvRichButton' })).toHaveLength(4)
    })

    BddTest().then('it should show profile and cover images with correct src', async () => {
      const images = wrapper.findAll('img')
      expect(images[0].attributes('src')).toBe(studentSummary.coverPicture.url)
      expect(images[1].attributes('src')).toBe(studentSummary.profilePicture.url)
    })

    BddTest().then('it should emit click on AvRichButtons', async () => {
      const editProfileButton = wrapper.findComponent('.av-rich-button--edit-profile')
      const shareResumeButton = wrapper.findComponent('.av-rich-button--share-resume')
      const shareCofolio = wrapper.findComponent('.av-rich-button--share-cofolio')
      const establishmentsButton = wrapper.findComponent('.av-rich-button--establishments')

      expect(editProfileButton.exists()).toBe(true)
      expect(shareResumeButton.exists()).toBe(true)
      expect(shareCofolio.exists()).toBe(true)
      expect(establishmentsButton.exists()).toBe(true)

      await editProfileButton.trigger('click')
      await shareResumeButton.trigger('click')
      await shareCofolio.trigger('click')
      await establishmentsButton.trigger('click')
    })

    BddTest().then('it should render UpdateProfileDrawer in hidden state', () => {
      const updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(false)
    })
  })

  BddTest().when('clicking on the edit profile button', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      queryClient = new QueryClient()
      mockUseStudentSummaryQuery(studentSummary)
      wrapper = await mountWithRouter<typeof StudentOverviewWidget>(StudentOverviewWidget, {
        global: {
          stubs,
          plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
        },
      })
    })

    BddTest().then('it should show UpdateProfileDrawer', async () => {
      let updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(false)

      const editProfileButton = wrapper.findComponent('.av-rich-button--edit-profile')
      expect(editProfileButton.exists()).toBe(true)
      await editProfileButton.trigger('click')
      await nextTick()

      updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(true)
    })
  })

  BddTest().when('the component is mounted when studentSummary is undefined', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      queryClient = new QueryClient()
      mockUseStudentSummaryQueryUndefined()
      wrapper = await mountWithRouter<typeof StudentOverviewWidget>(StudentOverviewWidget, {
        global: {
          stubs,
          plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
        },
      })
    })

    BddTest().then('it should render nothing', async () => {
      expect(wrapper.find('*').exists()).toBe(false)
      expect(wrapper.vm.fullName).toBe(undefined)
    })
  })

  testUseBaseApiExceptionToast<ProfileOverviewDTO>({
    mockedUseQuery: mockedUseStudentSummaryQuery,
    payload: studentSummary,
    mountComponent: () => mountWithRouter(StudentOverviewWidget, {
      global: {
        stubs,
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
      },
    })
  })
})
