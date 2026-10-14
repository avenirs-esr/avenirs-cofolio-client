import type { AssociationLimitDTO } from '@/api/avenir-esr'
import type { QueryClient } from '@tanstack/vue-query'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createMockedAssociationLimits } from '@/__mocks__/fixtures/student/associations.fixtures'
import { invalidTraceId } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createGetAssociationLimitsHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { type AssociationLimitState, useAssociationLimit, type UseAssociationLimitOptions, useAssociationLimits, type UseAssociationLimitsOptions } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const CONTEXT_TYPES = Object.values(EAssociationContextType)
const LIMIT_REACHED_TOOLTIPS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'Vous avez atteint le nombre maximal de traces pouvant être associées.',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'Vous avez atteint le nombre maximal d\'activités pouvant être associées.',
  [EAssociationContextType.DECLARED_SKILL]: 'Vous avez atteint le nombre maximal de compétences pouvant être associées.',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'Vous avez atteint le nombre maximal d\'expériences pouvant être associées.',
  [EAssociationContextType.DECLARED_PROGRAM]: 'Vous avez atteint le nombre maximal de formations pouvant être associées.'
}
const NOT_ALLOWED_TOOLTIP = 'Ce type d\'association n\'est pas autorisé.'

const UNKNOWN_LIMIT: AssociationLimitState = { isLoaded: false, remaining: Number.POSITIVE_INFINITY }

const INFINITE_LOADING_ID = 'INFINITE_LOADING_ID'
const INTERNAL_ERROR_ID = 'INTERNAL_ERROR_ID'
const ELEMENT_ID = mockedDeclaredActivityDetails.id
const OTHER_ELEMENT_ID = `${ELEMENT_ID}-other`
const UNKNOWN_ELEMENT_ID = invalidTraceId

const DEFAULT_TYPE = EAssociationContextType.DECLARED_ACTIVITY
const DEFAULT_LIMITS = createMockedAssociationLimits(DEFAULT_TYPE)
const REACHED_LIMITS = createMockedAssociationLimits(DEFAULT_TYPE, true)
const LIMITED_TYPE = DEFAULT_LIMITS[0]!.associatedContextType
const UNLIMITED_TYPE = getAssociableContextTypes(DEFAULT_TYPE).find(type => type !== LIMITED_TYPE)!

const SCENARIOS: Array<{ name: string, contextType: EAssociationContextType, limits: AssociationLimitDTO[] }> = [
  ...CONTEXT_TYPES.map(contextType => ({
    name: `the limits of an element of type ${contextType} are loaded`,
    contextType,
    limits: createMockedAssociationLimits(contextType)
  })),
  { name: 'the limit of an element is reached', contextType: DEFAULT_TYPE, limits: REACHED_LIMITS },
  { name: 'an association type is not allowed at all', contextType: DEFAULT_TYPE, limits: DEFAULT_LIMITS.map(limit => ({ ...limit, max: 0, remaining: 0 })) },
  {
    name: 'the limit of every association type is reached',
    contextType: DEFAULT_TYPE,
    limits: getAssociableContextTypes(DEFAULT_TYPE).map(associatedContextType => ({ associatedContextType, max: 1, remaining: 0 }))
  }
]

const defaultLimitsOptions: UseAssociationLimitsOptions = { contextType: DEFAULT_TYPE }
const defaultLimitOptions: UseAssociationLimitOptions = { ...defaultLimitsOptions, associatedContextType: LIMITED_TYPE }

function toLimitState (limits: AssociationLimitDTO[], type: EAssociationContextType): AssociationLimitState {
  const limit = limits.find(({ associatedContextType }) => associatedContextType === type)

  return { isLoaded: true, max: limit?.max, remaining: limit?.remaining ?? Number.POSITIVE_INFINITY }
}

