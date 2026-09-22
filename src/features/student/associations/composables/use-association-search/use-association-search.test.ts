import type { Association } from '@/features/student/associations/types/associations.types'
import { searchForAssociationErrorHandler, searchForAssociationWithNewElementErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  EActivityThematic,
  EAssociationContextType,
  EExperienceType,
  EExternalSkillType,
  getSearchForAssociationUrl,
  getSearchForAssociationWithNewElementUrl
} from '@/api/avenir-esr'
import {
  useAssociationSearch,
  type UseAssociationSearchOptions,
  useAssociationSearchResults
} from '@/features/student/associations/composables/use-association-search/use-association-search'
import { ASSOCIATION_SEARCH_PAGE_SIZE } from '@/features/student/associations/constants/associations.constants'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from 'vitest'

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

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const SERVER_ERROR_DESCRIPTION = 'Erreur serveur interne'

BddTest().given('the useAssociationSearchResults composable', () => {
  let composable: ReturnType<typeof useAssociationSearchResults>
  let unmount: () => void

  beforeEach(() => {
    const mounted = mountComposable(() => useAssociationSearchResults(), {
      useI18n: true
    })
    composable = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount()
  })

  BddTest().when('a declared activity search result is mapped', () => {
    let association: Association

    beforeEach(() => {
      association = composable.toAssociation({
        id: 'activity-1',
        title: 'Mon activité',
        category: EActivityThematic.PROGRAMS,
        disabled: false
      }, EAssociationContextType.DECLARED_ACTIVITY)
    })

    BddTest().then('it should map the id, the title and the disabled flag', () => {
      expect(association.id).toBe('activity-1')
      expect(association.title).toBe('Mon activité')
      expect(association.disabled).toBe(false)
    })

    BddTest().then('it should keep the raw category', () => {
      expect(association.category).toBe(EActivityThematic.PROGRAMS)
    })

    BddTest().then('it should describe the association with the translated thematic', () => {
      expect(association.description).toBe('Mes formations')
    })
  })

  BddTest().when('a declared skill search result is mapped', () => {
    BddTest().then('it should describe the association with the translated declared skill type', () => {
      const association = composable.toAssociation({
        id: 'skill-1',
        title: 'Compétence Rome',
        category: EExternalSkillType.ROME4,
        disabled: false
      }, EAssociationContextType.DECLARED_SKILL)

      expect(association.category).toBe(EExternalSkillType.ROME4)
      expect(association.description).toBe('Rome 4.0')
    })
  })

  BddTest().when('a declared experience search result is mapped', () => {
    BddTest().then('it should describe the association with the translated experience type', () => {
      const association = composable.toAssociation({
        id: 'experience-1',
        title: 'Mon expérience',
        category: EExperienceType.PERSONAL,
        disabled: false
      }, EAssociationContextType.DECLARED_EXPERIENCE)

      expect(association.category).toBe(EExperienceType.PERSONAL)
      expect(association.description).toBe('Expérience personnelle')
    })
  })

  BddTest().when('a trace search result is mapped', () => {
    BddTest().then('it should not set any description since traces have no category label', () => {
      const association = composable.toAssociation({
        id: 'trace-1',
        title: 'Ma trace',
        disabled: true
      }, EAssociationContextType.TRACE)

      expect(association).toEqual({
        id: 'trace-1',
        title: 'Ma trace',
        disabled: true,
        category: undefined,
        description: undefined
      })
    })

    BddTest().then('it should keep the raw category without translating it when the API returns one', () => {
      const association = composable.toAssociation({
        id: 'trace-2',
        title: 'Ma trace catégorisée',
        category: 'SOME_CATEGORY',
        disabled: false
      }, EAssociationContextType.TRACE)

      expect(association.category).toBe('SOME_CATEGORY')
      expect(association.description).toBeUndefined()
    })
  })

  BddTest().when('a search result without category is mapped', () => {
    BddTest().then('it should not set any category nor description', () => {
      const association = composable.toAssociation({
        id: 'activity-5',
        title: 'Activité sans thématique',
        disabled: false
      }, EAssociationContextType.DECLARED_ACTIVITY)

      expect(association.category).toBeUndefined()
      expect(association.description).toBeUndefined()
    })
  })

  BddTest().when('several search results are mapped at once', () => {
    BddTest().then('it should map every search result in order', () => {
      const associations = composable.toAssociations([
        { id: 'skill-1', title: 'Compétence Rome', category: EExternalSkillType.ROME4, disabled: false },
        { id: 'skill-2', title: 'Compétence Casoc', category: EExternalSkillType.CASOC, disabled: true }
      ], EAssociationContextType.DECLARED_SKILL)

      expect(associations).toEqual([
        { id: 'skill-1', title: 'Compétence Rome', category: EExternalSkillType.ROME4, description: 'Rome 4.0', disabled: false },
        { id: 'skill-2', title: 'Compétence Casoc', category: EExternalSkillType.CASOC, description: 'Casoc onisep', disabled: true }
      ])
    })

    BddTest().then('it should return an empty list when there is no search result', () => {
      expect(composable.toAssociations([], EAssociationContextType.DECLARED_SKILL)).toEqual([])
    })
  })
})

