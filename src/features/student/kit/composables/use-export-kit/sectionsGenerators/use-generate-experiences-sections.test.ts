import type { GetDeclaredExperienceViewParams } from '@/api/avenir-esr'
import type { Paragraph } from 'docx'
import { createMockedDeclaredExperiences, mockedDeclaredExperiences } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import {
  createDeclaredExperienceViewHandler,
  declaredExperiencesQueryErrorHandler
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { MockHeadingLevel, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateExperiencesSections } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-experiences-sections'
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

BddTest().given('a useGenerateExperiencesSections composable', () => {
  let result: ReturnType<typeof useGenerateExperiencesSections>
  let requestedParams: GetDeclaredExperienceViewParams

  const mockedResponse = {
    data: mockedDeclaredExperiences,
    page: {
      page: 0,
      pageSize: 300,
      totalElements: mockedDeclaredExperiences.length,
      totalPages: 1
    }
  }

  const mockedResponseWithoutDescription = {
    data: createMockedDeclaredExperiences(60, true),
    page: {
      page: 0,
      pageSize: 300,
      totalElements: mockedDeclaredExperiences.length,
      totalPages: 1
    }
  }

  const mountGenerateExperiencesSections = async () => {
    result = mountComposable(useGenerateExperiencesSections, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    server.use(
      createDeclaredExperienceViewHandler(
        mockedResponse,
        (params) => {
          requestedParams = params
        }
      )
    )

    await mountGenerateExperiencesSections()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should fetch valorized experiences with a page size of 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('the request succeeds', () => {
    BddTest().then('it should generate experiences sections', () => {
      expect(result.experiencesSections.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should generate professional experiences sections before other experiences', () => {
      const professionalExperiencesSection = (result.experiencesSections.value as unknown as MockParagraph[]).find(
        section => section.heading === MockHeadingLevel.HEADING_1
          && 'text' in section.children[0] && section.children[0].text === 'EXPÉRIENCES PROFESSIONNELLES'
      )

      const otherExperiencesSection = (result.experiencesSections.value as unknown as MockParagraph[]).find(
        section => section.heading === MockHeadingLevel.HEADING_1
          && 'text' in section.children[0] && section.children[0].text === 'AUTRES EXPÉRIENCES'
      )

      expect(professionalExperiencesSection).toBeDefined()
      expect(otherExperiencesSection).toBeDefined()

      expect(result.experiencesSections.value.indexOf(professionalExperiencesSection as unknown as Paragraph)).toBeLessThan(
        result.experiencesSections.value.indexOf(otherExperiencesSection as unknown as Paragraph)
      )
    })

    BddTest().then('it should generate experiences sections with descriptions', () => {
      const experiencesSections = result.experiencesSections.value

      expect(experiencesSections.length).toBeGreaterThan(0)

      const firstExperienceParagraph = (experiencesSections as unknown as MockParagraph[]).find(
        section => section.heading === MockHeadingLevel.HEADING_2
      )
      const firstExperienceParagraphIndex = experiencesSections.indexOf(firstExperienceParagraph as unknown as Paragraph)

      expect((experiencesSections as unknown as MockParagraph[])[firstExperienceParagraphIndex + 2].heading).toBeUndefined()
    })
  })

  BddTest().when('there are declared experiences without descriptions', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(
        createDeclaredExperienceViewHandler(mockedResponseWithoutDescription)
      )

      await mountGenerateExperiencesSections()
    })

    BddTest().then('it should generate experiences sections without descriptions', () => {
      const experiencesSections = result.experiencesSections.value

      expect(experiencesSections.length).toBeGreaterThan(0)

      const firstExperienceParagraph = (experiencesSections as unknown as MockParagraph[]).find(
        section => section.heading === MockHeadingLevel.HEADING_2
      )
      const firstExperienceParagraphIndex = experiencesSections.indexOf(firstExperienceParagraph as unknown as Paragraph)

      expect((experiencesSections as unknown as MockParagraph[])[firstExperienceParagraphIndex + 2].heading).toBeDefined()
    })
  })

  BddTest().when('there are no declared experiences', () => {
    beforeEach(async () => {
      server.use(
        createDeclaredExperienceViewHandler({
          data: [],
          page: {
            page: 0,
            pageSize: 100,
            totalElements: 0,
            totalPages: 0
          }
        })
      )

      await mountGenerateExperiencesSections()
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.experiencesSections.value).toHaveLength(0)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)

      await mountGenerateExperiencesSections()
    })

    BddTest().then('it should remain available while the query is in error', () => {
      expect(result.experiencesSections.value).toEqual([])
    })
  })

  BddTest().when('the request is fetching', () => {
    BddTest().then('it should expose the query fetching state', () => {
      expect(result.isLoading.value).toBeDefined()
    })
  })
})
