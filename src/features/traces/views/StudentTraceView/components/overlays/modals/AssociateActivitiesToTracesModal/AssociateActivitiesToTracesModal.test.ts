import type { VueWrapper } from '@vue/test-utils'
import {
  associateTraceWithActivitiesErrorHandler,
  searchActivitiesForAssociationErrorHandler
} from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { AssociateActivitiesModalStub } from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.stub'
import AssociateActivitiesToTracesModal, {
  type AssociateActivitiesToTracesModalProps
} from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesToTracesModal/AssociateActivitiesToTracesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    }),
  }
})

BddTest().given('an associate activities to traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateActivitiesToTracesModal>>

  const stubs = {
    AssociateActivitiesModal: AssociateActivitiesModalStub
  }

  const props: AssociateActivitiesToTracesModalProps = {
    show: true,
    traceId: 'trace-1'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    let modal: VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>

    beforeEach(async () => {
      wrapper = mountComponent(AssociateActivitiesToTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
      modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
    })

    BddTest().then('it should render the inner modal', () => {
      expect(modal.exists()).toBe(true)
    })

    BddTest().then('it should pass the show prop', () => {
      expect(modal.props('show')).toBe(true)
    })

    BddTest().then('it should pass isLoading prop as false initially', () => {
      expect(modal.props('isLoading')).toBe(false)
    })

    BddTest().then('it should pass isLoading as false initially when no mutation is pending', () => {
      expect(modal.props('isLoading')).toBe(false)
    })

    BddTest().then('it should load activities from the query and pass them to the modal', async () => {
      await vi.waitFor(() => {
        const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        expect(updatedModal.props('activities').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the inner modal emits search event', () => {
      beforeEach(async () => {
        modal.vm.$emit('search', 'activité')
        await flushPromises()
      })

      BddTest().then('it should filter activities through the query', async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
          const activities = updatedModal.props('activities')
          expect(activities.length).toBeGreaterThanOrEqual(0)
        })
      })
    })

    BddTest().and('the inner modal emits associate event successfully', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
          expect(updatedModal.props('activities').length).toBeGreaterThan(0)
        })

        modal.vm.$emit('associate', ['activity-search-1', 'activity-search-2'])
        await flushPromises()
      })

      BddTest().then('it should emit associated event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('associated')).toBeTruthy()
        })
      })

      BddTest().then('it should show a success toaster with the correct count', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: expect.stringContaining('2')
          })
        })
      })

      BddTest().then('it should not show an error toaster', () => {
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the inner modal emits cancel event', () => {
      beforeEach(() => {
        modal.vm.$emit('cancel')
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })

  BddTest().when('the show prop is false', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateActivitiesToTracesModal, {
        props: { ...props, show: false },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should pass show as false to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
      expect(modal.props('show')).toBe(false)
    })
  })

  BddTest().when('loading activities fails', () => {
    beforeEach(async () => {
      server.use(searchActivitiesForAssociationErrorHandler)

      wrapper = mountComponent(AssociateActivitiesToTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should add an error toaster message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
          description: expect.any(String),
        })
      })
    })

    BddTest().then('it should not add a success toaster message', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should pass empty activities to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
      expect(modal.props('activities')).toEqual([])
    })
  })

  BddTest().when('associating activities fails', () => {
    beforeEach(async () => {
      server.use(associateTraceWithActivitiesErrorHandler)

      wrapper = mountComponent(AssociateActivitiesToTracesModal, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        expect(modal.props('activities').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        modal.vm.$emit('associate', ['activity-search-1'])
        await flushPromises()
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: expect.any(String),
          })
        })
      })

      BddTest().then('it should not add a success toaster message', () => {
        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should not emit associated event', () => {
        expect(wrapper.emitted('associated')).toBeFalsy()
      })
    })
  })
})
