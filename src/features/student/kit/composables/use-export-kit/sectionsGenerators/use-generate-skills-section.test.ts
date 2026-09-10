import type { GetDeclaredProgramsParams } from '@/api/avenir-esr'
import { createMockedPagedResponseDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createDeclaredSkillsProgressViewHandler, declaredSkillsProgressViewErrorHandler, skillConfigErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { MockHeadingLevel, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateSkillsSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-skills-section'
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

BddTest().given('a useGenerateSkillsSection composable', () => {
  let result: ReturnType<typeof useGenerateSkillsSection>
  let requestedParams: GetDeclaredProgramsParams

  const mockedResponse = createMockedPagedResponseDeclaredSkillProgressDTO(100, 100, 0)
  const mockedResponseEmpty = createMockedPagedResponseDeclaredSkillProgressDTO(0, 100, 0)

  const mountGenerateSkillsSection = async () => {
    result = mountComposable(useGenerateSkillsSection, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    server.use(
      createDeclaredSkillsProgressViewHandler(
        mockedResponse,
        (params) => {
          requestedParams = params
        }
      )
    )

    await mountGenerateSkillsSection()
    await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should fetch valorized skills with a page size of 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('the request succeeds', () => {
    BddTest().then('it should generate skills section', () => {
      expect(result.skillsSection.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should generate skills with levels', () => {
      expect(result.skillsSection.value.some(section =>
        (section as unknown as MockParagraph).heading === undefined)).toBe(true)
    })

    BddTest().then('it should generate at least one skill with a level', () => {
      expect(result.skillsSection.value.some(section =>
        (section as unknown as MockParagraph).children.filter(child =>
          (child as unknown as MockTextRun).text.includes('Niveau\u00A0:')
        ).length > 0
      )).toBe(true)
    })
  })

  BddTest().when('the skill config request fails', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(
        createDeclaredSkillsProgressViewHandler(
          mockedResponse,
          (params) => {
            requestedParams = params
          }
        )
      )
      server.use(skillConfigErrorHandler)

      await mountGenerateSkillsSection()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should not generate any skills with a level', () => {
      expect(result.skillsSection.value.some(section =>
        (section as unknown as MockParagraph).children.filter(child =>
          (child as unknown as MockTextRun).text.includes('Niveau\u00A0:')
        ).length === 0
      )).toBe(true)
    })
  })

  BddTest().when('the request returns an empty response', () => {
    beforeEach(async () => {
      server.use(
        createDeclaredSkillsProgressViewHandler(
          mockedResponseEmpty,
          (params) => {
            requestedParams = params
          }
        )
      )

      await mountGenerateSkillsSection()
      await vi.waitFor(() => expect(result.isLoading.value).toBe(false))
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.skillsSection.value).toHaveLength(0)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(declaredSkillsProgressViewErrorHandler)

      await mountGenerateSkillsSection()
    })

    BddTest().then('it should not generate any sections', () => {
      expect(result.skillsSection.value).toHaveLength(0)
    })
  })
})