BddTest().given('the useAssociationSearch composable', () => {
  let composable: ReturnType<typeof useAssociationSearch>
  let unmount: (() => void) | undefined

  const searchRequests: URL[] = []

  const recordSearchRequest = ({ request }: { request: Request }) => {
    const url = new URL(request.url)

    if (url.pathname.includes('/me/associations/') && url.pathname.endsWith('/search')) {
      searchRequests.push(url)
    }
  }

  const getApiPath = (url: URL) => url.pathname.slice(url.pathname.indexOf('/me/associations/'))

  const getLastSearchRequest = () => searchRequests.at(-1)!

  const getAssociationIds = () => composable.associations.value.map(({ id }) => id)

  const mountSearch = (options: UseAssociationSearchOptions) => {
    const mounted = mountComposable(() => useAssociationSearch(options), {
      useTanstack: true,
      useI18n: true
    })
    composable = mounted.result
    unmount = mounted.unmount
  }

  const waitForSearchRequests = async (count: number) => {
    await vi.waitFor(() => {
      expect(searchRequests).toHaveLength(count)
      expect(composable.isLoading.value).toBe(false)
    })
  }

  beforeAll(() => {
    server.events.on('request:start', recordSearchRequest)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    searchRequests.length = 0
  })

  afterEach(() => {
    unmount?.()
    unmount = undefined
  })

  afterAll(() => {
    server.events.removeListener('request:start', recordSearchRequest)
  })

  BddTest().when('the element to associate already exists', () => {
    beforeEach(async () => {
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should search through the search for association endpoint of the element', () => {
      expect(getApiPath(getLastSearchRequest())).toBe(getSearchForAssociationUrl(
        EAssociationContextType.DECLARED_ACTIVITY,
        'activity-1',
        EAssociationContextType.DECLARED_SKILL
      ))
    })

    BddTest().then('it should request the first page with the association search page size', () => {
      const { searchParams } = getLastSearchRequest()

      expect(searchParams.get('page')).toBe('0')
      expect(searchParams.get('pageSize')).toBe(String(ASSOCIATION_SEARCH_PAGE_SIZE))
      expect(searchParams.has('keyword')).toBe(false)
    })

    BddTest().then('it should map the search results to associations with their translated category', () => {
      expect(composable.associations.value).toEqual([
        { id: 'skill-search-1', title: 'Gestion de projet agile', category: EExternalSkillType.ROME4, description: 'Rome 4.0', disabled: false },
        { id: 'skill-search-2', title: 'Communication interpersonnelle', category: EExternalSkillType.XXI, description: 'XXIᵉ onisep', disabled: false },
        { id: 'skill-search-3', title: 'Analyse de données', category: EExternalSkillType.ROME4, description: 'Rome 4.0', disabled: true }
      ])
    })

    BddTest().then('it should expose default search query and filter', () => {
      expect(composable.searchQuery.value).toBe('')
      expect(composable.searchFilter.value).toBe(AssociationSearchFilter.UNASSOCIATED)
    })

    BddTest().then('it should not display any error message', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the element id is given as a getter', () => {
    const elementId = ref('activity-1')

    beforeEach(async () => {
      elementId.value = 'activity-1'
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: () => elementId.value,
        associatedContextType: EAssociationContextType.TRACE
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should search with the current element id', () => {
      expect(getApiPath(getLastSearchRequest())).toBe(getSearchForAssociationUrl(
        EAssociationContextType.DECLARED_ACTIVITY,
        'activity-1',
        EAssociationContextType.TRACE
      ))
    })

    BddTest().then('it should search again when the element id changes', async () => {
      elementId.value = 'activity-2'
      await waitForSearchRequests(2)

      expect(getApiPath(getLastSearchRequest())).toBe(getSearchForAssociationUrl(
        EAssociationContextType.DECLARED_ACTIVITY,
        'activity-2',
        EAssociationContextType.TRACE
      ))
    })
  })

  BddTest().when('the element to associate does not exist yet', () => {
    beforeEach(async () => {
      mountSearch({
        contextType: EAssociationContextType.TRACE,
        associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should search through the search for association with new element endpoint', () => {
      expect(getApiPath(getLastSearchRequest())).toBe(getSearchForAssociationWithNewElementUrl(
        EAssociationContextType.TRACE,
        EAssociationContextType.DECLARED_EXPERIENCE
      ))
    })

    BddTest().then('it should map the search results to associations with their translated category', () => {
      expect(composable.associations.value).toEqual([
        { id: 'experience-search-1', title: 'Définir ses valeurs', category: EExperienceType.PERSONAL, description: 'Expérience personnelle', disabled: false },
        { id: 'experience-search-2', title: 'Explorer ses pistes d\'orientation', category: EExperienceType.PROFESSIONAL, description: 'Expérience professionnelle', disabled: false },
        { id: 'experience-search-3', title: 'Développeur Web Full Stack', category: EExperienceType.PROFESSIONAL, description: 'Expérience professionnelle', disabled: true }
      ])
    })
  })

  BddTest().when('the search is loading', () => {
    beforeEach(() => {
      mountSearch({
        contextType: EAssociationContextType.TRACE,
        associatedContextType: EAssociationContextType.DECLARED_SKILL
      })
    })

    BddTest().then('it should be loading until the search results are received', async () => {
      expect(composable.isLoading.value).toBe(true)
      expect(composable.associations.value).toEqual([])

      await waitForSearchRequests(1)

      expect(composable.associations.value).toHaveLength(3)
    })
  })

  BddTest().when('the search is disabled', () => {
    const enabled = ref(false)

    beforeEach(async () => {
      enabled.value = false
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        enabled: () => enabled.value
      })
      await flushPromises()
    })

    BddTest().then('it should not search anything', () => {
      expect(searchRequests).toHaveLength(0)
      expect(composable.isLoading.value).toBe(false)
      expect(composable.associations.value).toEqual([])
    })

    BddTest().then('it should search once enabled', async () => {
      enabled.value = true
      await waitForSearchRequests(1)

      expect(composable.associations.value).toHaveLength(3)
    })
  })

  BddTest().when('a keyword surrounded by spaces is searched', () => {
    const searchQuery = ref('')

    beforeEach(async () => {
      searchQuery.value = '  valeurs  '
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.TRACE,
        searchQuery
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should expose the given search query', () => {
      expect(composable.searchQuery).toBe(searchQuery)
    })

    BddTest().then('it should search the trimmed keyword', () => {
      expect(getLastSearchRequest().searchParams.get('keyword')).toBe('valeurs')
    })

    BddTest().then('it should search again with the new trimmed keyword when the search query changes', async () => {
      searchQuery.value = ' numéro 3 '
      await waitForSearchRequests(2)

      expect(getLastSearchRequest().searchParams.get('keyword')).toBe('numéro 3')
      await vi.waitFor(() => {
        expect(getAssociationIds()).toEqual(['trace-non-associee3'])
      })
    })

    BddTest().then('it should not send any keyword when the search query becomes blank', async () => {
      searchQuery.value = '   '
      await waitForSearchRequests(2)

      expect(getLastSearchRequest().searchParams.has('keyword')).toBe(false)
    })
  })

  BddTest().when('the searched context type can be filtered on the association status', () => {
    const searchFilter = ref(AssociationSearchFilter.UNASSOCIATED)

    const mountTraceSearch = async (filter?: AssociationSearchFilter) => {
      searchFilter.value = filter ?? AssociationSearchFilter.UNASSOCIATED
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.TRACE,
        ...(filter ? { searchFilter } : {})
      })
      await waitForSearchRequests(1)
    }

    BddTest().then('it should be filterable', async () => {
      await mountTraceSearch()

      expect(composable.isFilterable).toBe(true)
    })

    BddTest().then('it should only search the unassociated elements by default', async () => {
      await mountTraceSearch()

      expect(getLastSearchRequest().searchParams.get('isAssociated')).toBe('false')
      expect(getAssociationIds()).toEqual([
        'trace-non-associee1',
        'trace-non-associee2',
        'trace-non-associee3',
        'trace-non-associee4',
        'trace-non-associee5'
      ])
    })

    BddTest().then('it should only search the associated elements with the associated filter', async () => {
      await mountTraceSearch(AssociationSearchFilter.ASSOCIATED)

      expect(composable.searchFilter).toBe(searchFilter)
      expect(getLastSearchRequest().searchParams.get('isAssociated')).toBe('true')
      expect(getAssociationIds()).toEqual([
        'trace-associee1',
        'trace-associee2',
        'trace-associee3',
        'trace-associee4',
        'trace-associee5'
      ])
    })

    BddTest().then('it should search every element without the association status with the all filter', async () => {
      await mountTraceSearch(AssociationSearchFilter.ALL)

      expect(getLastSearchRequest().searchParams.has('isAssociated')).toBe(false)
      expect(composable.associations.value).toHaveLength(10)
    })

    BddTest().then('it should search again when the filter changes', async () => {
      await mountTraceSearch(AssociationSearchFilter.UNASSOCIATED)

      searchFilter.value = AssociationSearchFilter.ASSOCIATED
      await waitForSearchRequests(2)

      expect(getLastSearchRequest().searchParams.get('isAssociated')).toBe('true')
      await vi.waitFor(() => {
        expect(getAssociationIds().every(id => id.startsWith('trace-associee'))).toBe(true)
      })
    })
  })

  BddTest().when('the searched context type cannot be filtered on the association status', () => {
    beforeEach(async () => {
      mountSearch({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        searchFilter: ref(AssociationSearchFilter.ASSOCIATED)
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should not be filterable', () => {
      expect(composable.isFilterable).toBe(false)
    })

    BddTest().then('it should never send the association status, whatever the filter', () => {
      expect(getLastSearchRequest().searchParams.has('isAssociated')).toBe(false)
    })
  })

  BddTest().when('the search of an existing element fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationErrorHandler)
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      })
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })

    BddTest().then('it should not return any association', () => {
      expect(composable.associations.value).toEqual([])
    })
  })

  BddTest().when('the search of an element that does not exist yet fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationWithNewElementErrorHandler)
      mountSearch({
        contextType: EAssociationContextType.TRACE,
        associatedContextType: EAssociationContextType.DECLARED_ACTIVITY
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      })
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })
  })

  BddTest().when('the searched element is not found', () => {
    beforeEach(async () => {
      mountSearch({
        contextType: EAssociationContextType.TRACE,
        elementId: 'INVALID_TRACE_ID',
        associatedContextType: EAssociationContextType.DECLARED_SKILL
      })
      await waitForSearchRequests(1)
    })

    BddTest().then('it should display the translated API error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: GENERIC_ERROR_TITLE,
          description: 'Trace introuvable'
        })
      })
    })
  })

  BddTest().when('a failed search succeeds again with another keyword', () => {
    const searchQuery = ref('')

    beforeEach(async () => {
      searchQuery.value = 'INVALID_KEYWORD'
      mountSearch({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        searchQuery
      })
      await waitForSearchRequests(1)
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      })
    })

    BddTest().then('it should return the new results without displaying any other error message', async () => {
      searchQuery.value = 'agile'
      await waitForSearchRequests(2)

      await vi.waitFor(() => {
        expect(getAssociationIds()).toEqual(['skill-search-1'])
      })
      expect(mockAddErrorMessage).toHaveBeenCalledOnce()
    })
  })
})
