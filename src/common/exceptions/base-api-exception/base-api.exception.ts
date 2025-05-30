import type { ErrorDetails } from '@/common/exceptions/types'
import { BaseApiErrorCode } from '@/common/exceptions/error-codes'

export class BaseApiException extends Error {
  public readonly status: number
  public readonly code: BaseApiErrorCode
  public readonly method?: string
  public readonly details?: ErrorDetails

  constructor (
    message: string,
    status: number = 500,
    code: BaseApiErrorCode = BaseApiErrorCode.UNKNOWN,
    method?: string,
    details?: ErrorDetails,
  ) {
    super(message)
    Object.setPrototypeOf(this, BaseApiException.prototype)
    this.name = 'BaseApiException'
    this.status = status
    this.code = code
    this.details = details
    this.method = method
  }

  static isBaseApiError (error: unknown): error is BaseApiException {
    return error instanceof BaseApiException
  }
}
