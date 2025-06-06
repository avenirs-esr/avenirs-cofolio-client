import type { BaseApiException } from '@/common/exceptions'
import type { ResumeDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentResumesSummaryQuery } from '@/features/student/queries'
import { mountWithRouter } from 'tests/utils'
import StudentResumesWidget from './StudentResumesWidget.vue'

const navigateToStudentResumes = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentResumes,
  }),
}))

vi.mock('@/features/student/queries', () => ({
  useStudentResumesSummaryQuery: vi.fn()
}))

const mockedUseStudentResumesSummaryQuery = vi.mocked(useStudentResumesSummaryQuery)

function mockUseStudentResumesSummaryQuery (payload: ResumeDTO[]) {
  const mockData: Ref<ResumeDTO[]> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<ResumeDTO[], BaseApiException>
  mockedUseStudentResumesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentPagesWidget', () => {
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
    const wrapper = await mountWithRouter(StudentResumesWidget)
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
    const wrapper = await mountWithRouter(StudentResumesWidget)
    const [resume1Button, resume2Button, resume3Button] = wrapper.findAllComponents('.av-rich-button')

    expect(resume1Button.exists()).toBe(true)
    expect(resume2Button.exists()).toBe(true)
    expect(resume3Button.exists()).toBe(true)

    await resume1Button.trigger('click')
    await resume2Button.trigger('click')
    await resume3Button.trigger('click')
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentResumesWidget)
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentResumes).toHaveBeenCalled()
  })
})
