import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import { useImageRunDataQuery } from '@/features/student/kit/composables/use-export-kit/use-image-run-data.query'
import { centimeterToEmu, centimeterToPixel } from '@/features/student/kit/composables/use-export-kit/utils'
import { ExternalHyperlink, HeadingLevel, ImageRun, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateProfileSection () {
  const { t } = useI18n()

  const { data: studentSummary, isLoading } = useGetProfile(EUserCategory.STUDENT)

  // TODO: use real url before PR
  // const { data: coverPictureData } = useImageRunDataQuery(studentSummary.value?.coverPicture.url)
  const { data: coverPictureData } = useImageRunDataQuery({
    url: 'https://qualif.avenirs-esr.fr/apim/storage/6e3efca3-9846-4fbf-ad0c-883ecf9ddcc0',
    width: centimeterToPixel(19),
    height: centimeterToPixel(2.5)
  })
  const { data: profilePictureData } = useImageRunDataQuery({
    url: 'https://dev.avenirs-esr.fr/apim/storage/default/profile-picture',
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
    return t('student.kit.composables.useExportKit.sections.profile.identity')
  })

  const displayedEmail = computed(() => {
    if (studentSummary.value?.email) {
      return studentSummary.value.email
    }
    return t('student.kit.composables.useExportKit.sections.profile.email')
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

  const profileSection = computed<Paragraph[]>(() => [
    ...coverPictureParagraph.value,
    ...profilePictureParagraph.value,
    new Paragraph({
      children: [
        new TextRun({
          text: `${displayedName.value}`,
          bold: true,
        }),
        new TextRun(` - ${t('student.kit.composables.useExportKit.sections.profile.targetJob')}`),
      ],
      heading: HeadingLevel.HEADING_1
    }),
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
    }),
    ...bioParagraph.value
  ])

  return {
    profileSection,
    isLoading
  }
}
