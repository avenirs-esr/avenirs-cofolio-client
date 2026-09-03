import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import { useImageRunDataQuery } from '@/features/student/kit/composables/use-export-kit/utils/use-image-run-data.query'
import { centimeterToEmu, centimeterToPixel } from '@/features/student/kit/composables/use-export-kit/utils/utils'
import { ExternalHyperlink, HeadingLevel, ImageRun, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateProfileSection () {
  const { t } = useI18n()

  const { data: studentSummary, isLoading } = useGetProfile(EUserCategory.STUDENT)

  const { data: coverPictureData } = useImageRunDataQuery({
    url: computed(() => studentSummary.value?.coverPicture.url),
    width: centimeterToPixel(19),
    height: centimeterToPixel(2.5)
  })
  const { data: profilePictureData } = useImageRunDataQuery({
    url: computed(() => studentSummary.value?.profilePicture.url),
    width: centimeterToPixel(3),
    height: centimeterToPixel(3)
  })

  const coverPictureParagraph = computed(() => {
    if (coverPictureData.value) {
      return [
        new Paragraph({
          children: [
            new ImageRun({ ...coverPictureData.value })
          ],
        })
      ]
    }
    return []
  })

  const profilePictureParagraph = computed(() => {
    if (profilePictureData.value) {
      return [
        new Paragraph({
          children: [
            new ImageRun({
              ...profilePictureData.value,
              floating: {
                horizontalPosition: {
                  offset: centimeterToEmu(16),
                },
                verticalPosition: {
                  offset: centimeterToEmu(2),
                },
              },
            })
          ],
        })
      ]
    }
    return []
  })

  const displayedName = computed(() => {
    if (studentSummary.value?.firstname && studentSummary.value?.lastname) {
      return `${studentSummary.value.firstname} ${studentSummary.value.lastname}`
    }
    return undefined
  })

  const displayedEmail = computed(() => {
    if (studentSummary.value?.email) {
      return studentSummary.value.email
    }
    return undefined
  })

  const nameParagraph = computed(() => {
    if (displayedName.value) {
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: `${displayedName.value}`,
              bold: true,
            }),
            new TextRun(` - ${t('student.kit.composables.useExportKit.sections.profile.targetJob')}`),
          ],
          heading: HeadingLevel.HEADING_1
        })
      ]
    }
    return []
  })

  const emailParagraph = computed(() => {
    if (displayedEmail.value) {
      return [
        new Paragraph({
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: displayedEmail.value,
                  style: 'Hyperlink',
                }),
              ],
              link: `mailto:${displayedEmail.value}`,
            })
          ]
        })
      ]
    }
    return []
  })

  const bioParagraph = computed(() => {
    if (studentSummary.value?.bio) {
      return [
        new Paragraph({
          children: [
            new TextRun(`${t('global.colon', {
              before: t('student.kit.composables.useExportKit.sections.profile.bio')
            })} ${studentSummary.value?.bio}`),
          ],
        })
      ]
    }
    return []
  })

  const profileSection = computed<Paragraph[]>(() => {
    return [
      ...coverPictureParagraph.value,
      ...profilePictureParagraph.value,
      ...nameParagraph.value,
      ...emailParagraph.value,
      ...bioParagraph.value
    ]
  })

  return {
    profileSection,
    isLoading
  }
}
