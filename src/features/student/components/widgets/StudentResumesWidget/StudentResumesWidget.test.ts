import type { BaseApiException } from '@/common/exceptions'
import type { ResumeOverviewDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { formatDateToLocaleString } from '@/common/utils'
import StudentResumesWidget from '@/features/student/components/widgets/StudentResumesWidget/StudentResumesWidget.vue'
import { useStudentResumesSummaryQuery } from '@/features/student/queries'
import { mountWithRouter } from '@/ui/tests/utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { testUseBaseApiExceptionToast } from 'tests/utils'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentResumes = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentResumes,
    }),
  }
})

vi.mock('@/features/student/queries', () => ({
  useStudentResumesSummaryQuery: vi.fn()
}))

const mockedUseStudentResumesSummaryQuery = vi.mocked(useStudentResumesSummaryQuery)

function mockUseStudentResumesSummaryQuery (payload: ResumeOverviewDTO[]) {
  const mockData: Ref<ResumeOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError,
  } as unknown as UseQueryDefinedReturnType<ResumeOverviewDTO[], BaseApiException>
  mockedUseStudentResumesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentResumesWidget', () => {
  const resumes = [
    { id: 'resume1', name: 'cv-version1-05-2024', updatedAt: '2025-05-19T00:00:00.000Z' },
    { id: 'resume2', name: 'cv-version1-04-2024', updatedAt: '2025-04-25T00:00:00.000Z' },
    { id: 'resume3', name: 'cv-version1-03-2024-with-a-very-long-name', updatedAt: '2025-03-03T00:00:00.000Z' },
    { id: 'resume4', name: 'cv-version1-02-2024', updatedAt: '2025-02-08T00:00:00.000Z' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentResumesSummaryQuery(resumes)
  })

  it('should only display up to last 3 resumes sorted by date', async () => {
    const wrapper = await mountWithRouter(StudentResumesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const richButtons = wrapper.findAll('.av-rich-button')

    expect(richButtons).toHaveLength(3)
    expect(richButtons[0].text()).toContain(resumes[0].name)
    expect(richButtons[0].text()).toContain(`dernière modification le ${formatDateToLocaleString(resumes[0].updatedAt, 'fr')}`)
    expect(richButtons[1].text()).toContain(resumes[1].name)
    expect(richButtons[1].text()).toContain(`dernière modification le ${formatDateToLocaleString(resumes[1].updatedAt, 'fr')}`)
    expect(richButtons[2].text()).toContain(resumes[2].name)
    expect(richButtons[2].text()).toContain(`dernière modification le ${formatDateToLocaleString(resumes[2].updatedAt, 'fr')}`)
  })

  it('should emit click on AvRichButtons', async () => {
    const wrapper = await mountWithRouter(StudentResumesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const [resume1Button, resume2Button, resume3Button] = wrapper.findAllComponents('.av-rich-button')

    expect(resume1Button.exists()).toBe(true)
    expect(resume2Button.exists()).toBe(true)
    expect(resume3Button.exists()).toBe(true)

    await resume1Button.trigger('click')
    await resume2Button.trigger('click')
    await resume3Button.trigger('click')
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentResumesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentResumes).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<ResumeOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentResumesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentResumesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
