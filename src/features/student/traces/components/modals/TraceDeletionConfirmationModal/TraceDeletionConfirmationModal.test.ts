import {
  EDeclaredActivityStatus,
  type TraceLockedDeclaredActivitiesDTO
} from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import TraceDeletionConfirmationModal from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { useDeleteTraceMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { AvIconTextStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQuery } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('@tanstack/vue-query', async (importActual) => {
  const actual = await importActual<typeof import('@tanstack/vue-query')>()
  return {
    ...actual,
    useQuery: vi.fn()
  }
})

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

  const mockedUseQuery: MockedFunction<typeof useQuery> = vi.mocked(useQuery)
  const mockedUseDeleteTraceMutation: MockedFunction<typeof useDeleteTraceMutation> = vi.mocked(useDeleteTraceMutation)
  const mockedUseToasterStore: MockedFunction<typeof useToasterStore> = vi.mocked(useToasterStore)

  const mockMutate = vi.fn()
  const mockIsPending = ref(false)
  const mockAddErrorMessage = vi.fn()
  const mockAddSuccessMessage = vi.fn()

  const mockQueryData = ref<TraceLockedDeclaredActivitiesDTO[]>([])
  const mockQueryError = ref<BaseApiException | null>(null)
  const mockQueryIsFetching = ref(false)

  const mockedTrace: TraceLockedDeclaredActivitiesDTO = {
    traceId: 'trace1',
    traceTitle: 'Développement d\'un ePortfolio',
    lockedDeclaredActivities: []
  }

  const mockedTraceWithLockedActivities: TraceLockedDeclaredActivitiesDTO = {
    traceId: 'trace2',
    traceTitle: 'Trace utilisée dans une activité',
    lockedDeclaredActivities: [
      {
        activityId: 'activity-1',
        activityTitle: 'Activité soumise',
        activityStatus: EDeclaredActivityStatus.SUBMITTED
      },
      {
        activityId: 'activity-2',
        activityTitle: 'Activité terminée',
        activityStatus: EDeclaredActivityStatus.COMPLETED
      }
    ]
  }

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AvModal: AvModalStub,
    AvIconText: AvIconTextStub,
    AvAccordionsGroup: {
      name: 'AvAccordionsGroup',
      template: '<div data-testid="accordions-group"><slot /></div>'
    },
    AvAccordion: {
      name: 'AvAccordion',
      props: ['id', 'title', 'icon'],
      template: `
      <section data-testid="accordion">
        <button data-testid="accordion-title">{{ title }}</button>
        <div data-testid="accordion-content">
          <slot />
        </div>
      </section>
    `
    }
  }

  function mountComponent (
    show = true,
    traces: TraceLockedDeclaredActivitiesDTO[] = [mockedTrace]
  ) {
    mockQueryData.value = traces

    wrapper = mount(TraceDeletionConfirmationModal, {
      props: {
        traceIds: traces.map(trace => trace.traceId),
        title: traces[0].traceTitle,
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
    mockQueryData.value = []
    mockQueryError.value = null
    mockQueryIsFetching.value = false

    onConfirmDeleteMock = vi.fn()
    onCloseMock = vi.fn()

    mockedUseQuery.mockReturnValue({
      data: mockQueryData,
      error: mockQueryError,
      isFetching: mockQueryIsFetching
    } as unknown as ReturnType<typeof useQuery>)

    mockedUseToasterStore.mockReturnValue({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
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

      expect(mockMutate).toHaveBeenCalledWith({
        tracesIds: [mockedTrace.traceId]
      })
    })

    BddTest().then('clicking confirm button should call mutate with multiple trace ids', async () => {
      mountComponent(true, [
        mockedTrace,
        {
          traceId: 'trace2',
          traceTitle: 'Trace 2',
          lockedDeclaredActivities: []
        },
        {
          traceId: 'trace3',
          traceTitle: 'Trace 3',
          lockedDeclaredActivities: []
        }
      ])

      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

      expect(mockMutate).toHaveBeenCalledWith({
        tracesIds: ['trace1', 'trace2', 'trace3']
      })
    })

    BddTest().then('it should not render locked activities accordions when traces have no locked activities', () => {
      expect(wrapper.find('[data-testid="accordions-group"]').exists()).toBe(false)
      expect(wrapper.findAll('[data-testid="accordion"]')).toHaveLength(0)
    })
  })

  BddTest().and('with locked declared activities', () => {
    beforeEach(() => {
      mountComponent(true, [mockedTraceWithLockedActivities])
    })

    BddTest().then('it should render an accordion for traces with locked activities', () => {
      expect(wrapper.find('[data-testid="accordions-group"]').exists()).toBe(true)
      expect(wrapper.findAll('[data-testid="accordion"]')).toHaveLength(1)
      expect(wrapper.text()).toContain(mockedTraceWithLockedActivities.traceTitle)
    })

    BddTest().then('it should render locked activity titles inside the accordion', () => {
      expect(wrapper.text()).toContain('Activité soumise')
      expect(wrapper.text()).toContain('Activité terminée')
    })

    BddTest().then('clicking confirm button should call mutate with the locked trace id', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

      expect(mockMutate).toHaveBeenCalledWith({
        tracesIds: [mockedTraceWithLockedActivities.traceId]
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
        title: 'Une erreur est survenue lors de la suppression de votre trace.',
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
        title: 'Une erreur est survenue lors de la suppression de votre trace.',
        description: expect.any(String),
      })
    })
  })

  BddTest().when('the mutation succeeds', () => {
    beforeEach(() => {
      mountComponent(true)
      onSuccessCallback()
    })

    BddTest().then('it should add a success message', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith(
        'Votre trace a été supprimée.'
      )
    })

    BddTest().then('it should call onConfirmDelete callback', () => {
      expect(onConfirmDeleteMock).toHaveBeenCalled()
    })
  })
})
