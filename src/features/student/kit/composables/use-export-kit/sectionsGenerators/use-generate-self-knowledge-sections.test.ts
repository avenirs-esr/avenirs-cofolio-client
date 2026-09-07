import type { GetDeclaredProgramsParams } from '@/api/avenir-esr'
import { createMixedCategoriesResponse } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementsHandler, selfKnowledgeCategoryElementsErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { MockHeadingLevel, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateSelfKnowledgeSections } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-self-knowledge-sections'
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

BddTest().given('a useGenerateSelfKnowledgeSections composable', () => {
  let result: ReturnType<typeof useGenerateSelfKnowledgeSections>
  let requestedParams: GetDeclaredProgramsParams

  const allCategories = [
    ESelfKnowledgeCategory.STRENGTHS,
    ESelfKnowledgeCategory.VALUES,
    ESelfKnowledgeCategory.ASPIRATIONS,
    ESelfKnowledgeCategory.MOTIVATION,
    ESelfKnowledgeCategory.IMPROVEMENT,
    ESelfKnowledgeCategory.INTERESTS,
    ESelfKnowledgeCategory.INSPIRATIONS,
    ESelfKnowledgeCategory.OBLIGATIONS,
    ESelfKnowledgeCategory.TESTIMONIALS,
  ]

  const nonInterestsCategories = allCategories.filter(category => category !== ESelfKnowledgeCategory.INTERESTS)

  const mockedResponseOnlyInterests = createMixedCategoriesResponse([ESelfKnowledgeCategory.INTERESTS])

  const mockedResponseWithoutInterests = createMixedCategoriesResponse(nonInterestsCategories)

  const mockedResponseFull = createMixedCategoriesResponse(allCategories)

  const mockedResponseEmpty = createMixedCategoriesResponse([])

  const mountGenerateSelfKnowledgeSections = async () => {
    result = mountComposable(useGenerateSelfKnowledgeSections, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  BddTest().when('the composable is initialized', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(createSelfKnowledgeElementsHandler(mockedResponseFull, (params) => {
        requestedParams = params
      }))

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should fetch valorized programs with a page size of 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('the request succeeds with only interests', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(createSelfKnowledgeElementsHandler(mockedResponseOnlyInterests, (params) => {
        requestedParams = params
      }))

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should generate programs section', () => {
      expect(result.selfKnowledgeSections.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should only generate the interests section with its heading and its paragraph', () => {
      expect(result.selfKnowledgeSections.value.some(section =>
        (section as unknown as MockParagraph).heading === MockHeadingLevel.HEADING_1)).toBe(true)
      expect(result.selfKnowledgeSections.value.filter(section =>
        (section as unknown as MockParagraph).heading !== MockHeadingLevel.HEADING_1)).toHaveLength(1)
    })
  })

  BddTest().when('the request succeeds without interests', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(createSelfKnowledgeElementsHandler(mockedResponseWithoutInterests, (params) => {
        requestedParams = params
      }))

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should generate programs section', () => {
      expect(result.selfKnowledgeSections.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should not generate the interests section', () => {
      expect(result.selfKnowledgeSections.value.some(section =>
        (section as unknown as MockParagraph).heading === MockHeadingLevel.HEADING_1)).toBe(false)
    })

    BddTest().then('it should only generate one paragraph per category', () => {
      expect(result.selfKnowledgeSections.value).toHaveLength(nonInterestsCategories.length)
    })
  })

  BddTest().when('the request succeeds with all categories', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(createSelfKnowledgeElementsHandler(mockedResponseFull, (params) => {
        requestedParams = params
      }))

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should generate programs section', () => {
      expect(result.selfKnowledgeSections.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should generate the interests section with its heading', () => {
      expect(result.selfKnowledgeSections.value.some(section =>
        (section as unknown as MockParagraph).heading === MockHeadingLevel.HEADING_1)).toBe(true)
    })

    BddTest().then('it should generate one non heading paragraph per category', () => {
      expect(result.selfKnowledgeSections.value.filter(section =>
        (section as unknown as MockParagraph).heading !== MockHeadingLevel.HEADING_1)).toHaveLength(allCategories.length)
    })
  })

  BddTest().when('the request succeeds with an empty response', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(createSelfKnowledgeElementsHandler(mockedResponseEmpty, (params) => {
        requestedParams = params
      }))

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.selfKnowledgeSections.value).toHaveLength(0)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(selfKnowledgeCategoryElementsErrorHandler)

      await mountGenerateSelfKnowledgeSections()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.selfKnowledgeSections.value).toHaveLength(0)
    })
  })
})
