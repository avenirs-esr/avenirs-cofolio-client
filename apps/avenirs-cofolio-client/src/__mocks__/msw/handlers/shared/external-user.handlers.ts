import type { EAuthorizationEntityType, ExternalUserDetailDTO, ExternalUserDTO, ExternalUserGlobalAuthorizationDTO, GetExternalUserAuthorizationsParams, PagedResponseContextualAuthorizationDTO } from '@/api/avenir-esr'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { http, HttpResponse } from 'msw'
import {
  createMockedGetExternalUserAuthorizationsResponse,
  createMockExternalUserAuthorizationTypes,
  fullUserGlobalAuthorization,
  mockExternalUser,
  mockExternalUserDetail,
  mockExternalUserDetailWithoutEmail,
  mockExternalUserWithoutEmail,
  staffUserGlobalAuthorization,
  studentUserGlobalAuthorization
} from '@/__mocks__/fixtures/shared/external-user.fixtures'
import {
  getGetExternalUserAuthorizationTypesUrl,
  getGetExternalUserByIdUrl,
  getGetExternalUserUrl,
  getGetGlobalAuthorizationOfExternalUserUrl

} from '@/api/avenir-esr'

const getGlobalAuthorizationOfExternalUserHandler = http.get(`*${getGetGlobalAuthorizationOfExternalUserUrl(':id')}`, async ({ params }) => {
  const id = params.id as string | undefined

  if (!id) {
    return HttpResponse.json(
      { error: 'User ID is required', code: ErrorCodes.NOT_BLANK },
      { status: 400 },
    )
  }

  if (id === 'INVALID_USER_ID') {
    return HttpResponse.json(
      { error: 'User not found', code: ErrorCodes.NOT_FOUND },
      { status: 404 },
    )
  }

  if (id === 'STAFF_ONLY_ID') {
    return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
      staffUserGlobalAuthorization,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  if (id === 'STUDENT_ONLY_ID') {
    return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
      studentUserGlobalAuthorization,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
    fullUserGlobalAuthorization,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})

const getExternalUserHander = http.get(`*${getGetExternalUserUrl(':id')}`, async ({ params }) => {
  const id = params.id as string | undefined

  if (!id) {
    return HttpResponse.json(
      { error: 'User ID is required', code: ErrorCodes.NOT_BLANK },
      { status: 400 },
    )
  }

  if (id === 'INVALID_USER_ID') {
    return HttpResponse.json(
      { error: 'User not found', code: ErrorCodes.NOT_FOUND },
      { status: 404 },
    )
  }

  if (id === 'NO_EMAIL_USER_ID') {
    return HttpResponse.json<ExternalUserDTO>(mockExternalUserWithoutEmail, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return HttpResponse.json<ExternalUserDetailDTO>(mockExternalUserDetail, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

const getExternalUserByIdHander = http.get(`*${getGetExternalUserByIdUrl(':id')}`, async ({ params }) => {
  const id = params.id as string | undefined

  if (!id) {
    return HttpResponse.json(
      { error: 'User ID is required', code: ErrorCodes.NOT_BLANK },
      { status: HttpStatusCode.BAD_REQUEST },
    )
  }

  if (id === 'INVALID_USER_ID') {
    return HttpResponse.json(
      { error: 'User not found', code: ErrorCodes.NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND },
    )
  }

  if (id === 'NO_EMAIL_USER_ID') {
    return HttpResponse.json<ExternalUserDTO>(mockExternalUserDetailWithoutEmail, {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return HttpResponse.json<ExternalUserDTO>(mockExternalUser, {
    status: HttpStatusCode.OK,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

export function createGetExternalUserAuthorizationsHandler (
  totalElements: number,
) {
  return http.get('*/back-office/external-users/:externalUserId/contextual-authorizations', async ({ params, request }) => {
    const externalUserId = params.externalUserId as string

    if (externalUserId === 'INVALID_USER_ID') {
      return HttpResponse.json(
        { error: 'User not found', code: ErrorCodes.NOT_FOUND },
        { status: HttpStatusCode.NOT_FOUND },
      )
    }

    const searchParams = new URL(request.url).searchParams

    const queryParams: GetExternalUserAuthorizationsParams = {
      page: searchParams.has('page') ? Number(searchParams.get('page')) : undefined,
      pageSize: searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
      entityType: searchParams.get('entityType') as EAuthorizationEntityType,
    }

    return HttpResponse.json<PagedResponseContextualAuthorizationDTO>(
      createMockedGetExternalUserAuthorizationsResponse(queryParams, totalElements),
      { status: HttpStatusCode.OK },
    )
  },)
}

const getExternalUserAuthorizationsHandler = createGetExternalUserAuthorizationsHandler(30)

const getExternalUserAuthorizationTypesHandler = http.get(`*${getGetExternalUserAuthorizationTypesUrl(':id')}`, async ({ params }) => {
  const id = params.id as string | undefined

  if (!id) {
    return HttpResponse.json(
      { error: 'User ID is required', code: ErrorCodes.NOT_BLANK },
      { status: HttpStatusCode.BAD_REQUEST },
    )
  }

  if (id === 'INVALID_USER_ID') {
    return HttpResponse.json(
      { error: 'User not found', code: ErrorCodes.NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND },
    )
  }

  return HttpResponse.json<EAuthorizationEntityType[]>(createMockExternalUserAuthorizationTypes(id), {
    status: HttpStatusCode.OK,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

export const externalUserHandlers = [
  getGlobalAuthorizationOfExternalUserHandler,
  getExternalUserHander,
  getExternalUserByIdHander,
  getExternalUserAuthorizationsHandler,
  getExternalUserAuthorizationTypesHandler
]
