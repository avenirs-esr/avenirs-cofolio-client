import {
  BaseApiException,
  type BaseApiExceptionResponse,
} from '@/common/exceptions/base-api.exception'
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function baseApiExceptionResponseInterceptor (error: AxiosError<BaseApiExceptionResponse>) {
  const apiError: BaseApiException = BaseApiException.fromAxiosError(error)
  return Promise.reject(apiError)
}

export function userInformationInterceptor (config: InternalAxiosRequestConfig) {
  // TODO: headers that should be sent to the back using interceptor
  return config
}

httpClient.interceptors.request.use(userInformationInterceptor)
httpClient.interceptors.response.use(response => response, baseApiExceptionResponseInterceptor)

export default httpClient
