import type { GetDeclaredProgramsParams } from '@/api/avenir-esr'
import { mockedDeclaredPrograms, mockedDeclaredProgramsWithoutStartDate } from '@/__mocks__/fixtures/student'
import { createDeclaredProgramsViewHandler, declaredProgramsQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { MockHeadingLevel, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateProgramsSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-programs-section'
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

BddTest().given('a useGenerateProgramsSection composable', () => {
  let result: ReturnType<typeof useGenerateProgramsSection>
  let requestedParams: GetDeclaredProgramsParams

  const mockedResponse = {
    data: mockedDeclaredPrograms,
    page: {
      page: 0,
      pageSize: 300,
      totalElements: mockedDeclaredPrograms.length,
      totalPages: 1
    }
  }

  const mockedResponseWithoutStartDate = {
    data: mockedDeclaredProgramsWithoutStartDate,
    page: {
      page: 0,
      pageSize: 300,
      totalElements: mockedDeclaredProgramsWithoutStartDate.length,
      totalPages: 1
    }
  }

  const mountGenerateProgramsSection = async () => {
    result = mountComposable(useGenerateProgramsSection, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    server.use(
      createDeclaredProgramsViewHandler(
        mockedResponse,
        (params) => {
          requestedParams = params
        }
      )
    )

    await mountGenerateProgramsSection()
    await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should fetch valorized programs with a page size of 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('the request succeeds', () => {
    BddTest().then('it should generate programs section', () => {
      expect(result.programsSection.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should generate programs with dates', () => {
      expect(result.programsSection.value.some(section =>
        (section as unknown as MockParagraph).heading === undefined)).toBe(true)
    })
  })

  BddTest().when('the request succeeds without start date', () => {
    beforeEach(async () => {
      server.use(
        createDeclaredProgramsViewHandler(
          mockedResponseWithoutStartDate,
          (params) => {
            requestedParams = params
          }
        )
      )

      await mountGenerateProgramsSection()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should generate programs section', () => {
      expect(result.programsSection.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should generate programs without dates', () => {
      expect(result.programsSection.value.some(section =>
        (section as unknown as MockParagraph).heading === undefined)).toBe(false)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(declaredProgramsQueryErrorHandler)

      await mountGenerateProgramsSection()
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.programsSection.value).toHaveLength(0)
    })
  })
})
