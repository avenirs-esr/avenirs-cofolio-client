import type { ExternalUserDetailDTO, ExternalUserDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockExternalUser, mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { getGetExternalUserByIdUrl, getGetExternalUserUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'

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
  getExternalUserHander,
  getExternalUserByIdHander
]
