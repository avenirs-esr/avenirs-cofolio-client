import type { Ref } from 'vue'
import { vi } from 'vitest'

export interface MutationCallbacks {
  onSuccess?: (...args: any[]) => void
  onError?: (...args: any[]) => void
}

/**
 * Method used for creating mocked mutations
 * @returns a set of props and methods for the mocked mutation
 * @example
 * const mockUpdateProfile = createMockMutation<ReturnType<typeof useUpdateProfileMutation>>()
 * const mockedUseUpdateProfileMutation: MockedFunction<typeof useUpdateProfileMutation> = vi.mocked(useUpdateProfileMutation)
 *   beforeEach(() => {
 *     vi.clearAllMocks()
 *     mockUpdateProfile.isPending.value = false
 *
 *     mockedUseUpdateProfileMutation.mockImplementation(({ onError, onSuccess } = {}) => {
 *       if (onError) {
 *         mockUpdateProfile.callbacks.onError.mockImplementation(onError)
 *       }
 *       if (onSuccess) {
 *         mockUpdateProfile.callbacks.onSuccess.mockImplementation(onSuccess)
 *       }
 *       return mockUpdateProfile.implementation()
 *     })
 *   })
 */
export function createMockMutation<T> () {
  const mutate = vi.fn()
  const mutateAsync = vi.fn()
  const isPending: Ref<boolean> = ref(false)

  const onSuccess = vi.fn()
  const onError = vi.fn()

  function implementation ({ onError: errorCallback, onSuccess: successCallback }: MutationCallbacks = {}) {
    if (errorCallback) {
      onError.mockImplementation(errorCallback)
    }

    if (successCallback) {
      onSuccess.mockImplementation(successCallback)
    }

    return {
      mutate,
      mutateAsync,
      isPending
    } as unknown as T
  }

  return {
    mutate,
    mutateAsync,
    isPending,
    implementation,
    callbacks: {
      onSuccess,
      onError
    }
  }
}
