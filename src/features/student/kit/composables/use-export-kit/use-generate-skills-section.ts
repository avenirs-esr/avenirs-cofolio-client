import { type DeclaredSkillProgressDTO, EDeclaredSkillLevel, useGetAdditionalSkillConfig, useGetDeclaredSkillsProgresses } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils/type-guards/type-guards'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateSkillsSection () {
  const { t } = useI18n()

  const { data: declaredSkills, isFetching } = useGetDeclaredSkillsProgresses(
    { isValorized: true, pageSize: 100 }
  )
  const { data: skillConfig } = useGetAdditionalSkillConfig()

  function getLevelParagraph (level: EDeclaredSkillLevel): Paragraph[] {
    if (!skillConfig.value || !isEnumMember(EDeclaredSkillLevel, level)) {
      return []
    }
    return [
      new Paragraph({
        children: [
          new TextRun(t('global.colon', { before: t('student.kit.composables.useExportKit.sections.skills.level') })),
          new TextRun(` ${skillConfig.value[level]?.label}`)
        ]
      })
    ]
  }

  function generateSkillSubsection (skill: DeclaredSkillProgressDTO) {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: skill.title,
            bold: true
          })
        ],
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun(t('student.kit.composables.useExportKit.sections.skills.declaredRef', {
            ref: t(`student.declaredSkills.declaredSkillTypes.${skill.type}`)
          }))
        ]
      }),
      ...getLevelParagraph(skill.level)
    ]
  }

  const skillSubsections = computed<Paragraph[]>(() => {
    return (declaredSkills.value?.data ?? []).flatMap(skill => generateSkillSubsection(skill))
  })

  const skillsSection = computed<Paragraph[]>(() => [
    new Paragraph({
      children: [
        new TextRun({
          text: t('student.kit.composables.useExportKit.sections.skills.title').toUpperCase(),
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1
    }),
    ...skillSubsections.value
  ])

  return {
    skillsSection,
    isLoading: isFetching
  }
}
