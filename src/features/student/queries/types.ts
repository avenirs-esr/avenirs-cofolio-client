import type { BaseApiException } from '@/common/exceptions'

export interface CommonMutationArgs {
  onSuccess?: (data: string) => void
  onError?: (error: BaseApiException) => void
}
