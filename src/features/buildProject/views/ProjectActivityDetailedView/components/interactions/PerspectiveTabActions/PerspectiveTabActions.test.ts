import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails, mockedFinishedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { askForFeedbackErrorHandler, finishDeclaredActivityErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { type DeclaredActivityDetailsDTO, EDeclaredActivityStatus, EFeedbackStatus } from '@/api/avenir-esr'
import { FinishDeclaredActivityStub } from '@/features/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.stub'
import PerspectiveTabActions, {
  type MyPerspectiveTabActionsProps,
} from '@/features/buildProject/views/ProjectActivityDetailedView/components/interactions/PerspectiveTabActions/PerspectiveTabActions.vue'
import { RequestFeedbackStub } from '@/features/buildProject/views/ProjectActivityDetailedView/components/interactions/RequestFeedback/RequestFeedback.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

BddTest().given('a perspective tab actions', () => {
  let wrapper: VueWrapper<InstanceType<typeof PerspectiveTabActions>>

  const stubs = {
    FinishDeclaredActivity: FinishDeclaredActivityStub,
    RequestFeedback: RequestFeedbackStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: MyPerspectiveTabActionsProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(PerspectiveTabActions, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container', () => {
      expect(wrapper.find('[data-testid="perspective-tab-actions"]').exists()).toBe(true)
    })

    BddTest().then('it should render FinishDeclaredActivity', () => {
      expect(wrapper.findComponent(FinishDeclaredActivityStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to FinishDeclaredActivity', () => {
      const finishDeclaredActivity = wrapper.findComponent(FinishDeclaredActivityStub)
      expect(finishDeclaredActivity.props('status')).toBe(mockedDeclaredActivityDetails.status)
    })

    BddTest().then('it should render RequestFeedback when status is IN_PROGRESS', () => {
      expect(wrapper.findComponent(RequestFeedbackStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to RequestFeedback', () => {
      const requestFeedback = wrapper.findComponent(RequestFeedbackStub)
      expect(requestFeedback.props('remainingFeedbacks')).toBeDefined()
    })

    BddTest().then('it should not render the actions hint', () => {
      expect(wrapper.find('[data-testid="actions-hint"]').exists()).toBe(false)
    })

    BddTest().and('the user finishes the declared activity successfully', () => {
      beforeEach(() => {
        wrapper.findComponent(FinishDeclaredActivityStub).vm.$emit('finished')
      })

      BddTest().then('it should add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Votre activitée est terminée',
          })
        })
      })

      BddTest().then('it should not add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().and('the user requests feedback successfully', () => {
      beforeEach(() => {
        wrapper.findComponent(RequestFeedbackStub).vm.$emit('requestFeedback')
      })

      BddTest().then('it should add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Votre activité a été soumise avec succès. Vous serez notifié lorsque que votre conseiller référent vous aura répondu.',
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with a finished activity', () => {
    beforeEach(() => {
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedFinishedDeclaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().then('it should not render RequestFeedback', () => {
      expect(wrapper.findComponent(RequestFeedbackStub).exists()).toBe(false)
    })

    BddTest().then('it should render the actions hint with finished date', () => {
      expect(wrapper.find('[data-testid="actions-hint"]').exists()).toBe(true)
    })
  })

  BddTest().when('finishing the declared activity fails', () => {
    beforeEach(() => {
      server.use(finishDeclaredActivityErrorHandler)
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedDeclaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().and('the user finishes the declared activity', () => {
      beforeEach(() => {
        wrapper.findComponent(FinishDeclaredActivityStub).vm.$emit('finished')
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de la finalisation de l\'activité. Veuillez réessayer plus tard.',
            description: expect.any(String),
          })
        })
      })

      BddTest().then('it should not add a success toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('requesting feedback fails', () => {
    beforeEach(() => {
      server.use(askForFeedbackErrorHandler)
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedDeclaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().and('the user requests feedback', () => {
      beforeEach(() => {
        wrapper.findComponent(RequestFeedbackStub).vm.$emit('requestFeedback')
      })

      BddTest().then('it should add an error toaster message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: expect.any(String),
            description: expect.any(String),
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with a submitted activity', () => {
    const mockedSubmittedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
      ...mockedDeclaredActivityDetails,
      status: EDeclaredActivityStatus.SUBMITTED,
    }

    beforeEach(() => {
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedSubmittedDeclaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().then('it should render RequestFeedback', () => {
      expect(wrapper.findComponent(RequestFeedbackStub).exists()).toBe(true)
    })

    BddTest().then('it should render the actions hint', () => {
      expect(wrapper.find('[data-testid="actions-hint"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a submitted activity and a NEW feedback', () => {
    const mockedSubmittedWithNewFeedback: DeclaredActivityDetailsDTO = {
      ...mockedDeclaredActivityDetails,
      status: EDeclaredActivityStatus.SUBMITTED,
      feedbacks: [{
        id: 'feedback-1',
        status: EFeedbackStatus.NEW,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
        staff: { id: 'staff-1', firstName: 'Staff', lastName: 'User', email: 'staff@test.com' },
        student: { id: 'student-1', firstName: 'Lucas', lastName: 'Tessier', email: 'lucas@test.com' },
      }],
    }

    beforeEach(() => {
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedSubmittedWithNewFeedback },
        global: { stubs },
      })
    })

    BddTest().then('it should render the actions hint with updatable-feedback type', () => {
      const hint = wrapper.find('[data-testid="actions-hint"]')
      expect(hint.exists()).toBe(true)
      expect(hint.attributes('data-type')).toBe('updatable-feedback')
    })

    BddTest().then('it should pass disabled false to RequestFeedback', () => {
      const requestFeedback = wrapper.findComponent(RequestFeedbackStub)
      expect(requestFeedback.props('disabled')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a submitted activity and an IN_PROCESS feedback', () => {
    const mockedSubmittedWithInProcessFeedback: DeclaredActivityDetailsDTO = {
      ...mockedDeclaredActivityDetails,
      status: EDeclaredActivityStatus.SUBMITTED,
      feedbacks: [{
        id: 'feedback-1',
        status: EFeedbackStatus.IN_PROCESS,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
        staff: { id: 'staff-1', firstName: 'Staff', lastName: 'User', email: 'staff@test.com' },
        student: { id: 'student-1', firstName: 'Lucas', lastName: 'Tessier', email: 'lucas@test.com' },
      }],
    }

    beforeEach(() => {
      wrapper = mountComponent(PerspectiveTabActions, {
        props: { declaredActivityDetails: mockedSubmittedWithInProcessFeedback },
        global: { stubs },
      })
    })

    BddTest().then('it should render RequestFeedback', () => {
      expect(wrapper.findComponent(RequestFeedbackStub).exists()).toBe(true)
    })

    BddTest().then('it should pass disabled true to RequestFeedback', () => {
      const requestFeedback = wrapper.findComponent(RequestFeedbackStub)
      expect(requestFeedback.props('disabled')).toBe(true)
    })

    BddTest().then('it should pass the IN_PROCESS feedback status to RequestFeedback', () => {
      const requestFeedback = wrapper.findComponent(RequestFeedbackStub)
      expect(requestFeedback.props('feedbackStatus')).toBe(EFeedbackStatus.IN_PROCESS)
    })
  })
})
