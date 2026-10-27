import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { useUserRoleConfig } from '@/features/staff/admin/composables/use-user-role-config/use-user-role-config'

BddTest().given('a useUserRoleConfig composable', () => {
  let getUserRoleConfig: ReturnType<typeof useUserRoleConfig>['getUserRoleConfig']

  beforeEach(() => {
    const { result } = mountComposable(useUserRoleConfig, { useI18n: true })
    getUserRoleConfig = result.getUserRoleConfig
  })

  BddTest().when('getting the config for an ADMIN role', () => {
    BddTest().then('it should return the admin icon, translated label and error colors', () => {
      const config = getUserRoleConfig(ERole.ROLE_ADMIN)

      expect(config.label.value).toBe('Administrateur(rice) établissement')
      expect(config.icon.value).toBe(ICONS.ADMIN)
      expect(config.color.value).toBe('var(--light-foreground-error)')
      expect(config.backgroundColor.value).toBe('var(--light-background-error)')
    })
  })

  BddTest().when('getting the config for a STAFF role', () => {
    BddTest().then('it should return the staff icon, translated label and info colors', () => {
      const config = getUserRoleConfig(ERole.ROLE_STAFF)

      expect(config.label.value).toBe('Personnel')
      expect(config.icon.value).toBe(ICONS.STAFF)
      expect(config.color.value).toBe('var(--light-foreground-info)')
      expect(config.backgroundColor.value).toBe('var(--light-background-info)')
    })
  })

  BddTest().when('getting the config for a STUDENT role', () => {
    BddTest().then('it should return the student icon, translated label and success colors', () => {
      const config = getUserRoleConfig(ERole.ROLE_STUDENT)

      expect(config.label.value).toBe('Étudiant')
      expect(config.icon.value).toBe(ICONS.STUDENT)
      expect(config.color.value).toBe('var(--light-foreground-success)')
      expect(config.backgroundColor.value).toBe('var(--light-background-success)')
    })
  })

  BddTest().when('getting the config for a COMMON role', () => {
    BddTest().then('it should return the user icon, translated label and neutral colors', () => {
      const config = getUserRoleConfig(ERole.ROLE_USER_BASE)

      expect(config.label.value).toBe('Utilisateur(rice) de base')
      expect(config.icon.value).toBe(ICONS.USER)
      expect(config.color.value).toBe('var(--light-foreground-neutral)')
      expect(config.backgroundColor.value).toBe('var(--light-background-neutral)')
    })
  })

  BddTest().when('getting the config for a role from each global type', () => {
    BddTest().then('it should return the expected icon and colors for each role', () => {
      const adminConfig = getUserRoleConfig(ERole.ROLE_SUPER_ADMIN)
      const staffConfig = getUserRoleConfig(ERole.ROLE_STAFF_FEEDBACK_RESPONDER)
      const studentConfig = getUserRoleConfig(ERole.ROLE_STUDENT_PORTFOLIO)
      const commonConfig = getUserRoleConfig(ERole.ROLE_USER_BASE)

      expect(adminConfig.icon.value).toBe(ICONS.ADMIN)
      expect(staffConfig.icon.value).toBe(ICONS.STAFF)
      expect(studentConfig.icon.value).toBe(ICONS.STUDENT)
      expect(commonConfig.icon.value).toBe(ICONS.USER)
    })
  })
})
