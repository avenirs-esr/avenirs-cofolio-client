import { useI18n } from 'vue-i18n'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'

/**
 * Determines the global type of a user role.
 * @see ERole The enumeration of user roles in the system.
 * @link https://github.com/avenirs-esr/avenirs-portfolio-common/blob/develop/src/main/java/fr/avenirsesr/portfolio/common/security/accesscontrol/domain/model/enums/ERole.java
 * @param role The user role to determine the global type for.
 * @returns The global type of the user role ('ADMIN', 'STAFF', 'STUDENT', or 'COMMON').
 */
function getUserRoleGlobalType (role: ERole): 'ADMIN' | 'STAFF' | 'STUDENT' | 'COMMON' {
  switch (role) {
    case ERole.ROLE_ACTIVITY_ADMIN:
    case ERole.ROLE_ACTIVITY_EDITOR:
    case ERole.ROLE_ADMIN:
    case ERole.ROLE_CONFIG_MANAGER:
    case ERole.ROLE_CONFIG_VIEWER:
    case ERole.ROLE_ESTABLISHMENT_MANAGER:
    case ERole.ROLE_ESTABLISHMENT_VIEWER:
    case ERole.ROLE_EXTERNAL_USER_MANAGER:
    case ERole.ROLE_EXTERNAL_USER_VIEWER:
    case ERole.ROLE_GROUP_MANAGER:
    case ERole.ROLE_GROUP_VIEWER:
    case ERole.ROLE_RBAC_ADMIN:
    case ERole.ROLE_RBAC_AUDITOR:
    case ERole.ROLE_SUPER_ADMIN:
    case ERole.ROLE_SYSTEM_OPERATOR:
      return 'ADMIN'

    case ERole.ROLE_STAFF:
    case ERole.ROLE_STAFF_ACTIVITY_AUTHOR:
    case ERole.ROLE_STAFF_ACTIVITY_VIEWER:
    case ERole.ROLE_STAFF_FEEDBACK_RESPONDER:
    case ERole.ROLE_STAFF_FEEDBACK_SUPERVISOR:
    case ERole.ROLE_STAFF_TRACE_REVIEWER:
      return 'STAFF'

    case ERole.ROLE_STUDENT:
    case ERole.ROLE_STUDENT_ACTIVITY:
    case ERole.ROLE_STUDENT_EMPLOYMENT_KIT:
    case ERole.ROLE_STUDENT_FEEDBACK:
    case ERole.ROLE_STUDENT_PORTFOLIO:
    case ERole.ROLE_STUDENT_REFERENCE_DATA:
      return 'STUDENT'

    case ERole.ROLE_USER_BASE:
    default:
      return 'COMMON'
  }
}

export function useUserRoleConfig () {
  const { t } = useI18n()

  function getUserRoleConfig (role: ERole) {
    const label = computed(() =>
      t(`global.roles.${role}.label`)
    )

    const globalType = computed(() => getUserRoleGlobalType(role))

    const color = computed(() => {
      switch (globalType.value) {
        case 'ADMIN':
          return 'var(--light-foreground-error)'
        case 'STAFF':
          return 'var(--light-foreground-info)'
        case 'STUDENT':
          return 'var(--light-foreground-success)'
        case 'COMMON':
        default:
          return 'var(--light-foreground-neutral)'
      }
    })

    const backgroundColor = computed(() => {
      switch (globalType.value) {
        case 'ADMIN':
          return 'var(--light-background-error)'
        case 'STAFF':
          return 'var(--light-background-info)'
        case 'STUDENT':
          return 'var(--light-background-success)'
        case 'COMMON':
        default:
          return 'var(--light-background-neutral)'
      }
    })

    const icon = computed(() => {
      switch (globalType.value) {
        case 'ADMIN':
          return ICONS.ADMIN
        case 'STAFF':
          return ICONS.STAFF
        case 'STUDENT':
          return ICONS.STUDENT
        case 'COMMON':
        default:
          return ICONS.USER
      }
    })

    return {
      label,
      icon,
      color,
      backgroundColor
    }
  }

  return {
    getUserRoleConfig
  }
}
