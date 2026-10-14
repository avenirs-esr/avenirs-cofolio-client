import type { AssociationLimitDTO, AssociationSearchResultDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/student/associations/types/associations.types'
import type { QueryClient } from '@tanstack/vue-query'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createMockedAssociationLimits, createMockedAssociationSearchResponse, createMockedTraceSearchResults } from '@/__mocks__/fixtures/student/associations.fixtures'
import { invalidTraceId } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createGetAssociationLimitsHandler, searchForAssociationErrorHandler, searchForAssociationWithNewElementErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic, EAssociationContextType, EExperienceType, EExternalSkillType } from '@/api/avenir-esr'
import { useAssociationSearch, type UseAssociationSearchOptions, useAssociationSearchResults } from '@/features/student/associations/composables/use-association-search/use-association-search'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED, ASSOCIATION_SEARCH_PAGE_SIZE, DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const DISABLED_TOOLTIP = 'Cet élément est déjà associé.'
const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const LIMIT_REACHED_TOOLTIP = 'Nombre maximal d\'associations autorisées atteint.'
const SELECTION_LIMIT_REACHED_TOOLTIP = 'Vous avez atteint le nombre maximal d\'éléments pouvant être sélectionnés.'
const SERVER_ERROR_DESCRIPTION = 'Erreur serveur interne'
const TRACE_NOT_FOUND_DESCRIPTION = 'Trace introuvable'

const API_DESCRIPTION = 'cv.pdf'
const INVALID_KEYWORD = 'INVALID_KEYWORD'
const RAW_CATEGORY = 'SOME_CATEGORY'
const TRANSLATED_CATEGORIES = [
  { contextType: EAssociationContextType.DECLARED_ACTIVITY, category: EActivityThematic.SELF_KNOWLEDGE, description: 'Me connaître' },
  { contextType: EAssociationContextType.DECLARED_ACTIVITY, category: EActivityThematic.FUTURE_PLANS, description: 'Explorer mes futurs' },
  { contextType: EAssociationContextType.DECLARED_ACTIVITY, category: EActivityThematic.PROGRAMS, description: 'Mes formations' },
  { contextType: EAssociationContextType.DECLARED_SKILL, category: EExternalSkillType.ROME4, description: 'Rome 4.0' },
  { contextType: EAssociationContextType.DECLARED_SKILL, category: EExternalSkillType.XXI, description: 'XXIᵉ onisep' },
  { contextType: EAssociationContextType.DECLARED_SKILL, category: EExternalSkillType.CASOC, description: 'Casoc onisep' },
  { contextType: EAssociationContextType.DECLARED_EXPERIENCE, category: EExperienceType.PERSONAL, description: 'Expérience personnelle' },
  { contextType: EAssociationContextType.DECLARED_EXPERIENCE, category: EExperienceType.PROFESSIONAL, description: 'Expérience professionnelle' }
]

const { mockAddErrorMessage } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn()
}))

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const CONTEXT_TYPES = Object.values(EAssociationContextType)
const FILTERS = Object.values(AssociationSearchFilter)
const OTHER_FILTERS = FILTERS.filter(filter => filter !== DEFAULT_ASSOCIATION_SEARCH_FILTER)
const FILTERABLE_TYPE = CONTEXT_TYPES.find(type => ASSOCIATION_CONTEXT_CONFIGS[type].filterable)!
const TYPES_WITHOUT_LABELS = CONTEXT_TYPES.filter(type => !ASSOCIATION_CONTEXT_CONFIGS[type].categoryLabelKeyPrefix)

const INFINITE_LOADING_ID = 'INFINITE_LOADING_ID'
const INTERNAL_ERROR_ID = 'INTERNAL_ERROR_ID'
const ELEMENT_ID = mockedDeclaredActivityDetails.id
const LIMIT_REACHED_ELEMENT_ID = `${ELEMENT_ID}-WITH_LIMIT_REACHED`
const ELEMENTS = [
  { name: 'an existing element', options: { elementId: ELEMENT_ID } },
  { name: 'an element that does not exist yet', options: {} }
]

