import type { VueWrapper } from '@vue/test-utils'
import {
  searchDeclaredExperiencesForAssociationErrorHandler
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import {
  associateTraceWithDeclaredExperiencesErrorHandler
} from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { AssociateDeclaredExperiencesModalStub } from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.stub'
import AssociateDeclaredExperiencesToTracesModal, {
  type AssociateDeclaredExperiencesToTracesModalProps
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredExperiencesToTracesModal/AssociateDeclaredExperiencesToTracesModal.vue'
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

BddTest().given('an associate declared experiences to traces modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesToTracesModal>>

  const stubs = {
    AssociateDeclaredExperiencesModal: AssociateDeclaredExperiencesModalStub
  }

  const props: AssociateDeclaredExperiencesToTracesModalProps = {
    show: true,
    traceId: 'trace-1'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    let modal: VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>

    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredExperiencesToTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
      modal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
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

    BddTest().then('it should load declared experiences from the query and pass them to the modal', async () => {
      await vi.waitFor(() => {
        const updatedModal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
        expect(updatedModal.props('experiences').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the inner modal emits search event', () => {
      beforeEach(async () => {
        modal.vm.$emit('search', 'experience')
        await flushPromises()
      })

      BddTest().then('it should filter declared experiences through the query', async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
          const experiences = updatedModal.props('experiences')
          expect(experiences.length).toBeGreaterThanOrEqual(0)
        })
      })
    })

    BddTest().and('the inner modal emits associate event successfully', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
          expect(updatedModal.props('experiences').length).toBeGreaterThan(0)
        })

        modal.vm.$emit('associate', ['experience-search-1', 'experience-search-2'])
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
      wrapper = mountComponent(AssociateDeclaredExperiencesToTracesModal, {
        props: { ...props, show: false },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should pass show as false to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
      expect(modal.props('show')).toBe(false)
    })
  })

  BddTest().when('loading declared experiences fails', () => {
    beforeEach(async () => {
      server.use(searchDeclaredExperiencesForAssociationErrorHandler)

      wrapper = mountComponent(AssociateDeclaredExperiencesToTracesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should add an error toaster message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
          description: 'Internal Server Error',
        })
      })
    })

    BddTest().then('it should not add a success toaster message', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should pass empty declared experiences to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
      expect(modal.props('experiences')).toEqual([])
    })
  })

  BddTest().when('associating declared experiences fails', () => {
    beforeEach(async () => {
      server.use(associateTraceWithDeclaredExperiencesErrorHandler)

      wrapper = mountComponent(AssociateDeclaredExperiencesToTracesModal, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
        expect(modal.props('experiences').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(AssociateDeclaredExperiencesModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModalStub>>
        modal.vm.$emit('associate', ['experience-search-1'])
        await flushPromises()
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Internal Server Error',
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
