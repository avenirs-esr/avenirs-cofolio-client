import { MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { EAuthorization } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'

export function useAuthorizationTypeConfig () {
  const { t } = useI18n()

  function getAuthorizationTypeConfig (type: EAuthorization) {
    const label = computed(() =>
      t(`staff.admin.views.InstitutionUserDetailedView.components.badges.AuthorizationTypeBadge.${type}`)
    )

    const icon = computed(() => {
      switch (type) {
        case EAuthorization.LEADER:
          return ICONS.ADMIN
        case EAuthorization.EDIT:
          return MDI_ICONS.PENCIL_OUTLINE
        case EAuthorization.MANAGE_AUTHORIZATIONS:
          return MDI_ICONS.PEOPLE_GROUP_OUTLINE
        case EAuthorization.FEEDBACK:
          return ICONS.FEEDBACK
        case EAuthorization.EVALUATION:
          return MDI_ICONS.STAR_OUTLINE
        case EAuthorization.PUBLISH:
        default:
          return MS_ICONS.SEND_OUTLINE_ROUNDED
      }
    })

    return {
      label,
      icon
    }
  }

  return {
    getAuthorizationTypeConfig
  }
}
