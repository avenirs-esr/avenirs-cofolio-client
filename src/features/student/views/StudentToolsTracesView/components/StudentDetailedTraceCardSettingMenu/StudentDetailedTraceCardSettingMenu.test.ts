import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { useDeleteTraceMutation } from '@/features/student/queries'
import StudentDetailedTraceCardSettingMenu from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { useToasterStore } from '@/store'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/queries', async (importActual) => {
  const actual = await importActual<typeof import('@/features/student/queries')>()
  return {
    ...actual,
    useDeleteTraceMutation: vi.fn()
  }
})

vi.mock('@/store', () => {
  return {
    useToasterStore: vi.fn()
  }
})

describe('studentDetailedTraceCardSettingMenu', () => {
  let wrapper: VueWrapper
  let onErrorCallback: (error: BaseApiException) => void
  let onSuccessCallback: () => void
  const mockedUseDeleteTraceMutation: MockedFunction<typeof useDeleteTraceMutation> = vi.mocked(useDeleteTraceMutation)
  const mockedUseToasterStore: MockedFunction<typeof useToasterStore> = vi.mocked(useToasterStore)

  const mockMutate = vi.fn()
  const mockIsPending = ref(false)
  const mockAddErrorMessage = vi.fn()

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['icon', 'variant', 'size', 'theme', 'label', 'iconScale', 'disabled', 'noRadius'],
      template: `<button 
        class="av-button" 
        :disabled="disabled"
        @click="$emit('click', $event)"
      >
        <slot>{{ label }}</slot>
      </button>`,
      emits: ['click']
    }
  }

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletedAt: '2025-07-16T10:42:00.000Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPending.value = false
    setActivePinia(createPinia())

    mockedUseToasterStore.mockReturnValue({
      addErrorMessage: mockAddErrorMessage
    } as unknown as ReturnType<typeof useToasterStore>)

    mockedUseDeleteTraceMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        onErrorCallback = onError
      }
      if (onSuccess) {
        onSuccessCallback = onSuccess
      }
      return {
        mutate: mockMutate,
        isPending: mockIsPending
      } as unknown as ReturnType<typeof useDeleteTraceMutation>
    })
  })

  describe('given a settings menu with show prop set to true', () => {
    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: true
        },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the menu should be visible', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(true)
        expect(wrapper.find('.student-detailed-trace-card-setting-menu__item').exists()).toBe(true)
      })

      it('then the delete button should have correct props', () => {
        const deleteButton = wrapper.findComponent({ name: 'AvButton' })

        expect(deleteButton.props()).toMatchObject({
          size: 'sm',
          theme: 'SECONDARY',
          label: 'Supprimer ma trace',
          iconScale: 1.3,
          noRadius: ''
        })
        expect(deleteButton.props('icon')).toEqual(MDI_ICONS.TRASH_CAN_OUTLINE)
      })

      it('then useDeleteTraceMutation should be called with onError and onSuccess callbacks', () => {
        expect(mockedUseDeleteTraceMutation).toHaveBeenCalledWith({
          onError: expect.any(Function),
          onSuccess: expect.any(Function)
        })
      })
    })

    describe('when the delete button is clicked', () => {
      beforeEach(async () => {
        const deleteButton = wrapper.findComponent({ name: 'AvButton' })
        await deleteButton.trigger('click')
      })

      it('then the onTraceDelete and close events should not be emitted immediately', () => {
        expect(wrapper.emitted('onTraceDelete')).toBeFalsy()
        expect(wrapper.emitted('close')).toBeFalsy()
      })
    })

    describe('when the mutation succeeds', () => {
      beforeEach(() => {
        onSuccessCallback()
      })

      it('then the onTraceDelete event should be emitted with correct trace', () => {
        expect(wrapper.emitted('onTraceDelete')).toBeTruthy()
        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([mockedTrace])
      })

      it('then the close event should be emitted', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    describe('when the mutation fails', () => {
      beforeEach(() => {
        const error: BaseApiException = {
          message: 'Failed to delete trace',
          name: 'DeleteTraceError',
          status: 400,
          code: BaseApiErrorCode.BAD_REQUEST
        }

        onErrorCallback(error)
      })

      it('then an error message should be added to toaster', () => {
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
      beforeEach(() => {
        const error: BaseApiException = {
          message: '',
          name: 'DeleteTraceError',
          status: 500,
          code: BaseApiErrorCode.UNKNOWN
        }

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
  })

  describe('given a settings menu with show prop set to false', () => {
    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: false
        },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the menu should not be visible', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(false)
      })

      it('then the useDeleteTraceMutation should still be called during setup', () => {
        expect(mockedUseDeleteTraceMutation).toHaveBeenCalled()
      })
    })
  })

  describe('given a settings menu with different trace object', () => {
    const differentTrace: TraceViewDTO = {
      id: 'trace2',
      title: 'Another trace',
      status: TraceStatus.ASSOCIATED,
      createdAt: '2025-06-15T10:42:00.000Z',
      updatedAt: '2025-06-16T15:18:00.000Z',
      deletedAt: '2025-07-15T10:42:00.000Z'
    }

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: differentTrace,
          show: true
        },
        global: { stubs }
      })
    })

    describe('when the mutation succeeds with different trace', () => {
      beforeEach(() => {
        onSuccessCallback()
      })

      it('then the onTraceDelete event should contain the different trace object', () => {
        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([differentTrace])
      })
    })
  })
})
