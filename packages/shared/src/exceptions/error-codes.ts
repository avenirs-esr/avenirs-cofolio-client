import { EErrorCode as ApiErrors } from '#shared/api/generated/errors/eErrorCode'
import { BaseApiErrorCode } from '#shared/exceptions/base-api-error-codes'

export const ErrorCodes = {
  ...BaseApiErrorCode,
  ...ApiErrors
} as const

export type ErrorCode = BaseApiErrorCode | ApiErrors
