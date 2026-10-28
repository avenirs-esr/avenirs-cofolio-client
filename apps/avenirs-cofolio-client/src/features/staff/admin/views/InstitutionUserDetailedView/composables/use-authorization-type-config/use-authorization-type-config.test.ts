import { MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { EAuthorization } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants/icons'
import { useAuthorizationTypeConfig } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-authorization-type-config/use-authorization-type-config'

BddTest().given('a useAuthorizationTypeConfig composable', () => {
  let getAuthorizationTypeConfig: ReturnType<typeof useAuthorizationTypeConfig>['getAuthorizationTypeConfig']

  beforeEach(() => {
    const { result } = mountComposable(useAuthorizationTypeConfig, { useI18n: true })
    getAuthorizationTypeConfig = result.getAuthorizationTypeConfig
  })

  BddTest().when('getting the config for a LEADER authorization', () => {
    BddTest().then('it should return the admin icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.LEADER)

      expect(config.icon.value).toBe(ICONS.ADMIN)
      expect(config.label.value).toBe('Responsable')
    })
  })

  BddTest().when('getting the config for an EDIT authorization', () => {
    BddTest().then('it should return the pencil icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.EDIT)

      expect(config.icon.value).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(config.label.value).toBe('Éditeur(rice)')
    })
  })

  BddTest().when('getting the config for a MANAGE_AUTHORIZATIONS authorization', () => {
    BddTest().then('it should return the people group icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.MANAGE_AUTHORIZATIONS)

      expect(config.icon.value).toBe(MDI_ICONS.PEOPLE_GROUP_OUTLINE)
      expect(config.label.value).toBe('Gestionnaire autorisations')
    })
  })

  BddTest().when('getting the config for a FEEDBACK authorization', () => {
    BddTest().then('it should return the feedback icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.FEEDBACK)

      expect(config.icon.value).toBe(ICONS.FEEDBACK)
      expect(config.label.value).toBe('Référent(e) feedbacks')
    })
  })

  BddTest().when('getting the config for an EVALUATION authorization', () => {
    BddTest().then('it should return the star icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.EVALUATION)

      expect(config.icon.value).toBe(MDI_ICONS.STAR_OUTLINE)
      expect(config.label.value).toBe('Évaluateur(rice)')
    })
  })

  BddTest().when('getting the config for a PUBLISH authorization', () => {
    BddTest().then('it should return the send icon and translated label', () => {
      const config = getAuthorizationTypeConfig(EAuthorization.PUBLISH)

      expect(config.icon.value).toBe(MS_ICONS.SEND_OUTLINE_ROUNDED)
      expect(config.label.value).toBe('Publieur(se)')
    })
  })
})
