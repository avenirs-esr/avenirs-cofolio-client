import type { PagedResponseDeclaredActivityViewDTO } from '@/api/avenir-esr'
import { mockedDeclaredActivitiesOverview } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createDeclaredActivitiesViewHandler, libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { MockHeadingLevel, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateActivitiesSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-activities-section'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('docx', () => ({
  Paragraph: vi.fn((options): MockParagraph => ({
    type: 'paragraph',
    ...options,
  })),
  TextRun: vi.fn((options): MockTextRun => ({
    type: 'text-run',
    ...(typeof options === 'string' ? { text: options } : options),
  })),

  HeadingLevel: MockHeadingLevel,
}))

BddTest().given('a useGenerateActivitiesSection composable', () => {
  let result: ReturnType<typeof useGenerateActivitiesSection>
  let requestedParams: URLSearchParams

  const mockedResponse: PagedResponseDeclaredActivityViewDTO = {
    data: mockedDeclaredActivitiesOverview,
    page: { pageSize: 100, totalElements: mockedDeclaredActivitiesOverview.length, totalPages: 1, page: 0 }
  }
  const mockedResponseEmpty: PagedResponseDeclaredActivityViewDTO = {
    data: [],
    page: { pageSize: 100, totalElements: 0, totalPages: 0, page: 0 }
  }

  const mountGenerateActivitiesSection = async () => {
    result = mountComposable(useGenerateActivitiesSection, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    server.use(
      createDeclaredActivitiesViewHandler(
        mockedResponse,
        (params) => {
          requestedParams = params
        }
      )
    )

    await mountGenerateActivitiesSection()
    await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should fetch valorized activities with a page size of 100', () => {
      expect(requestedParams.get('isValorized')).toBe('true')
      expect(requestedParams.get('pageSize')).toBe('100')
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('the request succeeds', () => {
    BddTest().then('it should generate a heading and a subsection for each activity', () => {
      const paragraphs = result.activitiesSection.value as unknown as MockParagraph[]
      expect(paragraphs).toHaveLength(1 + mockedDeclaredActivitiesOverview.length * 2)
      expect(paragraphs[0].heading).toBe(MockHeadingLevel.HEADING_1)
      mockedDeclaredActivitiesOverview.forEach((activity, index) => {
        expect((paragraphs[index * 2 + 1].children[0] as MockTextRun).text).toBe(activity.title)
      })
    })

    BddTest().then('it should include each activity thematic in the section', () => {
      const paragraphs = result.activitiesSection.value as unknown as MockParagraph[]
      const thematicParagraphs = paragraphs.filter((_, index) => index > 0 && index % 2 === 0)

      expect(thematicParagraphs).toHaveLength(mockedDeclaredActivitiesOverview.length)
      expect(thematicParagraphs.every(section =>
        (section.children[0] as MockTextRun).text.length > 0
      )).toBe(true)
    })
  })

  BddTest().when('the request returns an empty response', () => {
    beforeEach(async () => {
      server.use(createDeclaredActivitiesViewHandler(mockedResponseEmpty))

      await mountGenerateActivitiesSection()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.activitiesSection.value).toHaveLength(0)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(libraryActivitiesErrorHandler)

      await mountGenerateActivitiesSection()
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.activitiesSection.value).toHaveLength(0)
    })
  })
})
