import type { BaseApiErrorCode } from '@/common/exceptions/base-api-error-codes'

export type ErrorDetails = Record<string, unknown>

export interface BaseApiErrorBody {
  message: string
  status: number
  code: BaseApiErrorCode
  details?: ErrorDetails
}
