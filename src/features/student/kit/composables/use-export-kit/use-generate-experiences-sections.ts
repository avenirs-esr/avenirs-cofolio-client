import type { AvLocale } from '@/types/i18n.types'
import { type DeclaredExperienceViewDTO, EExperienceType, useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { formatDateLocalized } from '@/common/utils/date/date'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateExperiencesSections () {
  const { t, locale } = useI18n()

  const { data: declaredExperiences, isFetching } = useGetDeclaredExperienceView(
    { isValorized: true, pageSize: 100 }
  )
  const professionalExperiences = computed(() => (declaredExperiences.value?.data ?? []).filter(
    declaredExperience => declaredExperience.experienceType === EExperienceType.PROFESSIONAL
  ))
  const personalExperiences = computed(() => (declaredExperiences.value?.data ?? []).filter(
    declaredExperience => declaredExperience.experienceType === EExperienceType.PERSONAL
  ))

  function getExperienceSectionHeading (experience: DeclaredExperienceViewDTO) {
    return new Paragraph({
      children: [
        new TextRun({
          text: t(`student.kit.composables.useExportKit.sections.experiences.${experience.experienceType}.title`).toUpperCase(),
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1
    })
  }

  function getExperienceParagraphs (experience: DeclaredExperienceViewDTO) {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: experience.title, bold: true })
        ],
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun(experience.organization),
          new TextRun(` - ${formatDateLocalized(experience.startDate, locale.value as AvLocale, true)}`),
          new TextRun(` - ${experience.endDate ? formatDateLocalized(experience.endDate, locale.value as AvLocale, true) : t('global.dates.ongoing')}`)
        ]
      }),
      ...experience.description ? [new Paragraph({ children: [new TextRun(experience.description)] })] : []
    ]
  }

  function getExperiencesSection (experiences: DeclaredExperienceViewDTO[]): Paragraph[] {
    return [
      getExperienceSectionHeading(experiences[0]),
      ...experiences.flatMap(getExperienceParagraphs)
    ]
  }

  const experiencesSections = computed(() => [
    ...getExperiencesSection(professionalExperiences.value),
    ...getExperiencesSection(personalExperiences.value)
  ])

  return {
    experiencesSections,
    isLoading: isFetching
  }
}