const defaultOptions: UseAssociationSearchOptions = {
  contextType: EAssociationContextType.DECLARED_ACTIVITY,
  associatedContextType: EAssociationContextType.TRACE
}

const getFirstAssociableType = (contextType: EAssociationContextType) => getAssociableContextTypes(contextType)[0]!

function getSearchResults (associatedContextType: EAssociationContextType, filter = DEFAULT_ASSOCIATION_SEARCH_FILTER, keyword?: string): AssociationSearchResultDTO[] {
  return createMockedAssociationSearchResponse(associatedContextType, {
    keyword,
    isAssociated: ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].filterable ? ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED[filter] : undefined,
    page: 0,
    pageSize: ASSOCIATION_SEARCH_PAGE_SIZE
  }).data
}

function toState ({ id, disabled, limitReached }: AssociationSearchResultDTO) {
  return {
    id,
    disabled,
    limitReached,
    disabledTooltip: limitReached ? LIMIT_REACHED_TOOLTIP : DISABLED_TOOLTIP
  }
}

function toBlockedState ({ id }: AssociationSearchResultDTO) {
  return {
    id,
    disabled: true,
    limitReached: false,
    disabledTooltip: SELECTION_LIMIT_REACHED_TOOLTIP
  }
}

function toExpectedAssociation ({ id, title, category, description }: AssociationSearchResultDTO) {
  return {
    id,
    title,
    category,
    description: description ?? (category ? expect.any(String) : undefined)
  }
}

function pickMapped ({ id, title, category, disabled, limitReached }: Association | AssociationSearchResultDTO) {
  return {
    id,
    title,
    category,
    disabled,
    limitReached
  }
}

const defaultSearchResult = createMockedTraceSearchResults()[0]!
const FILTERABLE_RESULTS = getSearchResults(FILTERABLE_TYPE)
const KEYWORD = FILTERABLE_RESULTS[1]!.title
const OTHER_KEYWORD = FILTERABLE_RESULTS[2]!.title
const TRACE_IDS = FILTERABLE_RESULTS.map(({ id }) => id)
const OTHER_LIMITED_TYPE = getAssociableContextTypes(EAssociationContextType.DECLARED_ACTIVITY).find(type => type !== EAssociationContextType.TRACE)!

const traceLimit = createMockedAssociationLimits(EAssociationContextType.DECLARED_ACTIVITY).find(({ associatedContextType }) => associatedContextType === EAssociationContextType.TRACE)!
const PLACES_LEFT = traceLimit.remaining

BddTest().given('the useAssociationSearchResults composable', () => {
  let composable: ReturnType<typeof useAssociationSearchResults>
  let unmount: () => void

  const mountWith = () => {
    const mounted = mountComposable(() => useAssociationSearchResults(), { useI18n: true })
    composable = mounted.result
    unmount = mounted.unmount
  }

  const mapResult = (contextType: EAssociationContextType, overrides: Partial<AssociationSearchResultDTO> = {}) => composable.toAssociation({ ...defaultSearchResult, ...overrides }, contextType)

  beforeEach(() => {
    mountWith()
  })

  afterEach(() => {
    unmount()
  })

  CONTEXT_TYPES.forEach((contextType) => {
    const results = getSearchResults(contextType)

    BddTest().when(`the search results of the ${contextType} are mapped`, () => {
      BddTest().then('it should keep the id, the title, the category and the flags of every result, in order', () => {
        expect(composable.toAssociations(results, contextType).map(pickMapped)).toEqual(results.map(pickMapped))
      })
    })
  })

  TRANSLATED_CATEGORIES.forEach(({ contextType, category, description }) => {
    BddTest().when(`a ${contextType} search result of category ${category} is mapped`, () => {
      let association: Association

      beforeEach(() => {
        association = mapResult(contextType, { category })
      })

      BddTest().then('it should keep the raw category', () => {
        expect(association.category).toBe(category)
      })

      BddTest().then('it should describe the association with the translated category', () => {
        expect(association.description).toBe(description)
      })
    })
  })

  TYPES_WITHOUT_LABELS.forEach((contextType) => {
    BddTest().when(`a ${contextType} search result has a category, which has no translation`, () => {
      BddTest().then('it should use the raw category as description', () => {
        expect(mapResult(contextType, { category: RAW_CATEGORY }).description).toBe(RAW_CATEGORY)
      })
    })
  })

  BddTest().when('a search result has a description provided by the API', () => {
    BddTest().then('it should use it rather than the category', () => {
      expect(mapResult(EAssociationContextType.TRACE, { category: RAW_CATEGORY, description: API_DESCRIPTION }).description).toBe(API_DESCRIPTION)
    })
  })

  BddTest().when('a search result has no category', () => {
    BddTest().then('it should not set any category nor description, whatever the context type', () => {
      CONTEXT_TYPES.forEach((contextType) => {
        const { category, description } = mapResult(contextType)
        expect(category).toBeUndefined()
        expect(description).toBeUndefined()
      })
    })
  })

  BddTest().when('there is no search result', () => {
    BddTest().then('it should return an empty list', () => {
      expect(composable.toAssociations([], EAssociationContextType.TRACE)).toEqual([])
    })
  })
})

