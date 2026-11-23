import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComposable } from 'tests/utils'
import { useUserCategoryConfig } from '@/features/staff/admin/composables/use-user-category-config/use-user-category-config'

BddTest().given('a useUserCategoryConfig composable', () => {
  let getUserCategoryConfig: ReturnType<typeof useUserCategoryConfig>['getUserCategoryConfig']

  const STAFF_LABEL = 'Enseignant(e)'
  const STUDENT_LABEL = 'Apprenant(e)'

  beforeEach(() => {
    const { result } = mountComposable(useUserCategoryConfig, { useI18n: true })
    getUserCategoryConfig = result.getUserCategoryConfig
  })

  BddTest().when('getting the config for a STAFF category', () => {
    BddTest().then('it should return the staff icon, colors and translated label', () => {
      const config = getUserCategoryConfig(EUserCategory.STAFF)

      expect(config.icon.value).toBe(ICONS.STAFF)
      expect(config.color.value).toBe('var(--light-foreground-critical)')
      expect(config.backgroundColor.value).toBe('var(--light-background-critical)')
      expect(config.label.value).toBe(STAFF_LABEL)
    })
  })

  BddTest().when('getting the config for a STUDENT category', () => {
    BddTest().then('it should return the student icon, colors and translated label', () => {
      const config = getUserCategoryConfig(EUserCategory.STUDENT)

      expect(config.icon.value).toBe(ICONS.STUDENT)
      expect(config.color.value).toBe('var(--light-foreground-primary3)')
      expect(config.backgroundColor.value).toBe('var(--light-background-primary3)')
      expect(config.label.value).toBe(STUDENT_LABEL)
    })
  })
})
