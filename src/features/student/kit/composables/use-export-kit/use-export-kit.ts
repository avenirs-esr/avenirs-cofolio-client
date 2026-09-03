import { downloadBlob } from '@/common/utils/download/download'
import { useGenerateExperiencesSections } from '@/features/student/kit/composables/use-export-kit/use-generate-experiences-sections'
import { useGenerateProfileSection } from '@/features/student/kit/composables/use-export-kit/use-generate-profile-section'
import { useGenerateProgramsSection } from '@/features/student/kit/composables/use-export-kit/use-generate-programs-section'
import { useGenerateSelfKnowledgeSections } from '@/features/student/kit/composables/use-export-kit/use-generate-self-knowledge-sections'
import { useGenerateSkillsSection } from '@/features/student/kit/composables/use-export-kit/use-generate-skills-section'
import { centimeterToTwip } from '@/features/student/kit/composables/use-export-kit/utils'
import { Document, Packer } from 'docx'

export function useExportKit () {
  const { profileSection, isLoading: isProfileSectionLoading } = useGenerateProfileSection()
  const { skillsSection, isLoading: isSkillsSectionLoading } = useGenerateSkillsSection()
  const { experiencesSections, isLoading: isExperiencesSectionsLoading } = useGenerateExperiencesSections()
  const { programsSection, isLoading: isProgramsSectionLoading } = useGenerateProgramsSection()
  const { selfKnowledgeSections, isLoading: isSelfKnowledgeSectionsLoading } = useGenerateSelfKnowledgeSections()

  async function generateKitDocx (fileName: string) {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: centimeterToTwip(1),
              right: centimeterToTwip(1),
              bottom: centimeterToTwip(1),
              left: centimeterToTwip(1)
            }
          }
        },
        children: [
          ...profileSection.value,
          ...skillsSection.value,
          ...experiencesSections.value,
          ...programsSection.value,
          ...selfKnowledgeSections.value
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    downloadBlob(blob, fileName)
  }

  const isLoading = computed(() => isProfileSectionLoading.value
    || isSkillsSectionLoading.value
    || isExperiencesSectionsLoading.value
    || isProgramsSectionLoading.value
    || isSelfKnowledgeSectionsLoading.value)

  return {
    generateKitDocx,
    isLoading
  }
}
