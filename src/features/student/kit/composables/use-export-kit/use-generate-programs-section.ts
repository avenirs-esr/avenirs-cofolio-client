import type { AvLocale } from '@/types'
import { type DeclaredProgramViewDTO, useGetDeclaredPrograms } from '@/api/avenir-esr'
import { formatDateLocalized } from '@/common/utils'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateProgramsSection () {
  const { t, locale } = useI18n()

  const { data: declaredPrograms, isFetching } = useGetDeclaredPrograms(
    { isValorized: true, pageSize: 100 }
  )

  function getProgramParagraphs (program: DeclaredProgramViewDTO) {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: program.title, bold: true }),
          new TextRun({ text: ` - ${program.organization}`, bold: true })
        ],
        heading: HeadingLevel.HEADING_2
      }),
      ...program.startDate
        ? [new Paragraph({
            children: [
              new TextRun(`${formatDateLocalized(program.startDate, locale.value as AvLocale, true)}`),
              new TextRun(` - ${program.endDate ? formatDateLocalized(program.endDate, locale.value as AvLocale, true) : t('global.dates.ongoing')}`)
            ]
          })]
        : []
    ]
  }
  const programsSection = computed<Paragraph[]>(() => [
    new Paragraph({
      children: [
        new TextRun({
          text: t('student.kit.composables.useExportKit.sections.programs.title').toUpperCase(),
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1
    }),
    ...(declaredPrograms.value?.data ?? []).flatMap(getProgramParagraphs)
  ])

  return {
    programsSection,
    isLoading: isFetching
  }
}