function toAssociateState (limits: AssociationLimitDTO[], type: EAssociationContextType) {
  const { max, remaining } = toLimitState(limits, type)

  return remaining > 0
    ? { disabled: false }
    : { disabled: true, disabledTooltip: max === 0 ? NOT_ALLOWED_TOOLTIP : LIMIT_REACHED_TOOLTIPS[type] }
}

let queryClient: QueryClient
let unmount: (() => void) | undefined

function mountWithClient<T extends object> (composable: () => T) {
  const mounted = mountComposable(() => ({
    ...composable(),
    queryClient: useQueryClient()
  }), {
    useTanstack: true,
    useI18n: true
  })

  queryClient = mounted.result.queryClient
  unmount = mounted.unmount

  return mounted.result
}

const givenLimits = (limits: AssociationLimitDTO[]) => server.use(createGetAssociationLimitsHandler(limits))

async function waitForLimits () {
  await nextTick()
  await vi.waitFor(() => expect(queryClient.isFetching()).toBe(0))
}

const expectLimitsBeingRead = () => expect(queryClient.isFetching()).toBe(1)
const expectLimitsNotRead = () => expect(queryClient.isFetching()).toBe(0)

afterEach(() => {
  unmount?.()
  unmount = undefined
})

BddTest().given('the useAssociationLimits composable', () => {
  let limits: ReturnType<typeof useAssociationLimits>
  let options: UseAssociationLimitsOptions

  const mountWith = (overrides: Partial<UseAssociationLimitsOptions> = {}) => {
    options = { ...defaultLimitsOptions, ...overrides }
    limits = mountWithClient(() => useAssociationLimits(options))
  }

  const getAssociableTypes = () => getAssociableContextTypes(options.contextType)

  const expectLimitStates = (apiLimits: AssociationLimitDTO[]) => {
    getAssociableTypes().forEach(type => expect(limits.getLimit(type)).toEqual(toLimitState(apiLimits, type)))
  }

  const expectAssociateStates = (apiLimits: AssociationLimitDTO[]) => {
    getAssociableTypes().forEach(type => expect(limits.getAssociateState(type)).toEqual(toAssociateState(apiLimits, type)))
  }

  const expectUnknownLimits = () => {
    getAssociableTypes().forEach((type) => {
      expect(limits.getLimit(type)).toEqual(UNKNOWN_LIMIT)
      expect(limits.getAssociateState(type)).toEqual({
        disabled: false
      })
    })
  }

  SCENARIOS.forEach(({ name, contextType, limits: apiLimits }) => {
    BddTest().when(name, () => {
      beforeEach(async () => {
        givenLimits(apiLimits)
        mountWith({
          contextType,
          elementId: ELEMENT_ID
        })
        await waitForLimits()
      })

      BddTest().then('it should give the limit and the places left of every associable type, the ones the API does not mention being unlimited', () => {
        expectLimitStates(apiLimits)
      })

      BddTest().then('it should only disable the association of the types without place left, with the reason', () => {
        expectAssociateStates(apiLimits)
      })
    })
  })

  BddTest().when('the limits are not loaded yet', () => {
    beforeEach(async () => {
      mountWith({
        elementId: INFINITE_LOADING_ID
      })
      await flushPromises()
    })

    BddTest().then('it should not know the limits, which is not the same as unlimited', () => {
      expectLimitsBeingRead()
      expectUnknownLimits()
    })
  })

  BddTest().when('the limits request fails', () => {
    beforeEach(async () => {
      mountWith({
        elementId: INTERNAL_ERROR_ID
      })
      await waitForLimits()
    })

    BddTest().then('it should still not know the limits', () => {
      expectUnknownLimits()
    })
  })

  BddTest().when('the element is not found', () => {
    beforeEach(async () => {
      mountWith({
        elementId: UNKNOWN_ELEMENT_ID
      })
      await waitForLimits()
    })

    BddTest().then('it should not know the limits', () => {
      expectUnknownLimits()
    })
  })

  BddTest().when('the limits are disabled', () => {
    const enabled = ref(false)

    beforeEach(async () => {
      enabled.value = false
      mountWith({
        elementId: INFINITE_LOADING_ID,
        enabled: () => enabled.value
      })
      await flushPromises()
    })

    BddTest().then('it should not read any limit', () => {
      expectLimitsNotRead()
      expectUnknownLimits()
    })

    BddTest().and('the limits get enabled', () => {
      beforeEach(async () => {
        givenLimits(DEFAULT_LIMITS)
        enabled.value = true
        await waitForLimits()
      })

      BddTest().then('it should read the limits', () => {
        expectLimitStates(DEFAULT_LIMITS)
      })
    })
  })

  BddTest().when('the limits of an element are loaded and its id changes', () => {
    const elementId = ref(ELEMENT_ID)

    beforeEach(async () => {
      elementId.value = ELEMENT_ID
      givenLimits(DEFAULT_LIMITS)
      mountWith({
        elementId: () => elementId.value
      })
      await waitForLimits()
    })

    BddTest().and('the new element has no place left', () => {
      beforeEach(async () => {
        givenLimits(REACHED_LIMITS)
        elementId.value = OTHER_ELEMENT_ID
        await waitForLimits()
      })

      BddTest().then('it should give the limits of the new element', () => {
        expectLimitStates(REACHED_LIMITS)
        expectAssociateStates(REACHED_LIMITS)
      })
    })
  })
})

