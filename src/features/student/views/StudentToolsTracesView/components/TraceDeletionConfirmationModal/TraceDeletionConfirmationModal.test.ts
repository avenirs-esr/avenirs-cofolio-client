import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { useDeleteTraceMutation } from '@/features/student/queries'
import TraceDeletionConfirmationModal from '@/features/student/views/StudentToolsTracesView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { useToasterStore } from '@/store'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/queries', async (importActual) => {
  const actual = await importActual<typeof import('@/features/student/queries')>()
  return {
    ...actual,
    useDeleteTraceMutation: vi.fn()
  }
})

vi.mock('@/store', () => ({
  useToasterStore: vi.fn()
}))

describe('traceDeletionConfirmationModal', () => {
  let wrapper: VueWrapper
  let onSuccessMock: () => void
  let onCloseMock: () => void
  let onErrorCallback: (error: BaseApiException) => void

  const mockedUseDeleteTraceMutation: MockedFunction<typeof useDeleteTraceMutation> = vi.mocked(useDeleteTraceMutation)
  const mockedUseToasterStore: MockedFunction<typeof useToasterStore> = vi.mocked(useToasterStore)

  const mockMutate = vi.fn()
  const mockIsPending = ref(false)
  const mockAddErrorMessage = vi.fn()

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletedAt: '2025-07-16T10:42:00.000Z'
  }

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['isLoading', 'onClick'],
      template: `
        <button
          data-testid="confirm-button"
          :disabled="isLoading"
          @click="onClick && onClick()"
        >
          <slot />
        </button>
      `
    },
    AvModal: {
      name: 'AvModal',
      props: ['opened', 'closeButtonLabel'],
      emits: ['close'],
      template: `
        <div v-if="opened" data-testid="av-modal">
          <slot name="header"></slot>
          <div class="content-container">
            <slot></slot>
          </div>
          <slot name="footer"></slot>
        </div>
      `
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPending.value = false

    onSuccessMock = vi.fn()
    onCloseMock = vi.fn()

    mockedUseToasterStore.mockReturnValue({
      addErrorMessage: mockAddErrorMessage
    } as unknown as ReturnType<typeof useToasterStore>)

    mockedUseDeleteTraceMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        onErrorCallback = onError
      }
      if (onSuccess) {
        onSuccessMock = onSuccess
      }
      return {
        mutate: mockMutate,
        isPending: mockIsPending
      } as unknown as ReturnType<typeof useDeleteTraceMutation>
    })
  })

  describe('given TraceDeletionConfirmationModal with show=true', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onSuccess: onSuccessMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
    })

    it('then it should render the modal', () => {
      expect(wrapper.findComponent({ name: 'AvModal' }).exists()).toBe(true)
    })

    it('then the modal close event should call onClose callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
      expect(onCloseMock).toHaveBeenCalled()
    })

    it('then clicking confirm button should call mutate with traceId', async () => {
      await wrapper.find('[data-testid="confirm-button"]').trigger('click')
      expect(mockMutate).toHaveBeenCalledWith({ traceId: mockedTrace.id })
    })
  })

  describe('given TraceDeletionConfirmationModal with show=false', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: false,
          onSuccess: onSuccessMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
    })

    it('then it should not render modal content', () => {
      expect(wrapper.find('.content-container').exists()).toBe(false)
    })
  })

  describe('when the mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to delete trace',
      name: 'DeleteTraceError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onSuccess: onSuccessMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
      onErrorCallback(error)
    })

    it('then an error message should be added with empty description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: 'Failed to delete trace',
        type: 'error'
      })
    })

    it('then no events should be emitted', () => {
      expect(wrapper.emitted('onTraceDelete')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('when the mutation fails without error message', () => {
    const error: BaseApiException = {
      message: '',
      name: 'DeleteTraceError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onSuccess: onSuccessMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
      onErrorCallback(error)
    })

    it('then an error message should be added with empty description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: '',
        type: 'error'
      })
    })
  })

  describe('when mutation onSuccess callback is called', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onSuccess: onSuccessMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
    })

    it('then it should call onSuccess callback', () => {
      onSuccessMock()
      expect(onSuccessMock).toHaveBeenCalled()
    })
  })
})
