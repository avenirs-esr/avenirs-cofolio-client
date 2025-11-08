import type { BaseApiException } from '@/common/exceptions'

export interface CommonMutationArgs {
  onSuccess?: (data: string) => void
  onError?: (error: BaseApiException) => void
}

export interface MutationArgs<TData = unknown, TVariables = unknown, TError = BaseApiException> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: TError) => void | Promise<void>
}
