import { EErrorCode as ApiErrors } from '#shared/api/avenir-esr/generated/types/eErrorCode'
import { BaseApiErrorCode } from '#shared/exceptions/base-api-error-codes'

export const ErrorCodes = {
  ...BaseApiErrorCode,
  ...ApiErrors
} as const

export type ErrorCode = BaseApiErrorCode | ApiErrors
