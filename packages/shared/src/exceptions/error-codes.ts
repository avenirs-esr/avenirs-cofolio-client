import { EErrorCode as ApiErrors } from '../api/generated/errors/eErrorCode'
import { BaseApiErrorCode } from './base-api-error-codes'

export const ErrorCodes = {
  ...BaseApiErrorCode,
  ...ApiErrors
} as const

export type ErrorCode = BaseApiErrorCode | ApiErrors
