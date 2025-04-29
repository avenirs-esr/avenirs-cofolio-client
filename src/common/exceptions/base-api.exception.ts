import type { AxiosError, AxiosResponse } from 'axios'
import { BaseApiErrorCode } from '@/common/exceptions/error-codes'

export interface BaseApiExceptionResponse {
  message: string
  status: number
  code: BaseApiErrorCode
  details?: ErrorDetails
}

type ErrorDetails = Record<string, unknown>

export class BaseApiException extends Error {
  public readonly status: number
  public readonly code: BaseApiErrorCode
  public readonly details?: ErrorDetails

  constructor (
    message: string,
    status: number = 500,
    code: BaseApiErrorCode = BaseApiErrorCode.UNKNOWN,
    details?: ErrorDetails,
  ) {
    super(message)
    Object.setPrototypeOf(this, BaseApiException.prototype)
    this.name = 'BaseApiException'
    this.status = status
    this.code = code
    this.details = details
  }

  static fromAxiosError (error: AxiosError<BaseApiExceptionResponse>): BaseApiException {
    if (error.response) {
      const { response } = error
      return new BaseApiException(
        response.data.message,
        response.status,
        this.extractErrorCode(response),
        response.data.details,
      )
    }

    if (error.request) {
      return new BaseApiException('No response received from server', 0, BaseApiErrorCode.NETWORK)
    }

    return new BaseApiException(
      error.message || 'Error setting up request',
      0,
      BaseApiErrorCode.UNKNOWN,
    )
  }

  private static extractErrorCode (
    response: AxiosResponse<BaseApiExceptionResponse, unknown>,
  ): BaseApiErrorCode {
    const { status, data } = response
    switch (true) {
      case status >= 500:
        return data.code ?? BaseApiErrorCode.SERVER
      case status === 404:
        return data.code ?? BaseApiErrorCode.NOT_FOUND
      case status === 403:
        return data.code ?? BaseApiErrorCode.FORBIDDEN
      case status === 401:
        return data.code ?? BaseApiErrorCode.UNAUTHORIZED
      case status >= 400:
        return data.code ?? BaseApiErrorCode.BAD_REQUEST
      default:
        return data.code ?? BaseApiErrorCode.UNKNOWN
    }
  }

  static isBaseApiError (error: unknown): error is BaseApiException {
    return error instanceof BaseApiException
  }
}
