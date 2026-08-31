import type { AssociationSearchResultDeclaredActivityDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/global/types/associations.types'
import { useI18n } from 'vue-i18n'

export function useDeclaredActivityAssociation () {
  const { t } = useI18n()

  const declaredActivityToAssociation = (declaredActivity: AssociationSearchResultDeclaredActivityDTO): Association => ({
    id: declaredActivity.id,
    title: declaredActivity.title,
    disabled: declaredActivity.disabled,
    description: declaredActivity.thematic
      ? t(`global.activities.badges.thematics.${declaredActivity.thematic}`)
      : undefined
  })

  return {
    declaredActivityToAssociation
  }
}
