import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { finishDeclaredActivityErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { MyPerspectiveCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.stub'
import { FinishDeclaredActivityStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.stub'
import MyPerspectiveTab, {
  type MyPerspectiveTabProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
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

BddTest().given('a my perspective tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveTab>>

  const stubs = {
    FinishDeclaredActivity: FinishDeclaredActivityStub,
    MyPerspectiveCard: MyPerspectiveCardStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: MyPerspectiveTabProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(MyPerspectiveTab, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the perspective card', () => {
      const perspectiveCard = wrapper.findComponent(MyPerspectiveCardStub)
      expect(perspectiveCard.exists()).toBe(true)
    })

    BddTest().then('it should render the main container', () => {
      expect(wrapper.find('[data-testid="my-perspective-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render FinishDeclaredActivity', () => {
      const finishDeclaredActivity = wrapper.findComponent(FinishDeclaredActivityStub)

      expect(finishDeclaredActivity.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to FinishDeclaredActivity', () => {
      const finishDeclaredActivity = wrapper.findComponent(FinishDeclaredActivityStub)

      expect(finishDeclaredActivity.props('finishedAt')).toBe(mockedDeclaredActivityDetails.finishedAt)
      expect(finishDeclaredActivity.props('status')).toBe(mockedDeclaredActivityDetails.status)
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
  })

  BddTest().when('finishing the declared activity fails', () => {
    const props: MyPerspectiveTabProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      server.use(finishDeclaredActivityErrorHandler)

      wrapper = mountComponent(MyPerspectiveTab, {
        props,
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
})
