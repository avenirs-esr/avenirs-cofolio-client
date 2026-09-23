import type { AssociateRequestListener } from '@/__mocks__/msw/handlers/student/associations.handlers'
import type { AssociationsDTO } from '@/api/avenir-esr'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'
import { createMockedAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { associateErrorHandler, createAssociateHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { anyAssociationContextType } from '@/__mocks__/msw/utils'
import { EAssociationContextType, EErrorCode, getAssociateUrl } from '@/api/avenir-esr'
import { BaseApiErrorCode, BaseApiException } from '@/common/exceptions'
import { useAssociationSelections } from '@/features/student/associations/composables/use-association-selections/use-association-selections'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient } from '@tanstack/vue-query'
import { http, HttpResponse } from 'msw'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

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

vi.mock('@/features/student/associations/queries/associations.queries', () => ({
  invalidateAssociationQueries: vi.fn()
}))

const mockInvalidateAssociationQueries = vi.mocked(invalidateAssociationQueries)

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const SERVER_ERROR_DESCRIPTION = 'Erreur serveur interne'
const CONTEXT_TYPE = EAssociationContextType.DECLARED_EXPERIENCE
const ELEMENT_ID = 'experience-1'

const traces = [
  { id: 'trace-1', title: 'Trace 1' },
  { id: 'trace-2', title: 'Trace 2' }
]
const skills = [{ id: 'skill-1', title: 'Compétence 1', category: 'ROME4' }]
const activities = [{ id: 'activity-1', title: 'Activité 1' }]

function createServerErrorHandler (associatedContextType: EAssociationContextType) {
  return http.post(`*${getAssociateUrl(anyAssociationContextType, ':elementId', associatedContextType)}`, () => HttpResponse.json(
    { message: 'Internal Server Error', code: BaseApiErrorCode.SERVER },
    { status: 500 }
  ))
}

BddTest().given('the useAssociationSelections composable', () => {
  let composable: ReturnType<typeof useAssociationSelections>
  let unmount: () => void

  const mockOnAssociateRequest = vi.fn<AssociateRequestListener>()

  const getAssociateRequests = () => mockOnAssociateRequest.mock.calls.map(([params, request]) => ({
    contextType: params.contextType,
    elementId: params.elementId,
    associatedContextType: params.associatedContextType,
    idsToAssociate: request.idsToAssociate
  }))

  beforeEach(() => {
    vi.clearAllMocks()
    mockInvalidateAssociationQueries.mockResolvedValue(undefined)
    server.use(createAssociateHandler(mockOnAssociateRequest))

    const mounted = mountComposable(() => useAssociationSelections(CONTEXT_TYPE), {
      useTanstack: true,
      useI18n: true
    })
    composable = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount()
  })

  BddTest().when('the ids to associate are retrieved', () => {
    BddTest().then('it should group the ids of the selected elements by context type', () => {
      expect(composable.getIdsToAssociate({
        [EAssociationContextType.TRACE]: traces,
        [EAssociationContextType.DECLARED_SKILL]: skills
      })).toEqual({
        [EAssociationContextType.TRACE]: ['trace-1', 'trace-2'],
        [EAssociationContextType.DECLARED_SKILL]: ['skill-1']
      })
    })

    BddTest().then('it should ignore the empty selections', () => {
      expect(composable.getIdsToAssociate({
        [EAssociationContextType.TRACE]: [],
        [EAssociationContextType.DECLARED_SKILL]: skills
      })).toEqual({
        [EAssociationContextType.DECLARED_SKILL]: ['skill-1']
      })
    })

    BddTest().then('it should ignore the undefined selections', () => {
      expect(composable.getIdsToAssociate({
        [EAssociationContextType.TRACE]: undefined
      })).toEqual({})
    })

    BddTest().then('it should ignore the context types that cannot be associated', () => {
      expect(composable.getIdsToAssociate({
        [EAssociationContextType.TRACE]: traces,
        [EAssociationContextType.DECLARED_ACTIVITY]: activities,
        [EAssociationContextType.DECLARED_EXPERIENCE]: [{ id: 'experience-2', title: 'Expérience 2' }]
      })).toEqual({
        [EAssociationContextType.TRACE]: ['trace-1', 'trace-2'],
        [EAssociationContextType.DECLARED_ACTIVITY]: ['activity-1']
      })
    })

    BddTest().then('it should return no ids without any selection', () => {
      expect(composable.getIdsToAssociate()).toEqual({})
      expect(composable.getIdsToAssociate({})).toEqual({})
    })
  })

  BddTest().when('the selections are associated', () => {
    let results: PromiseSettledResult<AssociationsDTO>[]

    beforeEach(async () => {
      results = await composable.associateSelections(ELEMENT_ID, {
        [EAssociationContextType.TRACE]: traces,
        [EAssociationContextType.DECLARED_SKILL]: skills,
        [EAssociationContextType.DECLARED_ACTIVITY]: activities,
        [EAssociationContextType.DECLARED_EXPERIENCE]: []
      })
    })

    BddTest().then('it should send one association request per associable context type with a selection', () => {
      expect(getAssociateRequests()).toHaveLength(3)
      expect(getAssociateRequests()).toEqual(expect.arrayContaining([
        {
          contextType: CONTEXT_TYPE,
          elementId: ELEMENT_ID,
          associatedContextType: EAssociationContextType.TRACE,
          idsToAssociate: ['trace-1', 'trace-2']
        },
        {
          contextType: CONTEXT_TYPE,
          elementId: ELEMENT_ID,
          associatedContextType: EAssociationContextType.DECLARED_SKILL,
          idsToAssociate: ['skill-1']
        },
        {
          contextType: CONTEXT_TYPE,
          elementId: ELEMENT_ID,
          associatedContextType: EAssociationContextType.DECLARED_ACTIVITY,
          idsToAssociate: ['activity-1']
        }
      ]))
    })

    BddTest().then('it should return the settled result of each request, in the selection order', () => {
      const associations = createMockedAssociations(CONTEXT_TYPE)

      expect(results).toEqual([
        { status: 'fulfilled', value: associations },
        { status: 'fulfilled', value: associations },
        { status: 'fulfilled', value: associations }
      ])
    })

    BddTest().then('it should invalidate the queries of the element and of every associated context type', () => {
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledOnce()
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledWith(
        expect.any(QueryClient),
        [
          CONTEXT_TYPE,
          EAssociationContextType.TRACE,
          EAssociationContextType.DECLARED_SKILL,
          EAssociationContextType.DECLARED_ACTIVITY
        ]
      )
    })

    BddTest().then('it should not be associating anymore', () => {
      expect(composable.isAssociating.value).toBe(false)
    })

    BddTest().then('it should not display any error message', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('nothing associable is selected', () => {
    const cases: [string, AssociationSelections | undefined][] = [
      ['no selections', undefined],
      ['empty selections', {}],
      ['only empty or non associable selections', {
        [EAssociationContextType.TRACE]: [],
        [EAssociationContextType.DECLARED_EXPERIENCE]: [{ id: 'experience-2', title: 'Expérience 2' }]
      }]
    ]

    cases.forEach(([label, selections]) => {
      BddTest().then(`with ${label}, it should neither send any request nor invalidate any query`, async () => {
        const results = await composable.associateSelections(ELEMENT_ID, selections)

        expect(results).toEqual([])
        expect(mockOnAssociateRequest).not.toHaveBeenCalled()
        expect(mockInvalidateAssociationQueries).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('some association requests fail', () => {
    let results: PromiseSettledResult<AssociationsDTO>[]

    beforeEach(async () => {
      server.use(createServerErrorHandler(EAssociationContextType.DECLARED_SKILL))

      results = await composable.associateSelections(ELEMENT_ID, {
        [EAssociationContextType.TRACE]: traces,
        [EAssociationContextType.DECLARED_SKILL]: skills
      })
    })

    BddTest().then('it should return the fulfilled and the rejected results', () => {
      expect(results).toEqual([
        { status: 'fulfilled', value: createMockedAssociations(CONTEXT_TYPE) },
        { status: 'rejected', reason: expect.any(BaseApiException) }
      ])
      expect((results[1] as PromiseRejectedResult).reason).toMatchObject({ status: 500, code: BaseApiErrorCode.SERVER })
    })

    BddTest().then('it should still invalidate the queries of every associated context type', () => {
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledWith(
        expect.any(QueryClient),
        [CONTEXT_TYPE, EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL]
      )
    })

    BddTest().then('it should not display any error message by itself', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should display one error message once the errors are notified', () => {
      composable.notifyAssociationErrors(results)

      expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })
  })

  BddTest().when('every association request fails', () => {
    let results: PromiseSettledResult<AssociationsDTO>[]

    beforeEach(async () => {
      server.use(associateErrorHandler)

      results = await composable.associateSelections(ELEMENT_ID, {
        [EAssociationContextType.TRACE]: traces,
        [EAssociationContextType.DECLARED_SKILL]: skills
      })
    })

    BddTest().then('it should return only rejected results', () => {
      expect(results.map(({ status }) => status)).toEqual(['rejected', 'rejected'])
    })

    BddTest().then('it should display one error message per failed request once the errors are notified', () => {
      composable.notifyAssociationErrors(results)

      expect(mockAddErrorMessage).toHaveBeenCalledTimes(2)
    })
  })

  BddTest().when('the association requests are in progress', () => {
    BddTest().then('it should be associating until every request is done', async () => {
      let resolveResponse!: () => void
      const response = new Promise<void>((resolve) => {
        resolveResponse = resolve
      })

      server.use(http.post(`*${getAssociateUrl(anyAssociationContextType, ':elementId', EAssociationContextType.TRACE)}`, async () => {
        await response
        return HttpResponse.json(mockedEmptyAssociations)
      }))

      const associating = composable.associateSelections(ELEMENT_ID, { [EAssociationContextType.TRACE]: traces })

      await vi.waitFor(() => {
        expect(composable.isAssociating.value).toBe(true)
      })

      resolveResponse()
      await associating

      await vi.waitFor(() => {
        expect(composable.isAssociating.value).toBe(false)
      })
    })
  })

  BddTest().when('association errors are notified', () => {
    BddTest().then('it should display one translated error message per rejected result', () => {
      composable.notifyAssociationErrors([
        { status: 'fulfilled', value: mockedEmptyAssociations },
        { status: 'rejected', reason: new BaseApiException('Trace not found', 404, EErrorCode.TRACE_NOT_FOUND) },
        { status: 'rejected', reason: new BaseApiException('Server error', 500, BaseApiErrorCode.SERVER) }
      ])

      expect(mockAddErrorMessage).toHaveBeenCalledTimes(2)
      expect(mockAddErrorMessage).toHaveBeenNthCalledWith(1, {
        title: GENERIC_ERROR_TITLE,
        description: 'Trace introuvable'
      })
      expect(mockAddErrorMessage).toHaveBeenNthCalledWith(2, {
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })

    BddTest().then('it should not display any error message when every request succeeded', () => {
      composable.notifyAssociationErrors([
        { status: 'fulfilled', value: mockedEmptyAssociations },
        { status: 'fulfilled', value: mockedEmptyAssociations }
      ])

      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not display any error message without result', () => {
      composable.notifyAssociationErrors([])

      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })
})
