import type { EAssociationContextType } from '@/api/avenir-esr'
import type { MaybeRefOrGetter } from 'vue'
import { useGetAssociationLimits } from '@/api/avenir-esr'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export interface UseAssociationLimitsOptions {
  contextType: EAssociationContextType
  /**
   * The element whose limits are read, omitted when it does not exist yet (nothing is limited then).
   */
  elementId?: MaybeRefOrGetter<string | undefined>
  enabled?: MaybeRefOrGetter<boolean>
}

export interface AssociationLimitState {
  /** Whether the API answered: until then (or if it fails), the limit is unknown, not "unlimited". */
  isLoaded: boolean
  /** Undefined when unlimited or unknown. */
  max?: number
  /** Infinity when unlimited or unknown. */
  remaining: number
}

export const UNKNOWN_ASSOCIATION_LIMIT: AssociationLimitState = { isLoaded: false, remaining: Number.POSITIVE_INFINITY }

/**
 * Reads the limits of an element for every associated context type at once, e.g. to disable the
 * entries of an "associate..." menu whose limit is reached.
 *
 * The API only describes the limited types: once the answer is loaded, a type it does not mention
 * is unlimited. It is a single query per element, shared by every component reading its limits.
 */
export function useAssociationLimits ({ contextType, elementId, enabled = true }: UseAssociationLimitsOptions) {
  const { t } = useI18n()
  const currentElementId = computed(() => toValue(elementId))

  const { data: limits } = useGetAssociationLimits(
    contextType,
    computed(() => currentElementId.value ?? ''),
    { query: { enabled: computed(() => toValue(enabled) && !!currentElementId.value) } }
  )

  /**
   * Snapshot of the limit of a type.
   */
  function getLimit (associatedContextType: EAssociationContextType): AssociationLimitState {
    const limit = limits.value?.find(({ associatedContextType: type }) => type === associatedContextType)

    return {
      isLoaded: limits.value !== undefined,
      max: limit?.max,
      remaining: limit?.remaining ?? Number.POSITIVE_INFINITY
    }
  }

  /**
   * Whether the element can still receive elements of the given type, with the tooltip saying why not.
   */
  function getAssociateState (associatedContextType: EAssociationContextType): { disabled: boolean, disabledTooltip?: string } {
    const { max, remaining } = getLimit(associatedContextType)

    if (remaining > 0) {
      return { disabled: false }
    }

    return {
      disabled: true,
      disabledTooltip: max === 0
        ? t('student.associations.composables.useAssociationLimits.notAllowedTooltip')
        : t(`student.associations.contextTypes.${associatedContextType}.associateLimitReachedTooltip`)
    }
  }

  return {
    getLimit,
    getAssociateState
  }
}

export interface UseAssociationLimitOptions extends UseAssociationLimitsOptions {
  associatedContextType: MaybeRefOrGetter<EAssociationContextType>
}

/**
 * Reads how many elements of a context type can still be associated with an element. The type can
 * change over time (e.g. a picker switching between types): the limits of the element are already
 * loaded, so switching does not fetch anything.
 */
export function useAssociationLimit ({ associatedContextType, ...options }: UseAssociationLimitOptions) {
  const { getLimit } = useAssociationLimits(options)
  const limit = computed(() => getLimit(toValue(associatedContextType)))

  const isLoaded = computed(() => limit.value.isLoaded)
  const max = computed(() => limit.value.max)
  const remaining = computed(() => limit.value.remaining)
  const isLimitReached = computed(() => remaining.value <= 0)

  return { isLoaded, max, remaining, isLimitReached }
}
