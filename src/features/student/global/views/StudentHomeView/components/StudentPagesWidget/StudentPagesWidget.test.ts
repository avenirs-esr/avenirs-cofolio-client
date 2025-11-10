import type { BaseApiException } from '@/common/exceptions'
import type { PageOverviewDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentPagesSummaryQuery } from '@/features/student/global/queries/use-student-summary.query/use-student-summary.query'
import StudentPagesWidget from '@/features/student/global/views/StudentHomeView/components/StudentPagesWidget/StudentPagesWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountWithRouter, testUseBaseApiExceptionToast } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentPages = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentPages,
    }),
  }
})

vi.mock('@/features/student/global/queries/use-student-summary.query/use-student-summary.query', () => ({
  useStudentPagesSummaryQuery: vi.fn()
}))

const mockedUseStudentPagesSummaryQuery = vi.mocked(useStudentPagesSummaryQuery)

function mockUseStudentPagesSummaryQuery (payload: PageOverviewDTO[]) {
  const mockData: Ref<PageOverviewDTO[]> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<PageOverviewDTO[], BaseApiException>
  mockedUseStudentPagesSummaryQuery.mockReturnValue(queryMockedData)
}

BddTest().given('a student pages widget', async () => {
  let wrapper: VueWrapper

  const pages = [
    { id: 'page1', name: 'analyse-ams-13-02-2024', updatedAt: '2025-02-22' },
    { id: 'page2', name: 'projetdevie-trajectoires', updatedAt: '2024-12-20' },
    { id: 'page3', name: 'Recherche-stage-SAP-3-avril202', updatedAt: '2024-10-04' },
    { id: 'page4', name: 'analyse-projet-de-vie', updatedAt: '2024-09-08' },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()
    mockUseStudentPagesSummaryQuery(pages)

    wrapper = await mountWithRouter(StudentPagesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should only display up to last 3 pages sorted by date', () => {
      const richButtons = wrapper.findAll('.av-rich-button')

      expect(richButtons).toHaveLength(3)
      expect(richButtons[0].text()).toContain(pages[0].name)
      expect(richButtons[0].text()).toContain(`dernière modification le ${formatDateToLocaleString(pages[0].updatedAt, 'fr')}`)
      expect(richButtons[1].text()).toContain(pages[1].name)
      expect(richButtons[1].text()).toContain(`dernière modification le ${formatDateToLocaleString(pages[1].updatedAt, 'fr')}`)
      expect(richButtons[2].text()).toContain(pages[2].name)
      expect(richButtons[2].text()).toContain(`dernière modification le ${formatDateToLocaleString(pages[2].updatedAt, 'fr')}`)
    })
  })

  BddTest().when('clicking on AvRichButtons', () => {
    BddTest().then('it should emit click event', async () => {
      const [page1Button, page2Button, page3Button] = wrapper.findAllComponents('.av-rich-button')

      expect(page1Button.exists()).toBe(true)
      expect(page2Button.exists()).toBe(true)
      expect(page3Button.exists()).toBe(true)

      await page1Button.trigger('click')
      await page2Button.trigger('click')
      await page3Button.trigger('click')
    })
  })

  BddTest().when('clicking on the navigation button', () => {
    BddTest().then('it should call navigation', async () => {
      const btn = wrapper.findComponent({ name: 'AvButton' })
      await btn.trigger('click')

      expect(navigateToStudentPages).toHaveBeenCalled()
    })
  })

  testUseBaseApiExceptionToast<PageOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentPagesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentPagesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
