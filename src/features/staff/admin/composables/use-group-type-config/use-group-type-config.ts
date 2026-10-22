import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'

export function useGroupTypeConfig () {
  const { t } = useI18n()

  function getGroupTypeConfig (type: EGroupType) {
    const label = computed(() =>
      t(`staff.admin.components.badges.GroupTypeBadge.label.${type}`)
    )

    const icon = computed(() => {
      switch (type) {
        case EGroupType.PROGRAM:
          return MDI_ICONS.SCHOOL_OUTLINE
        case EGroupType.PROGRAM_OPTION:
          return MDI_ICONS.BOOK_OPEN_BLANK_VARIANT_OUTLINE
        case EGroupType.STUDENT_GROUP:
        default:
          return MDI_ICONS.PEOPLE_GROUP_OUTLINE
      }
    })

    return {
      label,
      icon
    }
  }

  return {
    getGroupTypeConfig
  }
}
