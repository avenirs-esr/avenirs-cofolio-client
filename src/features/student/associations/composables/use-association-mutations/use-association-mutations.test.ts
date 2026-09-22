import type { AssociateRequestListener } from '@/__mocks__/msw/handlers/student/associations.handlers'
import type { AssociationsDeleteRequest } from '@/api/avenir-esr'
import { mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  associateErrorHandler,
  createAssociateHandler,
  unassociateErrorHandler
} from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { anyAssociationContextType } from '@/__mocks__/msw/utils'
import { EAssociationContextType, getAssociateUrl, getUnassociateUrl } from '@/api/avenir-esr'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient } from '@tanstack/vue-query'
import { http, HttpResponse } from 'msw'
import { mountComposable } from 'tests/utils'
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from 'vitest'

const { mockAddErrorMessage, mockAddSuccessMessage } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn(),
  mockAddSuccessMessage: vi.fn()
}))

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    })
  }
})

vi.mock('@/features/student/associations/queries/associations.queries', () => ({
  invalidateAssociationQueries: vi.fn()
}))

const mockInvalidateAssociationQueries = vi.mocked(invalidateAssociationQueries)

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const SERVER_ERROR_DESCRIPTION = 'Erreur serveur interne'

function createDeferred () {
  let resolve!: () => void
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

function createUnassociateHandler (onRequest: (request: AssociationsDeleteRequest) => void) {
  return http.delete(`*${getUnassociateUrl(anyAssociationContextType, ':elementId')}`, async ({ request }) => {
    onRequest(await request.json() as AssociationsDeleteRequest)
    return new HttpResponse(null, { status: 204 })
  })
}

BddTest().given('the useAssociationMutations composable', () => {
  let composable: ReturnType<typeof useAssociationMutations>
  let unmount: () => void

  const mockOnSuccess = vi.fn()
  const requests: { method: string, path: string }[] = []

  const recordRequest = ({ request }: { request: Request }) => {
    const { pathname } = new URL(request.url)
    const apiPathIndex = pathname.indexOf('/me/associations/')

    if (apiPathIndex >= 0) {
      requests.push({ method: request.method, path: pathname.slice(apiPathIndex) })
    }
  }

  beforeAll(() => {
    server.events.on('request:start', recordRequest)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    requests.length = 0
    mockInvalidateAssociationQueries.mockResolvedValue(undefined)

    const mounted = mountComposable(() => useAssociationMutations(), {
      useTanstack: true,
      useI18n: true
    })
    composable = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount()
  })

  afterAll(() => {
    server.events.removeListener('request:start', recordRequest)
  })

  BddTest().when('no mutation has been triggered', () => {
    BddTest().then('it should not be pending', () => {
      expect(composable.isPending.value).toBe(false)
    })
  })

  BddTest().when('elements are associated', () => {
    const mockOnAssociateRequest = vi.fn<AssociateRequestListener>()

    beforeEach(async () => {
      server.use(createAssociateHandler(mockOnAssociateRequest))

      composable.associate({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.TRACE,
        idsToAssociate: ['trace-1', 'trace-2']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    BddTest().then('it should send a POST request to the associate endpoint of the element', () => {
      expect(requests).toEqual([{
        method: 'POST',
        path: getAssociateUrl(EAssociationContextType.DECLARED_ACTIVITY, 'activity-1', EAssociationContextType.TRACE)
      }])
    })

    BddTest().then('it should send the ids to associate', () => {
      expect(mockOnAssociateRequest).toHaveBeenCalledOnce()
      expect(mockOnAssociateRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          contextType: EAssociationContextType.DECLARED_ACTIVITY,
          elementId: 'activity-1',
          associatedContextType: EAssociationContextType.TRACE
        }),
        { idsToAssociate: ['trace-1', 'trace-2'] }
      )
    })

    BddTest().then('it should invalidate the association queries of both context types', () => {
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledOnce()
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledWith(
        expect.any(QueryClient),
        [EAssociationContextType.DECLARED_ACTIVITY, EAssociationContextType.TRACE]
      )
    })

    BddTest().then('it should display the success message of the associated context type', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledOnce()
      expect(mockAddSuccessMessage).toHaveBeenCalledWith({
        timeout: 2000,
        description: 'Vous avez associé 2 traces. Retrouvez-les dans la catégorie « Mes traces associées ».'
      })
    })

    BddTest().then('it should not display any error message', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should call the success callback once', () => {
      expect(mockOnSuccess).toHaveBeenCalledOnce()
    })

    BddTest().then('it should not be pending anymore', () => {
      expect(composable.isPending.value).toBe(false)
    })
  })

  BddTest().when('a single element is associated without success callback', () => {
    beforeEach(async () => {
      composable.associate({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        idsToAssociate: ['skill-1']
      })

      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should display the singular success message of the associated context type', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith({
        timeout: 2000,
        description: '1 compétence associée avec succès'
      })
    })

    BddTest().then('it should invalidate the association queries of both context types', () => {
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledWith(
        expect.any(QueryClient),
        [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL]
      )
    })
  })

  BddTest().when('the association fails', () => {
    beforeEach(async () => {
      server.use(associateErrorHandler)

      composable.associate({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.TRACE,
        idsToAssociate: ['trace-1']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })

    BddTest().then('it should neither refresh the queries nor display a success message', () => {
      expect(mockInvalidateAssociationQueries).not.toHaveBeenCalled()
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not call the success callback', () => {
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    BddTest().then('it should not be pending anymore', async () => {
      await vi.waitFor(() => {
        expect(composable.isPending.value).toBe(false)
      })
    })
  })

  BddTest().when('the element to associate is not found', () => {
    beforeEach(async () => {
      composable.associate({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'INVALID_ACTIVITY_ID',
        associatedContextType: EAssociationContextType.TRACE,
        idsToAssociate: ['trace-1']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should display the translated API error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: 'Activité introuvable'
      })
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  BddTest().when('an association request is in progress', () => {
    const response = createDeferred()

    beforeEach(() => {
      server.use(http.post(`*${getAssociateUrl(anyAssociationContextType, ':elementId', EAssociationContextType.TRACE)}`, async () => {
        await response.promise
        return HttpResponse.json(mockedEmptyAssociations)
      }))

      composable.associate({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'activity-1',
        associatedContextType: EAssociationContextType.TRACE,
        idsToAssociate: ['trace-1']
      }, mockOnSuccess)
    })

    afterEach(() => {
      response.resolve()
    })

    BddTest().then('it should be pending until the association is done', async () => {
      await vi.waitFor(() => {
        expect(composable.isPending.value).toBe(true)
      })
      expect(mockOnSuccess).not.toHaveBeenCalled()

      response.resolve()

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
      expect(composable.isPending.value).toBe(false)
    })
  })

  BddTest().when('associations are deleted', () => {
    const mockOnUnassociateRequest = vi.fn<(request: AssociationsDeleteRequest) => void>()

    beforeEach(async () => {
      server.use(createUnassociateHandler(mockOnUnassociateRequest))

      composable.unassociate({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        associationIds: ['association-1', 'association-2']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    BddTest().then('it should send a DELETE request to the unassociate endpoint of the element', () => {
      expect(requests).toEqual([{
        method: 'DELETE',
        path: getUnassociateUrl(EAssociationContextType.TRACE, 'trace-1')
      }])
    })

    BddTest().then('it should send the ids of the associations to delete', () => {
      expect(mockOnUnassociateRequest).toHaveBeenCalledOnce()
      expect(mockOnUnassociateRequest).toHaveBeenCalledWith({ idsToDelete: ['association-1', 'association-2'] })
    })

    BddTest().then('it should invalidate the association queries of both context types', () => {
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledOnce()
      expect(mockInvalidateAssociationQueries).toHaveBeenCalledWith(
        expect.any(QueryClient),
        [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL]
      )
    })

    BddTest().then('it should display the plural deletion success message', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledOnce()
      expect(mockAddSuccessMessage).toHaveBeenCalledWith({
        timeout: 2000,
        description: 'Les associations sélectionnées ont été supprimées avec succès'
      })
    })

    BddTest().then('it should call the success callback once without displaying any error', () => {
      expect(mockOnSuccess).toHaveBeenCalledOnce()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a single association is deleted without success callback', () => {
    beforeEach(async () => {
      composable.unassociate({
        contextType: EAssociationContextType.DECLARED_EXPERIENCE,
        elementId: 'experience-1',
        associatedContextType: EAssociationContextType.TRACE,
        associationIds: ['association-1']
      })

      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should display the singular deletion success message', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith({
        timeout: 2000,
        description: 'L\'association sélectionnée a été supprimée avec succès'
      })
    })
  })

  BddTest().when('the deletion fails', () => {
    beforeEach(async () => {
      server.use(unassociateErrorHandler)

      composable.unassociate({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        associationIds: ['association-1']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledOnce()
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: SERVER_ERROR_DESCRIPTION
      })
    })

    BddTest().then('it should neither refresh the queries, display a success message nor call the success callback', () => {
      expect(mockInvalidateAssociationQueries).not.toHaveBeenCalled()
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the queries are being refreshed after a deletion', () => {
    const refresh = createDeferred()

    beforeEach(async () => {
      mockInvalidateAssociationQueries.mockReturnValue(refresh.promise)

      composable.unassociate({
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        associationIds: ['association-1']
      }, mockOnSuccess)

      await vi.waitFor(() => {
        expect(mockInvalidateAssociationQueries).toHaveBeenCalled()
      })
    })

    afterEach(() => {
      refresh.resolve()
    })

    BddTest().then('it should stay pending and wait for the refresh before notifying the student', async () => {
      expect(composable.isPending.value).toBe(true)
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()

      refresh.resolve()

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
      expect(mockAddSuccessMessage).toHaveBeenCalledOnce()
      expect(composable.isPending.value).toBe(false)
    })
  })
})
