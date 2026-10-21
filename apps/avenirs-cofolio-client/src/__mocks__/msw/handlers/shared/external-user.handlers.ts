import type { ExternalUserDetailDTO, ExternalUserDTO, ExternalUserGlobalAuthorizationDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockExternalUser, mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { ERole, EUniverse, getGetExternalUserByIdUrl, getGetExternalUserUrl, getGetGlobalAuthorizationOfExternalUserUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'

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

  const staffRoles = [
    ERole.ROLE_STAFF,
    ERole.ROLE_STAFF_FEEDBACK_RESPONDER,
    ERole.ROLE_STAFF_FEEDBACK_SUPERVISOR,
    ERole.ROLE_STAFF_TRACE_REVIEWER,
    ERole.ROLE_STAFF_ACTIVITY_AUTHOR,
    ERole.ROLE_STAFF_ACTIVITY_VIEWER,
  ]
  const staffUniverses = [EUniverse.STAFF]

  if (id === 'STAFF_ONLY_ID') {
    const roles = staffRoles
    const universes = staffUniverses

    return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
      { roles, universes },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const studentRoles = [
    ERole.ROLE_STUDENT,
    ERole.ROLE_STUDENT_ACTIVITY,
    ERole.ROLE_STUDENT_EMPLOYMENT_KIT,
    ERole.ROLE_STUDENT_PORTFOLIO,
    ERole.ROLE_STUDENT_REFERENCE_DATA,
    ERole.ROLE_STUDENT_FEEDBACK
  ]
  const studentUniverses = [EUniverse.STUDENT]

  if (id === 'STUDENT_ONLY_ID') {
    const roles = studentRoles
    const universes = studentUniverses

    return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
      { roles, universes },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const roles = [...staffRoles, ...studentRoles]
  const universes = [...staffUniverses, ...studentUniverses]

  return HttpResponse.json<ExternalUserGlobalAuthorizationDTO>(
    { roles, universes },
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
      { status: 400 },
    )
  }

  if (id === 'INVALID_USER_ID') {
    return HttpResponse.json(
      { error: 'User not found', code: ErrorCodes.NOT_FOUND },
      { status: 404 },
    )
  }

  return HttpResponse.json<ExternalUserDTO>(mockExternalUser, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

export const externalUserHandlers = [
  getGlobalAuthorizationOfExternalUserHandler,
  getExternalUserHander,
  getExternalUserByIdHander
]
