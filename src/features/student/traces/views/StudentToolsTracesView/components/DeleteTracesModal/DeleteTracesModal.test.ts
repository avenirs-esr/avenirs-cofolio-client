import type { TraceViewDTO } from '@/api/avenir-esr'
import { TracesSelectorStub } from '@/features/student/traces/components/interactions/pickers/TracesSelector/TraceSelector.stub'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import DeleteTracesModal
  from '@/features/student/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.vue'
import {
  TraceDeletionConfirmationModalStub
} from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
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
  let wrapper: VueWrapper

  const mockedUsePaginatedTraces: MockedFunction<typeof usePaginatedTraces> = vi.mocked(usePaginatedTraces)

  const traces = ref<TraceViewDTO[]>([
    {
      id: 'trace-1',
      title: 'Trace 1',
      isAssociated: false,
      isDeletable: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z'
    },
    {
      id: 'trace-2',
      title: 'Trace 2',
      isAssociated: true,
      isDeletable: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z'
    }
  ])

  const isFetching = ref(false)
  const hasMoreTraces = computed(() => false)
  const loadMoreTraces = vi.fn()

  const stubs = {
    AvModal: AvModalStub,
    TracesSelector: TracesSelectorStub,
    TraceDeletionConfirmationModal: TraceDeletionConfirmationModalStub
  }

  function mountComponent (show = true, totalCount = 2) {
    wrapper = mount(DeleteTracesModal, {
      props: {
        show,
        totalCount
      },
      global: { stubs }
    })
  }

  function modal () {
    return wrapper.findComponent({ name: 'AvModal' })
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUsePaginatedTraces.mockReturnValue({
      traces,
      pageInfo: ref(undefined),
      page: ref(0),
      isFetching,
      hasMoreTraces,
      loadMoreTraces,
      resetPagination: vi.fn()
    })

    mountComponent()
  })

  BddTest().then('it should render the modal', () => {
    expect(modal().exists()).toBe(true)
  })

  BddTest().then('it should provide modal props', () => {
    expect(modal().props('opened')).toBe(true)
    expect(modal().props('confirmButtonDisabled')).toBe(true)
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

    await modal().vm.$emit('close')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  BddTest().then('confirming modal should display confirmation modal', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1'])

    await modal().vm.$emit('confirm')

    expect(wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' }).props('show')).toBe(true)
    expect(wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' }).props('traceIds')).toEqual(['trace-1'])
  })

  BddTest().then('delete success should emit deleted', async () => {
    await wrapper.findComponent({ name: 'TracesSelector' }).vm.$emit('update:modelValue', ['trace-1'])
    await modal().vm.$emit('confirm')

    await wrapper.find('[data-testid="confirm-delete-success"]').trigger('click')

    expect(wrapper.emitted('deleted')).toHaveLength(1)
  })

  BddTest().and('without traces', () => {
    beforeEach(() => {
      traces.value = []
      mountComponent()
    })

    BddTest().then('it should not render traces selector', () => {
      expect(wrapper.findComponent({ name: 'TracesSelector' }).exists()).toBe(false)
    })
  })
})
