import type { AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useGetAssociations } from '@/api/avenir-esr'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { countAssociations, getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'

type AssociationAction = 'associate' | 'dissociate'

interface UseAssociationTypeOptions {
  contextType: EAssociationContextType
  elementId: string
  action: AssociationAction
}

export function useAssociationType ({
  contextType,
  elementId,
  action,
}: UseAssociationTypeOptions) {
  const { t } = useI18n()

  const { getAssociateState } = useAssociationLimits({
    contextType,
    elementId: () => elementId
  })

  const { data: associations } = useGetAssociations(contextType, elementId, undefined, {
    query: {
      enabled: action === 'dissociate' && !!elementId,
    },
  })

  const selectableTypes = computed(() => getAssociableContextTypes(contextType)
    .filter(type => type !== contextType))

  const selectedType = ref<EAssociationContextType | undefined>(selectableTypes.value?.[0])

  function getTypeState (
    type: EAssociationContextType,
  ): { disabled: boolean, disabledTooltip?: string } {
    if (action === 'dissociate') {
      const disabled = countAssociations(associations.value, [type]) === 0
      return {
        disabled,
        disabledTooltip: disabled
          ? t(`student.associations.contextTypes.${type}.unassociateDisabledTooltip`)
          : undefined,
      }
    }
    const state = getAssociateState(type)
    return { disabled: state.disabled, disabledTooltip: state.disabledTooltip }
  }
  const typeOptions = computed(() =>
    selectableTypes.value.map(type => ({
      value: type,
      label: t(`student.associations.availableContextTypes.${type}`),
      ...getTypeState(type),
    })),
  )

  const selectedOption = computed<AvSelectSelectedOption | null>({
    get () {
      if (!selectedType.value) {
        return null
      }
      return typeOptions.value.find(option => option.value === selectedType.value) ?? null
    },
    set (option) {
      if (option) {
        selectedType.value = option.value as EAssociationContextType
      }
    },
  })

  return {
    selectableTypes,
    selectedType,
    selectedOption,
    typeOptions,
    associations,
  }
}
