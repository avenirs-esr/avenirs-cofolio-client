import type { AssociationsDTO, EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { countAssociations } from '@/features/student/associations/utils/associations.utils'

/**
 * Provides a composable for determining the dissociation state of associations.
 * @returns An object containing the `getDissociationState` function.
 */
export function useDissociationState () {
  const { t } = useI18n()

  /**
   * Determines the dissociation state for a given association type and the current associations of the element.
   * @param associatedContextType The type of association to check for dissociation.
   * @param associations The current associations of the element.
   * @returns An object indicating whether dissociation is disabled and an optional tooltip explaining why.
   */
  function getDissociationState (
    associatedContextType: EAssociationContextType,
    associations: AssociationsDTO | undefined
  ): { disabled: boolean, disabledTooltip?: string } {
    const disabledTooltipsKey = `student.associations.composables.useDissociationState.disabledTooltips`

    const disabled = countAssociations(associations, [associatedContextType]) === 0
    const disabledTooltip = disabled
      ? t(`${disabledTooltipsKey}.dissociate`, {
          entityName: t(`${disabledTooltipsKey}.entityName.${associatedContextType}`)
        })
      : undefined

    return {
      disabled,
      disabledTooltip
    }
  }

  return {
    getDissociationState
  }
}
