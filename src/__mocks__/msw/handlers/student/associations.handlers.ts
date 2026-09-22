import { createMockedAssociations, createMockedAssociationSearchResponse, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { invalidTraceId } from '@/__mocks__/fixtures/student/traces.fixtures'
import { anyAssociatedContextType, anyAssociationContextType, getOptionalBooleanSearchParam } from '@/__mocks__/msw/utils'
import {
  type AssociationsCreationRequest,
  type AssociationsDTO,
  EAssociationContextType,
  EErrorCode,
  getAssociateUrl,
  getGetAssociationsUrl,
  getSearchForAssociationUrl,
  getSearchForAssociationWithNewElementUrl,
  getUnassociateUrl,
  type PagedResponseAssociationSearchResultDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { type DefaultBodyType, http, HttpResponse, type HttpResponseResolver, type PathParams } from 'msw'

interface AssociationPathParams extends PathParams {
  contextType: EAssociationContextType
  elementId: string
  associatedContextType: EAssociationContextType
}

export type AssociateRequestListener = (params: AssociationPathParams, request: AssociationsCreationRequest) => void

const NOT_FOUND_ERROR_CODES: Record<EAssociationContextType, EErrorCode> = {
  [EAssociationContextType.TRACE]: EErrorCode.TRACE_NOT_FOUND,
  [EAssociationContextType.DECLARED_ACTIVITY]: EErrorCode.ACTIVITY_NOT_FOUND,
  [EAssociationContextType.DECLARED_SKILL]: EErrorCode.DECLARED_SKILL_PROGRESS_NOT_FOUND,
  [EAssociationContextType.DECLARED_EXPERIENCE]: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND,
}

/**
 * Element ids starting with `INVALID_` answer a not found error, whatever the context type.
 */
function isUnknownElement (elementId: string) {
  return elementId.startsWith('INVALID_') || elementId === invalidTraceId
}

/**
 * Element ids ending with `WITHOUT_ASSOCIATIONS` or `WITH_NO_ASSOCIATIONS` have no association.
 */
function isElementWithoutAssociations (elementId: string) {
  return elementId.endsWith('WITHOUT_ASSOCIATIONS') || elementId.endsWith('WITH_NO_ASSOCIATIONS')
}

function notFoundResponse (contextType: EAssociationContextType) {
  return HttpResponse.json(
    { code: NOT_FOUND_ERROR_CODES[contextType], message: `${contextType} not found` },
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  )
}

function serverErrorResponse () {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  )
}

const getAssociationsUrl = `*${getGetAssociationsUrl(anyAssociationContextType, ':elementId')}`
const searchForAssociationUrl = `*${getSearchForAssociationUrl(anyAssociationContextType, ':elementId', anyAssociatedContextType)}`
const searchForAssociationWithNewElementUrl = `*${getSearchForAssociationWithNewElementUrl(anyAssociationContextType, anyAssociatedContextType)}`
const associateUrl = `*${getAssociateUrl(anyAssociationContextType, ':elementId', anyAssociatedContextType)}`
const unassociateUrl = `*${getUnassociateUrl(anyAssociationContextType, ':elementId')}`

export const getAssociationsHandler = http.get<AssociationPathParams>(getAssociationsUrl, ({ params }) => {
  const { contextType, elementId } = params

  if (isUnknownElement(elementId)) {
    return notFoundResponse(contextType)
  }

  return HttpResponse.json<AssociationsDTO>(
    isElementWithoutAssociations(elementId) ? mockedEmptyAssociations : createMockedAssociations(contextType),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getAssociationsErrorHandler = http.get(getAssociationsUrl, serverErrorResponse)

const resolveSearchForAssociation: HttpResponseResolver<AssociationPathParams, DefaultBodyType, undefined> = ({ params, request }) => {
  const { contextType, elementId, associatedContextType } = params

  if (elementId && isUnknownElement(elementId)) {
    return notFoundResponse(contextType)
  }

  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword') ?? undefined

  if (keyword === 'INVALID_KEYWORD') {
    return serverErrorResponse()
  }

  const response = createMockedAssociationSearchResponse(associatedContextType, {
    keyword,
    isAssociated: getOptionalBooleanSearchParam(url, 'isAssociated'),
    page: Number(url.searchParams.get('page') ?? 0),
    pageSize: Number(url.searchParams.get('pageSize') ?? 100)
  })

  return HttpResponse.json<PagedResponseAssociationSearchResultDTO>(response, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const searchForAssociationHandler = http.get<AssociationPathParams>(searchForAssociationUrl, resolveSearchForAssociation)

export const searchForAssociationWithNewElementHandler = http.get<AssociationPathParams>(searchForAssociationWithNewElementUrl, resolveSearchForAssociation)

export const searchForAssociationErrorHandler = http.get(searchForAssociationUrl, serverErrorResponse)

export const searchForAssociationWithNewElementErrorHandler = http.get(searchForAssociationWithNewElementUrl, serverErrorResponse)

/**
 * Creates an associate handler, optionally notified of the association requests.
 */
export function createAssociateHandler (onRequest?: AssociateRequestListener) {
  return http.post<AssociationPathParams, AssociationsCreationRequest>(associateUrl, async ({ params, request }) => {
    const { contextType, elementId } = params

    if (isUnknownElement(elementId)) {
      return notFoundResponse(contextType)
    }

    onRequest?.(params, await request.json())

    return HttpResponse.json<AssociationsDTO>(createMockedAssociations(contextType), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
}

export const associateHandler = createAssociateHandler()

export const associateErrorHandler = http.post(associateUrl, serverErrorResponse)

export const unassociateHandler = http.delete<AssociationPathParams>(unassociateUrl, ({ params }) => {
  const { contextType, elementId } = params

  if (isUnknownElement(elementId)) {
    return notFoundResponse(contextType)
  }

  return new HttpResponse(null, { status: 204 })
})

export const unassociateErrorHandler = http.delete(unassociateUrl, serverErrorResponse)

export const associationsHandlers = [
  searchForAssociationWithNewElementHandler,
  searchForAssociationHandler,
  associateHandler,
  getAssociationsHandler,
  unassociateHandler
]
