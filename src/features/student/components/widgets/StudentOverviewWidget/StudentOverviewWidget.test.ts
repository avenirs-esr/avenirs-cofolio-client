import type { BaseApiException } from '@/common/exceptions'
import type { StudentSummaryDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { useStudentSummaryQuery } from '@/features/student/queries'
import { mountWithRouter } from 'tests/utils'
import { capitalize, type Ref } from 'vue'
import StudentOverviewWidget from './StudentOverviewWidget.vue'

const navigateToStudentDeliverables = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentDeliverables,
  }),
}))

vi.mock('@/features/student/queries', () => ({
  useStudentSummaryQuery: vi.fn()
}))

const mockedUseStudentSummaryQuery = vi.mocked(useStudentSummaryQuery)

function mockUseStudentSummaryQuery (payload: StudentSummaryDTO) {
  const mockData: Ref<StudentSummaryDTO> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<StudentSummaryDTO, BaseApiException>
  mockedUseStudentSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentSummaryQueryUndefined () {
  const mockData: Ref<StudentSummaryDTO | undefined> = ref(undefined)
  mockedUseStudentSummaryQuery.mockReturnValue({
    data: mockData
  } as unknown as UseQueryDefinedReturnType<StudentSummaryDTO, BaseApiException>)
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
    const wrapper = await mountWithRouter(StudentOverviewWidget)
    expect(wrapper.text()).toContain(`${capitalize(studentSummary.firstname)} ${capitalize(studentSummary.lastname)}`)
  })

  it('should display the bio', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget)
    expect(wrapper.text()).toContain(studentSummary.bio)
  })

  it('should render 4 rich buttons', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget)
    expect(wrapper.findAllComponents({ name: 'AvRichButton' })).toHaveLength(4)
  })

  it('should show profile and cover images with correct src', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget)
    const images = wrapper.findAll('img')
    expect(images[0].attributes('src')).toBe(studentSummary.coverPicture)
    expect(images[1].attributes('src')).toBe(studentSummary.profilePicture)
  })

  it('should render nothing when studentSummary is undefined', async () => {
    mockUseStudentSummaryQueryUndefined()
    const wrapper = await mountWithRouter<typeof StudentOverviewWidget>(StudentOverviewWidget)
    expect(wrapper.find('*').exists()).toBe(false)
    expect(wrapper.vm.fullName).toBe(undefined)
  })

  it('should emit click on AvRichButtons', async () => {
    const wrapper = await mountWithRouter(StudentOverviewWidget)
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
})
