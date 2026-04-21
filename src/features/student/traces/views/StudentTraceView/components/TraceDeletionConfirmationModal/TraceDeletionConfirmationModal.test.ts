import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
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
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    programName: 'An awesome program',
    aiUseJustification: 'An awesome justification',
    isGroup: false,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      version: 1,
      uploadedAt: '2025-06-02T11:42:00.000Z',
    }
  }

  const stubs = {
    AvModal: {
      name: 'AvModal',
      props: ['opened', 'closeButtonLabel', 'confirmButtonLabel'],
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

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPending.value = false

    onConfirmDeleteMock = vi.fn()
    onCloseMock = vi.fn()

    mockedUseToasterStore.mockReturnValue({
      addErrorMessage: mockAddErrorMessage
    } as unknown as ReturnType<typeof useToasterStore>)

    mockedUseDeleteTraceMutation.mockImplementation(({ onError } = {}) => {
      if (onError) {
        onErrorCallback = onError
      }
      return {
        mutate: mockMutate,
        isPending: mockIsPending
      } as unknown as ReturnType<typeof useDeleteTraceMutation>
    })
  })

  BddTest().and('with show=true', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the modal', () => {
      expect(wrapper.findComponent({ name: 'AvModal' }).exists()).toBe(true)
    })

    BddTest().then('the modal close event should call onClose callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
      expect(onCloseMock).toHaveBeenCalled()
    })

    BddTest().then('clicking confirm button should call mutate with traceId', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
      expect(mockMutate).toHaveBeenCalledWith({ traceId: mockedTrace.id })
    })
  })

  BddTest().and('with show=false', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: false,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
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
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
      onErrorCallback(error)
    })

    BddTest().then('an error message should be added with empty description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: 'Failed to delete trace',
      })
    })

    BddTest().then('no events should be emitted', () => {
      expect(wrapper.emitted('onTraceDelete')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
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
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
      onErrorCallback(error)
    })

    BddTest().then('an error message should be added with empty description', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la suppression de la trace.',
        description: ''
      })
    })
  })

  BddTest().when('mutation onConfirmDelete callback is called', () => {
    beforeEach(() => {
      wrapper = mount(TraceDeletionConfirmationModal, {
        props: {
          trace: mockedTrace,
          show: true,
          onConfirmDelete: onConfirmDeleteMock,
          onClose: onCloseMock
        },
        global: { stubs }
      })
    })

    BddTest().then('it should call onConfirmDelete callback', () => {
      onConfirmDeleteMock()
      expect(onConfirmDeleteMock).toHaveBeenCalled()
    })
  })
})
