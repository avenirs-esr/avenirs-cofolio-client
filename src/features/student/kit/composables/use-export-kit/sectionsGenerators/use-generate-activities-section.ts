import { type DeclaredActivityViewDTO, useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateActivitiesSection () {
  const { t } = useI18n()

  const { data: activities, isFetching } = useGetDeclaredActivitiesView(
    { isValorized: true, pageSize: 100 }
  )

  function generateActivitySubsection (activity: DeclaredActivityViewDTO) {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: activity.title,
            bold: true
          })
        ],
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun(t('student.kit.composables.useExportKit.sections.activities.thematic', {
            thematic: t(`global.activities.badges.thematics.${activity.thematic}`)
          }))
        ]
      }),
    ]
  }

  const activitiesSubsections = computed<Paragraph[]>(() => {
    return (activities.value?.data ?? []).flatMap(activity => generateActivitySubsection(activity))
  })

  const activitiesSection = computed<Paragraph[]>(() => (activities.value?.data ?? []).length > 0
    ? [
        new Paragraph({
          children: [
            new TextRun({
              text: t('student.kit.composables.useExportKit.sections.activities.title').toUpperCase(),
              bold: true,
            }),
          ],
          heading: HeadingLevel.HEADING_1
        }),
        ...activitiesSubsections.value
      ]
    : [])

  return {
    activitiesSection,
    isLoading: isFetching
  }
}
