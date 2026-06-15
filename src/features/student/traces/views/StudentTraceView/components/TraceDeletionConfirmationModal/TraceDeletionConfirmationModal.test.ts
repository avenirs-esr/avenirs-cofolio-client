import { EFileType, ETraceAuthorType, type TraceDetailDTO } from '@/api/avenir-esr'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { useDeleteTraceMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import TraceDeletionConfirmationModal from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { useToasterStore } from '@/store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/traces/queries/use-traces.query/use-traces.query', async (importActual) => {
  const actual = await importActual<typeof import('@/features/student/traces/queries/use-traces.query/use-traces.query')>()
  return {
    ...actual,
    useDeleteTraceMutation: vi.fn()
  }
})

vi.mock('@/store', () => ({
  useToasterStore: vi.fn()
}))

BddTest().given('a trace deletion confirmation modal', () => {
  let wrapper: VueWrapper
  let onConfirmDeleteMock: () => void
  let onCloseMock: () => void
  let onErrorCallback: (error: BaseApiException) => void
  let onSuccessCallback: () => void

  const mockedUseDeleteTraceMutation: MockedFunction<typeof useDeleteTraceMutation> = vi.mocked(useDeleteTraceMutation)
  const mockedUseToasterStore: MockedFunction<typeof useToasterStore> = vi.mocked(useToasterStore)

  const mockMutate = vi.fn()
  const mockIsPending = ref(false)
  const mockAddErrorMessage = vi.fn()

  const mockedTrace: TraceDetailDTO = {
    id: 'trace1',
    title: 'Développement d\'un ePortfolio',
    link: 'https://example.com/trace1',
    isAssociated: false,
    isDeletable: true,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    programName: 'An awesome program',
    aiUseJustification: 'An awesome justification',
    authorType: ETraceAuthorType.PERSONAL,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      version: 1,
      url: 'exemple.com/image',
      uploadedAt: '2025-06-02T11:42:00.000Z',
    }
  }

  const stubs = {
    AvModal: {
      name: 'AvModal',
      props: ['opened', 'closeButtonLabel', 'confirmButtonLabel', 'isLoading'],
      emits: ['close', 'confirm'],
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

  function mountComponent (show = true) {
    wrapper = mount(TraceDeletionConfirmationModal, {
      props: {
        traceIds: [mockedTrace.id],
        title: mockedTrace.title,
        show,
        onConfirmDelete: onConfirmDeleteMock,
        onClose: onCloseMock
      },
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPending.value = false

    onConfirmDeleteMock = vi.fn()
    onCloseMock = vi.fn()

    mockedUseToasterStore.mockReturnValue({
      addErrorMessage: mockAddErrorMessage
    } as unknown as ReturnType<typeof useToasterStore>)

    mockedUseDeleteTraceMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        onErrorCallback = onError as (error: BaseApiException) => void
      }

      if (onSuccess) {
        onSuccessCallback = onSuccess as () => void
      }

      return {
        mutate: mockMutate,
        isPending: mockIsPending
      } as unknown as ReturnType<typeof useDeleteTraceMutation>
    })
  })

  BddTest().and('with show=true', () => {
    beforeEach(() => {
      mountComponent(true)
    })

    BddTest().then('it should render the modal', () => {
      expect(wrapper.findComponent({ name: 'AvModal' }).exists()).toBe(true)
    })

    BddTest().then('the modal close event should call onClose callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')

      expect(onCloseMock).toHaveBeenCalled()
    })

    BddTest().then('clicking confirm button should call mutate with trace ids', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

      expect(mockMutate).toHaveBeenCalledWith({ tracesIds: [mockedTrace.id] })
    })

    BddTest().then('clicking confirm button should call mutate with multiple trace ids', async () => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          traceIds: ['trace1', 'trace2', 'trace3'],
          title: 'Suppression de plusieurs traces',
          show: true,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })

      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

      expect(mockMutate).toHaveBeenCalledWith({
        tracesIds: ['trace1', 'trace2', 'trace3']
      })
    })
  })

  BddTest().and('with show=false', () => {
    beforeEach(() => {
      mountComponent(false)
    })

    BddTest().then('it should not render modal content', () => {
      expect(wrapper.find('.content-container').exists()).toBe(false)
    })
  })

  BddTest().when('the mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to delete trace',
      name: 'DeleteTraceError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      mountComponent(true)
      onErrorCallback(error)
    })

    BddTest().then('an error message should be added with description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: expect.any(String),
      })
    })

    BddTest().then('no callbacks should be called', () => {
      expect(onConfirmDeleteMock).not.toHaveBeenCalled()
      expect(onCloseMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the mutation fails without error message', () => {
    const error: BaseApiException = {
      message: '',
      name: 'DeleteTraceError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      mountComponent(true)
      onErrorCallback(error)
    })

    BddTest().then('an error message should be added with description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: expect.any(String),
      })
    })
  })

  BddTest().when('the mutation succeeds', () => {
    beforeEach(() => {
      mountComponent(true)
      onSuccessCallback()
    })

    BddTest().then('it should call onConfirmDelete callback', () => {
      expect(onConfirmDeleteMock).toHaveBeenCalled()
    })
  })
})
