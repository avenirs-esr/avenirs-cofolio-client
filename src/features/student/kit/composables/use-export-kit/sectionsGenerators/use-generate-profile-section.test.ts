import type { MockImageRun, MockParagraph } from '@/common/utils/docx/test-utils'
import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import { mockedEmptyProfileOverview, mockedProfileOverview } from '@/__mocks__/fixtures/student'
import {
  createExternalHyperlinkMock,
  createImageRunMock,
  createParagraphMock,
  createTextRunMock,
  MockHeadingLevel

} from '@/common/utils/docx/test-utils'
import { INVALID_PROFILE } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'
import { useGenerateProfileSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-profile-section'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { toValue } from 'vue'

const mockProfile = ref<ProfileOverviewDTO>(mockedProfileOverview)
const mockIsProfileLoading = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: mockProfile,
    isProfileLoading: mockIsProfileLoading
  })
}))

vi.mock('docx', () => ({
  Paragraph: vi.fn(createParagraphMock),
  TextRun: vi.fn(createTextRunMock),
  ImageRun: vi.fn(createImageRunMock),
  ExternalHyperlink: vi.fn(createExternalHyperlinkMock),
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

  const mountWith = ({
    profile = mockedProfileOverview,
    isProfileLoading = false
  }: {
    profile?: ProfileOverviewDTO
    isProfileLoading?: boolean
  } = {}) => {
    vi.clearAllMocks()
    mockProfile.value = profile
    mockIsProfileLoading.value = isProfileLoading

    result = mountComposable(useGenerateProfileSection, { useI18n: true }).result
  }

  const getParagraphs = () => result.profileSection.value as unknown as MockParagraph[]
  const getHeadingParagraph = () => getParagraphs().find(
    paragraph => paragraph.heading === MockHeadingLevel.HEADING_1
  )
  const getHyperlinkParagraph = () => getParagraphs().find(
    paragraph => paragraph.children.some(child => 'type' in child && child.type === 'external-hyperlink')
  )
  const getImageRunParagraphs = () => getParagraphs().filter(
    paragraph => paragraph.children.some(child => 'type' in child && child.type === 'image-run')
  )

  BddTest().when('the composable is called and the profile is loaded', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should generate a profile section', () => {
      expect(result).toBeDefined()
    })

    BddTest().then('it should not be loading', () => {
      expect(result.isLoading.value).toBe(false)
    })

    BddTest().then('it should generate a heading for the profile section', () => {
      expect(getHeadingParagraph()).toBeDefined()
    })

    BddTest().then('it should generate an hyperlink for the profile section', () => {
      expect(getHyperlinkParagraph()).toBeDefined()
    })

    BddTest().then('it should generate two image runs', () => {
      const imageRunsParagraph = getImageRunParagraphs()

      expect(imageRunsParagraph).toHaveLength(2)

      const coverImageRun = imageRunsParagraph[0].children as MockImageRun[]
      const profileImageRun = imageRunsParagraph[1].children as MockImageRun[]
      expect(coverImageRun).toBeDefined()
      expect(profileImageRun).toBeDefined()
      expect(coverImageRun[0].floating).toBeUndefined()
      expect(profileImageRun[0].floating).toBeDefined()
    })
  })

  BddTest().when('the composable is called while the profile is still loading', () => {
    beforeEach(() => {
      mountWith({ profile: INVALID_PROFILE, isProfileLoading: true })
    })

    BddTest().then('it should be loading', () => {
      expect(result.isLoading.value).toBe(true)
    })
  })

  BddTest().when('the composable is called and the profile is empty', () => {
    beforeEach(() => {
      mountWith({ profile: mockedEmptyProfileOverview })
    })

    BddTest().then('it should not generate a profile section', () => {
      expect(result.profileSection.value).toEqual([])
    })
  })

  BddTest().when('the composable is called and the profile request fails', () => {
    beforeEach(() => {
      mountWith({ profile: INVALID_PROFILE })
    })

    BddTest().then('it should not generate a profile section', () => {
      expect(result.profileSection.value).toEqual([])
    })
  })
})