BddTest().given('the useAssociationSearch composable', () => {
  let composable: ReturnType<typeof useAssociationSearch>
  let queryClient: QueryClient
  let unmount: (() => void) | undefined

  const selectedIds = ref<string[]>([])

  const mountWith = (options: Partial<UseAssociationSearchOptions> = {}) => {
    const mounted = mountComposable(() => ({
      ...useAssociationSearch({
        ...defaultOptions,
        selectedIds: () => selectedIds.value,
        ...options
      }),
      queryClient: useQueryClient()
    }), {
      useTanstack: true,
      useI18n: true
    })

    composable = mounted.result
    queryClient = mounted.result.queryClient
    unmount = mounted.unmount
  }

  const getAssociations = () => composable.associations.value
  const getAssociationDetails = () => getAssociations().map(({ id, title, category, description }) => ({ id, title, category, description }))
  const getAssociationStates = () => getAssociations().map(({ id, disabled, limitReached, disabledTooltip }) => ({ id, disabled, limitReached, disabledTooltip }))

  const expectAssociations = (associatedContextType: EAssociationContextType, filter?: AssociationSearchFilter, keyword?: string) => {
    expect(getAssociationDetails()).toEqual(getSearchResults(associatedContextType, filter, keyword).map(toExpectedAssociation))
  }

  const expectNothingBlocked = (associatedContextType = EAssociationContextType.TRACE) => {
    expect(getAssociationStates()).toEqual(getSearchResults(associatedContextType).map(toState))
  }

  const expectBlockedExcept = (selected: string[], associatedContextType = EAssociationContextType.TRACE) => {
    expect(getAssociationStates()).toEqual(getSearchResults(associatedContextType).map(result => result.disabled || selected.includes(result.id) ? toState(result) : toBlockedState(result)))
  }

  const expectNoErrorMessage = () => {
    expect(mockAddErrorMessage).not.toHaveBeenCalled()
  }

  const expectErrorMessage = async (description: string) => {
    await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalledWith({
      title: GENERIC_ERROR_TITLE,
      description
    }))
  }

  const waitForQueries = async () => {
    await nextTick()
    await vi.waitFor(() => expect(queryClient.isFetching()).toBe(0))
  }

  const waitForSearch = async () => {
    await nextTick()
    await vi.waitFor(() => expect(composable.isLoading.value).toBe(false))
  }

  const waitForAssociations = async (associatedContextType: EAssociationContextType, filter?: AssociationSearchFilter, keyword?: string) => {
    await vi.waitFor(() => expectAssociations(associatedContextType, filter, keyword))
  }

  const selectTraces = (count: number) => {
    selectedIds.value = TRACE_IDS.slice(0, count)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    selectedIds.value = []
  })

  afterEach(() => {
    unmount?.()
    unmount = undefined
  })

  CONTEXT_TYPES.forEach((associatedContextType) => {
    const contextType = getFirstAssociableType(associatedContextType)

    ELEMENTS.forEach(({ name, options }) => {
      BddTest().when(`the ${associatedContextType} of ${name} of type ${contextType} are searched`, () => {
        beforeEach(async () => {
          mountWith({
            contextType,
            associatedContextType,
            ...options
          })
          await waitForQueries()
        })

        BddTest().then('it should map the search results to associations with their translated category', () => {
          expectAssociations(associatedContextType)
        })

        BddTest().then('it should be filterable only when this context type can be filtered on its association status', () => {
          expect(composable.isFilterable.value).toBe(!!ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].filterable)
        })

        BddTest().then('it should not block anything while nothing is selected', () => {
          expectNothingBlocked(associatedContextType)
        })

        BddTest().then('it should not display any error message', () => {
          expectNoErrorMessage()
        })
      })
    })
  })

  BddTest().when('the composable is mounted without any search query nor filter', () => {
    beforeEach(async () => {
      mountWith()
      await waitForQueries()
    })

    BddTest().then('it should expose an empty search query and the default filter', () => {
      expect(composable.searchQuery.value).toBe('')
      expect(composable.searchFilter.value).toBe(DEFAULT_ASSOCIATION_SEARCH_FILTER)
    })
  })

  BddTest().when('the search is loading', () => {
    beforeEach(() => {
      mountWith({
        elementId: ELEMENT_ID
      })
    })

    afterEach(async () => {
      await waitForQueries()
    })

    BddTest().then('it should be loading, without any association yet', () => {
      expect(composable.isLoading.value).toBe(true)
      expect(getAssociations()).toEqual([])
    })
  })

  BddTest().when('the search is disabled', () => {
    const enabled = ref(false)

    beforeEach(async () => {
      enabled.value = false
      mountWith({
        elementId: ELEMENT_ID,
        enabled: () => enabled.value
      })
      await flushPromises()
    })

    BddTest().then('it should not search anything', () => {
      expect(composable.isLoading.value).toBe(false)
      expect(getAssociations()).toEqual([])
    })

    BddTest().and('the search gets enabled', () => {
      beforeEach(() => {
        enabled.value = true
      })

      BddTest().then('it should search the elements', async () => {
        await waitForAssociations(EAssociationContextType.TRACE)
      })
    })
  })

  FILTERS.forEach((filter) => {
    BddTest().when(`the ${FILTERABLE_TYPE} are searched with the ${filter} filter`, () => {
      const searchFilter = ref<AssociationSearchFilter>(filter)

      beforeEach(async () => {
        mountWith({
          associatedContextType: FILTERABLE_TYPE,
          searchFilter
        })
        await waitForQueries()
      })

      BddTest().then('it should expose the given search filter', () => {
        expect(composable.searchFilter).toBe(searchFilter)
      })

      BddTest().then('it should only search the matching elements', () => {
        expectAssociations(FILTERABLE_TYPE, filter)
      })
    })
  })

  OTHER_FILTERS.forEach((filter) => {
    BddTest().when(`the search filter changes to ${filter}`, () => {
      const searchFilter = ref<AssociationSearchFilter>(DEFAULT_ASSOCIATION_SEARCH_FILTER)

      beforeEach(async () => {
        mountWith({
          associatedContextType: FILTERABLE_TYPE,
          searchFilter
        })
        await waitForQueries()
        searchFilter.value = filter
      })

      BddTest().then('it should search the elements matching the new filter', async () => {
        await waitForAssociations(FILTERABLE_TYPE, filter)
      })
    })
  })

  BddTest().when('a keyword surrounded by spaces is searched', () => {
    const searchQuery = ref('')

    beforeEach(async () => {
      searchQuery.value = `  ${KEYWORD}  `
      mountWith({
        associatedContextType: FILTERABLE_TYPE,
        searchQuery
      })
      await waitForQueries()
    })

    BddTest().then('it should expose the given search query', () => {
      expect(composable.searchQuery).toBe(searchQuery)
    })

    BddTest().then('it should only search the matching elements', () => {
      expectAssociations(FILTERABLE_TYPE, undefined, KEYWORD)
    })

    BddTest().and('the search query changes', () => {
      beforeEach(() => {
        searchQuery.value = ` ${OTHER_KEYWORD} `
      })

      BddTest().then('it should search the elements matching the new keyword', async () => {
        await waitForAssociations(FILTERABLE_TYPE, undefined, OTHER_KEYWORD)
      })
    })

    BddTest().and('the search query becomes blank', () => {
      beforeEach(() => {
        searchQuery.value = '   '
      })

      BddTest().then('it should search every element again', async () => {
        await waitForAssociations(FILTERABLE_TYPE)
      })
    })
  })

  BddTest().when('the declared activity can only receive a few more traces', () => {
    beforeEach(async () => {
      mountWith({
        elementId: ELEMENT_ID
      })
      await waitForQueries()
    })

    BddTest().then('it should not block any trace while nothing is selected', () => {
      expectNothingBlocked()
    })

    BddTest().and('fewer traces than the places left are selected', () => {
      beforeEach(() => {
        selectTraces(PLACES_LEFT - 1)
      })

      BddTest().then('it should still let the student select the other traces', () => {
        expectNothingBlocked()
      })
    })

    BddTest().and('as many traces as the places left are selected', () => {
      beforeEach(() => {
        selectTraces(PLACES_LEFT)
      })

      BddTest().then('it should keep the selected traces selectable and block the others, with the reason', () => {
        expectBlockedExcept(TRACE_IDS.slice(0, PLACES_LEFT))
      })

      BddTest().and('one of the selected traces gets deselected', () => {
        beforeEach(() => {
          selectTraces(PLACES_LEFT - 1)
        })

        BddTest().then('it should let the student select the other traces again', () => {
          expectNothingBlocked()
        })
      })
    })
  })

  BddTest().when('no place is left on the declared activity', () => {
    beforeEach(async () => {
      mountWith({
        elementId: LIMIT_REACHED_ELEMENT_ID
      })
      await waitForQueries()
    })

    BddTest().then('it should not let the student select any trace, even with an empty selection', () => {
      expectBlockedExcept([])
    })
  })

  BddTest().when('the selection fills the places left among elements unavailable for other reasons', () => {
    const selectableActivity = getSearchResults(EAssociationContextType.DECLARED_ACTIVITY).find(({ disabled }) => !disabled)!
    const limits: AssociationLimitDTO[] = [{ associatedContextType: EAssociationContextType.DECLARED_ACTIVITY, max: 1, remaining: 1 }]

    beforeEach(async () => {
      server.use(createGetAssociationLimitsHandler(limits))
      selectedIds.value = [selectableActivity.id]
      mountWith({
        contextType: EAssociationContextType.TRACE,
        elementId: ELEMENT_ID,
        associatedContextType: EAssociationContextType.DECLARED_ACTIVITY
      })
      await waitForQueries()
    })

    BddTest().then('it should explain why each element cannot be selected, the most specific reason first', () => {
      expectBlockedExcept([selectableActivity.id], EAssociationContextType.DECLARED_ACTIVITY)
    })
  })

  BddTest().when('the limits of the element are not known yet', () => {
    beforeEach(async () => {
      selectTraces(PLACES_LEFT)
      mountWith({
        elementId: INFINITE_LOADING_ID
      })
      await waitForSearch()
    })

    BddTest().then('it should not block any trace, since nothing is known about the places left', () => {
      expectNothingBlocked()
    })
  })

  BddTest().when('the limits of the element cannot be read', () => {
    beforeEach(async () => {
      selectTraces(PLACES_LEFT)
      mountWith({
        elementId: INTERNAL_ERROR_ID
      })
      await waitForQueries()
    })

    BddTest().then('it should not block any trace and leave the API to refuse what is not allowed', () => {
      expectNothingBlocked()
    })

    BddTest().then('it should not display any error message', () => {
      expectNoErrorMessage()
    })
  })

  BddTest().when('every trace is selected for an element that does not exist yet', () => {
    beforeEach(async () => {
      selectTraces(TRACE_IDS.length)
      mountWith()
      await waitForQueries()
    })

    BddTest().then('it should not block any trace, since the places left are only known for an existing element', () => {
      expectNothingBlocked()
    })
  })

  BddTest().when('the places left are all selected and the associated context type changes', () => {
    const associatedContextType = ref<EAssociationContextType>(EAssociationContextType.TRACE)

    beforeEach(async () => {
      associatedContextType.value = EAssociationContextType.TRACE
      selectTraces(PLACES_LEFT)
      mountWith({
        elementId: ELEMENT_ID,
        associatedContextType
      })
      await waitForQueries()
    })

    BddTest().then('it should block the other traces', () => {
      expectBlockedExcept(TRACE_IDS.slice(0, PLACES_LEFT))
    })

    BddTest().and('another context type is searched instead', () => {
      beforeEach(() => {
        associatedContextType.value = OTHER_LIMITED_TYPE
      })

      BddTest().then('it should not block any of its elements, since only the traces are limited', async () => {
        await vi.waitFor(() => expectNothingBlocked(OTHER_LIMITED_TYPE))
      })
    })
  })

  BddTest().when('the element id changes', () => {
    const elementId = ref(ELEMENT_ID)

    beforeEach(async () => {
      elementId.value = ELEMENT_ID
      mountWith({
        elementId: () => elementId.value
      })
      await waitForQueries()
    })

    BddTest().then('it should not block any trace while places are left', () => {
      expectNothingBlocked()
    })

    BddTest().and('the new element has no place left', () => {
      beforeEach(() => {
        elementId.value = LIMIT_REACHED_ELEMENT_ID
      })

      BddTest().then('it should use the limits of the new element', async () => {
        await vi.waitFor(() => expectBlockedExcept([]))
      })
    })
  })

  BddTest().when('the search of an existing element fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationErrorHandler)
      mountWith({
        elementId: ELEMENT_ID
      })
      await waitForQueries()
    })

    BddTest().then('it should display an error message', async () => {
      await expectErrorMessage(SERVER_ERROR_DESCRIPTION)
    })

    BddTest().then('it should not return any association', () => {
      expect(getAssociations()).toEqual([])
    })
  })

  BddTest().when('the search of an element that does not exist yet fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationWithNewElementErrorHandler)
      mountWith()
      await waitForQueries()
    })

    BddTest().then('it should display an error message', async () => {
      await expectErrorMessage(SERVER_ERROR_DESCRIPTION)
    })
  })

  BddTest().when('the searched element is not found', () => {
    beforeEach(async () => {
      mountWith({
        contextType: EAssociationContextType.TRACE,
        elementId: invalidTraceId,
        associatedContextType: getFirstAssociableType(EAssociationContextType.TRACE)
      })
      await waitForQueries()
    })

    BddTest().then('it should display the translated API error message', async () => {
      await expectErrorMessage(TRACE_NOT_FOUND_DESCRIPTION)
    })
  })

  BddTest().when('a failed search succeeds again with another keyword', () => {
    const searchQuery = ref('')

    beforeEach(async () => {
      searchQuery.value = INVALID_KEYWORD
      mountWith({
        associatedContextType: FILTERABLE_TYPE,
        searchQuery
      })
      await waitForQueries()
      await expectErrorMessage(SERVER_ERROR_DESCRIPTION)
    })

    BddTest().then('it should return the new results without displaying any other error message', async () => {
      searchQuery.value = KEYWORD
      await waitForAssociations(FILTERABLE_TYPE, undefined, KEYWORD)

      expect(mockAddErrorMessage).toHaveBeenCalledOnce()
    })
  })
})
