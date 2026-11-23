import { ICONS } from '@avenirs-esr/shared'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'

export function useUserCategoryConfig () {
  const { t } = useI18n()

  function getUserCategoryConfig (category: EUserCategory) {
    const label = computed(() =>
      t(`global.universes.${category}`)
    )

    const config = computed(() => {
      switch (category) {
        case EUserCategory.STAFF:
          return {
            color: 'var(--light-foreground-critical)',
            backgroundColor: 'var(--light-background-critical)',
            icon: ICONS.STAFF
          }
        case EUserCategory.STUDENT:
        default:
          return {
            color: 'var(--light-foreground-primary3)',
            backgroundColor: 'var(--light-background-primary3)',
            icon: ICONS.STUDENT,
          }
      }
    })

    return {
      label,
      color: computed(() => config.value.color),
      backgroundColor: computed(() => config.value.backgroundColor),
      icon: computed(() => config.value.icon),
    }
  }

  return { getUserCategoryConfig }
}
