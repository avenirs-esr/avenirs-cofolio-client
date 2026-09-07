import { downloadBlob } from '@/common/utils/download/download'
import { useGenerateExperiencesSections } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-experiences-sections'
import { useGenerateProfileSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-profile-section'
import { useGenerateProgramsSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-programs-section'
import { useGenerateSelfKnowledgeSections } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-self-knowledge-sections'
import { useGenerateSkillsSection } from '@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-skills-section'
import { useExportKit } from '@/features/student/kit/composables/use-export-kit/use-export-kit'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { Document, Packer, Paragraph } from 'docx'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/utils/download/download', () => ({
  downloadBlob: vi.fn(),
}))

vi.mock('@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-profile-section', () => ({
  useGenerateProfileSection: vi.fn(),
}))

vi.mock('@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-skills-section', () => ({
  useGenerateSkillsSection: vi.fn(),
}))

vi.mock('@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-experiences-sections', () => ({
  useGenerateExperiencesSections: vi.fn(),
}))

vi.mock('@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-programs-section', () => ({
  useGenerateProgramsSection: vi.fn(),
}))

vi.mock('@/features/student/kit/composables/use-export-kit/sectionsGenerators/use-generate-self-knowledge-sections', () => ({
  useGenerateSelfKnowledgeSections: vi.fn(),
}))

vi.mock('docx', async () => {
  const actual = await vi.importActual<typeof import('docx')>('docx')

  return {
    ...actual,
    Document: vi.fn(),
    Packer: {
      toBlob: vi.fn(),
    },
  }
})

BddTest().given('a useExportKit composable', () => {
  const profileSection = [new Paragraph('profile')]
  const skillsSection = [new Paragraph('skills')]
  const experiencesSections = [new Paragraph('experiences')]
  const programsSection = [new Paragraph('programs')]
  const selfKnowledgeSections = [new Paragraph('self-knowledge')]

  beforeEach(() => {
    vi.mocked(useGenerateProfileSection).mockReturnValue({
      profileSection: computed(() => profileSection),
      isLoading: ref(false),
    })

    vi.mocked(useGenerateSkillsSection).mockReturnValue({
      skillsSection: computed(() => skillsSection),
      isLoading: ref(false),
    })

    vi.mocked(useGenerateExperiencesSections).mockReturnValue({
      experiencesSections: computed(() => experiencesSections),
      isLoading: ref(false),
    })

    vi.mocked(useGenerateProgramsSection).mockReturnValue({
      programsSection: computed(() => programsSection),
      isLoading: ref(false),
    })

    vi.mocked(useGenerateSelfKnowledgeSections).mockReturnValue({
      selfKnowledgeSections: computed(() => selfKnowledgeSections),
      isLoading: ref(false),
    })

    vi.mocked(Document).mockImplementation(() => ({}) as Document)

    vi.mocked(Packer.toBlob).mockResolvedValue(new Blob(['docx']))

    vi.clearAllMocks()
  })

  BddTest().when('the kit is initialized', () => {
    BddTest().then('it should not be loading', () => {
      const { isLoading } = useExportKit()

      expect(isLoading.value).toBe(false)
    })
  })

  BddTest().when('one section is loading', () => {
    beforeEach(() => {
      vi.mocked(useGenerateSkillsSection).mockReturnValue({
        skillsSection: computed(() => skillsSection),
        isLoading: ref(true),
      })
    })

    BddTest().then('the kit should be loading', () => {
      const { isLoading } = useExportKit()

      expect(isLoading.value).toBe(true)
    })
  })

  BddTest().when('all sections have finished loading', () => {
    BddTest().then('the kit should not be loading', () => {
      const { isLoading } = useExportKit()

      expect(isLoading.value).toBe(false)
    })
  })

  BddTest().when('the document is generated', () => {
    const blob = new Blob(['docx'])

    beforeEach(async () => {
      vi.mocked(Packer.toBlob).mockResolvedValue(blob)

      const { generateKitDocx } = useExportKit()

      await generateKitDocx('my-kit.docx')
    })

    BddTest().then('it should generate a document', () => {
      expect(Document).toHaveBeenCalledOnce()
    })

    BddTest().then('it should generate a blob from the document', () => {
      expect(Packer.toBlob).toHaveBeenCalledOnce()
    })

    BddTest().then('it should download the generated blob', () => {
      expect(downloadBlob).toHaveBeenCalledWith(blob, 'my-kit.docx')
    })

    BddTest().then('it should include all sections in the document', () => {
      expect(Document).toHaveBeenCalledWith({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 567,
                right: 567,
                bottom: 567,
                left: 567,
              },
            },
          },
          children: [
            ...profileSection,
            ...skillsSection,
            ...experiencesSections,
            ...programsSection,
            ...selfKnowledgeSections,
          ],
        }],
      })
    })
  })
})
