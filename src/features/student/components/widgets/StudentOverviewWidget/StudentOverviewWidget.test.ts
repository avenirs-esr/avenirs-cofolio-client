import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { BaseApiException } from '@/common/exceptions'
import StudentOverviewWidget from '@/features/student/components/widgets/StudentOverviewWidget/StudentOverviewWidget.vue'
import { useStudentSummaryQuery } from '@/features/student/queries'
import { mountWithRouter } from '@/ui/tests/utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { testUseBaseApiExceptionToast } from 'tests/utils'
import { capitalize, type Ref } from 'vue'

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

vi.mock('@/features/student/queries', () => ({
  useStudentSummaryQuery: vi.fn()
}))

const mockedUseStudentSummaryQuery = vi.mocked(useStudentSummaryQuery)

function mockUseStudentSummaryQuery (payload: ProfileOverviewDTO) {
  const mockData: Ref<ProfileOverviewDTO> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>
  mockedUseStudentSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentSummaryQueryUndefined () {
  const mockData: Ref<ProfileOverviewDTO | undefined> = ref(undefined)
  mockedUseStudentSummaryQuery.mockReturnValue({
    data: mockData,
    error: toRef(new BaseApiException('Student summary not found'))
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>)
}

describe('studentOverviewWidget', () => {
  const studentSummary = {
    id: '123456789',
    firstname: 'Jeanne',
    lastname: 'Moulin',
    profilePicture: profile_picture_placeholder,
    coverPicture: profile_banner_placeholder,
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète. Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentSummaryQuery(studentSummary)
  })

  it('should render the full name capitalized', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.text()).toContain(`${capitalize(studentSummary.firstname)} ${capitalize(studentSummary.lastname)}`)
  })

  it('should display the bio', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.text()).toContain(studentSummary.bio)
  })

  it('should render 4 rich buttons', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.findAllComponents({ name: 'AvRichButton' })).toHaveLength(4)
  })

  it('should show profile and cover images with correct src', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const images = wrapper.findAll('img')
    expect(images[0].attributes('src')).toBe(studentSummary.coverPicture)
    expect(images[1].attributes('src')).toBe(studentSummary.profilePicture)
  })

  it('should render nothing when studentSummary is undefined', async () => {
    mockUseStudentSummaryQueryUndefined()
    const wrapper = await mountWithRouter<typeof StudentOverviewWidget>(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('*').exists()).toBe(false)
    expect(wrapper.vm.fullName).toBe(undefined)
  })

  it('should emit click on AvRichButtons', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
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

  testUseBaseApiExceptionToast<ProfileOverviewDTO>({
    mockedUseQuery: mockedUseStudentSummaryQuery,
    payload: studentSummary,
    mountComponent: () => mountWithRouter(StudentOverviewWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
