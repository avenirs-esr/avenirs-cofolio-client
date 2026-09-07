import { getEmptyProfileHandler, getProfileErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { type MockExternalHyperlink, MockHeadingLevel, type MockImageRun, type MockParagraph, type MockTextRun } from '@/common/utils/docx/test-utils'
import { useGenerateProfileSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-profile-section'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { toValue } from 'vue'

vi.mock('docx', () => ({
  Paragraph: vi.fn((options): MockParagraph => ({
    type: 'paragraph',
    ...options,
  })),
  TextRun: vi.fn((options): MockTextRun => ({
    type: 'text-run',
    ...(typeof options === 'string' ? { text: options } : options),
  })),
  ImageRun: vi.fn((options): MockImageRun => ({
    type: 'image-run',
    ...options,
  })),
  ExternalHyperlink: vi.fn((options): MockExternalHyperlink => ({
    type: 'external-hyperlink',
    ...options,
  })),

  HeadingLevel: MockHeadingLevel,
}))

vi.mock('@/features/student/kit/composables/use-export-kit/utils/use-image-run-data.query', () => ({
  useImageRunDataQuery: vi.fn(options => ({
    data: computed(() => toValue(options.url)
      ? {
          data: new ArrayBuffer(0),
          transformation: {
            width: options.width,
            height: options.height,
          },
        }
      : undefined
    ),
  })),
}))

BddTest().given('a useGenerateProfileSection composable', () => {
  let result: ReturnType<typeof useGenerateProfileSection>

  const mountGenerateProfileSection = async () => {
    result = mountComposable(useGenerateProfileSection, { useTanstack: true, useI18n: true }).result
    await flushPromises()
  }

  BddTest().when('the composable is called and the student summary query succeeds', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      await mountGenerateProfileSection()
    })

    BddTest().then('it should generate a profile section', () => {
      expect(result).toBeDefined()
    })

    BddTest().then('it should not be loading once the request is completed', () => {
      expect(result.isLoading.value).toBe(false)
    })

    BddTest().then('it should generate a heading for the profile section', () => {
      const profileSectionHeading = (result.profileSection.value as unknown as MockParagraph[]).find(
        section => section.heading === MockHeadingLevel.HEADING_1
      )

      expect(profileSectionHeading).toBeDefined()
    })

    BddTest().then('it should generate an hyperlink for the profile section', () => {
      const profileSectionHyperlink = (result.profileSection.value as unknown as MockParagraph[]).find(
        section => section.children.some(child => 'type' in child && child.type === 'external-hyperlink')
      )

      expect(profileSectionHyperlink).toBeDefined()
    })

    BddTest().then('it should generate two image runs', () => {
      const imageRunsParagraph = (result.profileSection.value as unknown as MockParagraph[]).filter(
        section => section.children.some(child => 'type' in child && child.type === 'image-run')
      )

      expect(imageRunsParagraph).toHaveLength(2)

      const coverImageRun = imageRunsParagraph[0].children as MockImageRun[]
      const profileImageRun = imageRunsParagraph[1].children as MockImageRun[]
      expect(coverImageRun).toBeDefined()
      expect(profileImageRun).toBeDefined()
      expect(coverImageRun[0].floating).toBeUndefined()
      expect(profileImageRun[0].floating).toBeDefined()
    })
  })

  BddTest().when('the composable is called and the student summary query returns an empty profile', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(getEmptyProfileHandler)

      await mountGenerateProfileSection()
    })

    BddTest().then('it should not generate a profile section', () => {
      expect(result.profileSection.value).toEqual([])
    })
  })

  BddTest().when('the composable is called and the student summary query fails', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(getProfileErrorHandler)

      await mountGenerateProfileSection()
    })

    BddTest().then('it should not generate a profile section', () => {
      expect(result.profileSection.value).toEqual([])
    })
  })
})