BddTest().given('the useAssociationLimit composable', () => {
  let limit: ReturnType<typeof useAssociationLimit>

  const mountWith = (overrides: Partial<UseAssociationLimitOptions> = {}) => {
    limit = mountWithClient(() => useAssociationLimit({
      ...defaultLimitOptions,
      ...overrides
    }))
  }

  const getLimitState = () => ({
    isLoaded: limit.isLoaded.value,
    max: limit.max.value,
    remaining: limit.remaining.value,
    isLimitReached: limit.isLimitReached.value
  })

  const expectLimit = (apiLimits: AssociationLimitDTO[], type: EAssociationContextType) => {
    const state = toLimitState(apiLimits, type)
    expect(getLimitState()).toEqual({
      ...state,
      isLimitReached: state.remaining <= 0
    })
  }

  SCENARIOS.filter(({ contextType }) => contextType === DEFAULT_TYPE).forEach(({ name, limits: apiLimits }) => {
    getAssociableContextTypes(DEFAULT_TYPE).forEach((associatedContextType) => {
      BddTest().when(`${name}, reading the ${associatedContextType}`, () => {
        beforeEach(async () => {
          givenLimits(apiLimits)
          mountWith({
            elementId: ELEMENT_ID,
            associatedContextType
          })
          await waitForLimits()
        })

        BddTest().then('it should give the limit and the places left, and consider it reached once no place is left', () => {
          expectLimit(apiLimits, associatedContextType)
        })
      })
    })
  })

  BddTest().when('the limit of a type is not loaded yet', () => {
    beforeEach(async () => {
      mountWith({
        elementId: INFINITE_LOADING_ID
      })
      await flushPromises()
    })

    BddTest().then('it should not consider the limit as reached', () => {
      expect(getLimitState()).toEqual({
        ...UNKNOWN_LIMIT,
        isLimitReached: false
      })
    })
  })

  BddTest().when('the type changes', () => {
    const associatedContextType = ref<EAssociationContextType>(LIMITED_TYPE)

    beforeEach(async () => {
      associatedContextType.value = LIMITED_TYPE
      givenLimits(REACHED_LIMITS)
      mountWith({
        elementId: ELEMENT_ID,
        associatedContextType
      })
      await waitForLimits()
    })

    BddTest().then('it should give the limit of the new type without loading it again', async () => {
      expectLimit(REACHED_LIMITS, LIMITED_TYPE)

      associatedContextType.value = UNLIMITED_TYPE
      await nextTick()

      expectLimit(REACHED_LIMITS, UNLIMITED_TYPE)
    })
  })
})
