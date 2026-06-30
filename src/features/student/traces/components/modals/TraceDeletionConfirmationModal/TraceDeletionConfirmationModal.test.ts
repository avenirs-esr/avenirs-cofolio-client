import { invalidTraceId, mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createLockedDeclaredActivitiesHandler, lockedDeclaredActivitiesHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  EDeclaredActivityStatus,
  type TraceLockedDeclaredActivitiesDTO
} from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import TraceDeletionConfirmationModal from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { AvIconTextStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('a trace deletion confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceDeletionConfirmationModal>>

  let onConfirmDeleteMock: () => void
  let onCloseMock: () => void

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

  async function mountModal (
    show = true,
    traces: TraceLockedDeclaredActivitiesDTO[] = [mockedTrace]
  ) {
    wrapper = mountComponent(TraceDeletionConfirmationModal, {
      props: {
        traceIds: traces.map(trace => trace.traceId),
        title: traces[0].traceTitle,
        show,
        onConfirmDelete: onConfirmDeleteMock,
        onClose: onCloseMock
      },
      global: { stubs }
    })
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    onConfirmDeleteMock = vi.fn()
    onCloseMock = vi.fn()
  })

  BddTest().and('with show=true', () => {
    beforeEach(async () => {
      server.use(createLockedDeclaredActivitiesHandler([]))
      await mountModal(true)
    })

    BddTest().then('it should render the modal', () => {
      expect(wrapper.findComponent({ name: 'AvModal' }).exists()).toBe(true)
    })

    BddTest().then('the modal close event should call onClose callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')

      expect(onCloseMock).toHaveBeenCalled()
    })

    BddTest().then('clicking confirm button should call the delete success callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
      await flushPromises()
      expect(onConfirmDeleteMock).toHaveBeenCalled()
    })

    BddTest().then('it should not render locked activities accordions when traces have no locked activities', () => {
      expect(wrapper.find('[data-testid="accordions-group"]').exists()).toBe(false)
      expect(wrapper.findAll('[data-testid="accordion"]')).toHaveLength(0)
    })
  })

  BddTest().and('with locked declared activities', () => {
    beforeEach(async () => {
      server.use(lockedDeclaredActivitiesHandler)
      await mountModal(true, [mockedTraceWithLockedActivities])
    })

    BddTest().then('it should render an accordion for traces with locked activities', () => {
      expect(wrapper.find('[data-testid="accordions-group"]').exists()).toBe(true)
      expect(wrapper.findAll('[data-testid="accordion"]')).toHaveLength(1)
      expect(wrapper.text()).toContain(mockedTraceDetailed.title)
    })

    BddTest().then('it should render locked activity titles inside the accordion', () => {
      expect(wrapper.text()).toContain('Activité soumise')
      expect(wrapper.text()).toContain('Activité terminée')
    })

    BddTest().then('clicking confirm button should call the delete success callback', async () => {
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
      await flushPromises()
      expect(onConfirmDeleteMock).toHaveBeenCalled()
    })
  })

  BddTest().and('with show=false', () => {
    beforeEach(async () => {
      await mountModal(false)
    })

    BddTest().then('it should not render modal content', () => {
      expect(wrapper.find('.content-container').exists()).toBe(false)
    })
  })

  BddTest().when('the mutation fails', () => {
    beforeEach(async () => {
      await mountModal(true, [{ ...mockedTrace, traceId: invalidTraceId }])
      await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
      await flushPromises()
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
})
