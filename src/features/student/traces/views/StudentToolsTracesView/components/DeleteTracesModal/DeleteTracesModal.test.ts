import type {
  TraceViewDTO
} from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { TracesSelectorStub } from '@/features/student/traces/components/interactions/pickers/TracesSelector/TraceSelector.stub'
import {
  TraceDeletionConfirmationModalStub
} from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.stub'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import DeleteTracesModal
  from '@/features/student/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/traces/composables/use-paginated-traces/use-paginated-traces', () => ({
  usePaginatedTraces: vi.fn()
}))

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useInfiniteScroll: vi.fn()
  }
})

BddTest().given('a delete traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteTracesModal>>

  const mockedUsePaginatedTraces: MockedFunction<typeof usePaginatedTraces> = vi.mocked(usePaginatedTraces)

  const traces = ref<TraceViewDTO[]>([
    {
      id: 'trace-1',
      title: 'Trace 1',
      isAssociated: false,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z',
      authorType: ETraceAuthorType.PERSONAL
    },
    {
      id: 'trace-2',
      title: 'Trace 2',
      isAssociated: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z',
      authorType: ETraceAuthorType.PERSONAL
    }
  ])

  const isFetching = ref(false)
  const hasMoreTraces = computed(() => false)
  const loadMoreTraces = vi.fn()
  const resetPagination = vi.fn()

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    TracesSelector: TracesSelectorStub,
    TraceDeletionConfirmationModal: TraceDeletionConfirmationModalStub
  }

  function mountDeleteTracesModal (show = true, totalCount = 2) {
    wrapper = mountComponent(DeleteTracesModal, {
      props: {
        show,
        totalCount
      },
      global: { stubs },
      useTanstack: true
    })
  }

  function getModal () {
    return wrapper.findComponent({ name: 'ConfirmationModal' })
  }

  beforeEach(() => {
    vi.clearAllMocks()

    traces.value = [
      {
        id: 'trace-1',
        title: 'Trace 1',
        isAssociated: false,
        createdAt: '2026-06-15T10:00:00.000Z',
        updatedAt: '2026-06-15T10:00:00.000Z',
        authorType: ETraceAuthorType.PERSONAL
      },
      {
        id: 'trace-2',
        title: 'Trace 2',
        isAssociated: true,
        createdAt: '2026-06-15T10:00:00.000Z',
        updatedAt: '2026-06-15T10:00:00.000Z',
        authorType: ETraceAuthorType.PERSONAL
      }
    ]

    mockedUsePaginatedTraces.mockReturnValue({
      traces,
      pageInfo: ref(undefined),
      page: ref(0),
      isFetching,
      hasMoreTraces,
      loadMoreTraces,
      resetPagination
    })

    mountDeleteTracesModal()
  })

  BddTest().then('it should render the modal', () => {
    expect(getModal().exists()).toBe(true)
  })

  BddTest().then('it should provide modal props', () => {
    expect(getModal().props('show')).toBe(true)
    expect(getModal().props('confirmButtonDisabled')).toBe(true)
  })

  BddTest().then('it should render traces selector when traces exist', () => {
    const selector = wrapper.findComponent({ name: 'TracesSelector' })

    expect(selector.exists()).toBe(true)
    expect(selector.props('traces')).toEqual(traces.value)
    expect(selector.props('compact')).toBe(true)
  })

  BddTest().then('it should call usePaginatedTraces with total count as page size', () => {
    expect(mockedUsePaginatedTraces).toHaveBeenCalledWith({
      enabled: expect.any(Object),
      pageSize: expect.any(Object)
    })
  })

  BddTest().then('closing modal should emit cancel and reset selected traces', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1'])

    await getModal().vm.$emit('close')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  BddTest().then('confirming modal should display deletion confirmation modal with selected trace ids', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1'])

    await getModal().vm.$emit('confirm')

    const confirmationModal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })

    expect(confirmationModal.props('show')).toBe(true)
    expect(confirmationModal.props('traceIds')).toEqual(['trace-1'])
  })

  BddTest().then('confirming modal should display deletion confirmation modal with multiple selected trace ids', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1', 'trace-2'])

    await getModal().vm.$emit('confirm')

    const confirmationModal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })

    expect(confirmationModal.props('show')).toBe(true)
    expect(confirmationModal.props('traceIds')).toEqual(['trace-1', 'trace-2'])
  })

  BddTest().then('delete success should emit deleted', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1'])
    await getModal().vm.$emit('confirm')

    await wrapper.find('[data-testid="confirm-delete-success"]').trigger('click')

    expect(wrapper.emitted('deleted')).toHaveLength(1)
  })

  BddTest().and('without traces', () => {
    beforeEach(() => {
      traces.value = []
      mountDeleteTracesModal()
    })

    BddTest().then('it should not render traces selector', () => {
      expect(wrapper.findComponent({ name: 'TracesSelector' }).exists()).toBe(false)
    })
  })
})
