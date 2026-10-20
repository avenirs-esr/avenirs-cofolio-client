import { ExternalHyperlink, HeadingLevel, ImageRun, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { useImageRunDataQuery } from '@/features/student/kit/composables/use-export-kit/utils/use-image-run-data.query'
import { centimeterToEmu, centimeterToPixel } from '@/features/student/kit/composables/use-export-kit/utils/utils'

export function useGenerateProfileSection () {
  const { t } = useI18n()
  const { profile } = useCurrentUser()

  const { data: coverPictureData } = useImageRunDataQuery({
    url: computed(() => profile.data.value.coverPicture.url),
    width: centimeterToPixel(19),
    height: centimeterToPixel(2.5)
  })
  const { data: profilePictureData } = useImageRunDataQuery({
    url: computed(() => profile.data.value.profilePicture.url),
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
    if (profile.data.value.firstname && profile.data.value.lastname) {
      return `${profile.data.value.firstname} ${profile.data.value.lastname}`
    }
    return undefined
  })

  const displayedEmail = computed(() => {
    if (profile.data.value.email) {
      return profile.data.value.email
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
    if (profile.data.value.bio) {
      return [
        new Paragraph({
          children: [
            new TextRun(`${t('global.colon', {
              before: t('student.kit.composables.useExportKit.sections.profile.bio')
            })} ${profile.data.value.bio}`),
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
    isLoading: profile.isLoading
  }
}
