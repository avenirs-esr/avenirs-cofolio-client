import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { FeedbackInfoCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackInfoCard/FeedbackInfoCard.stub'
import { MyPerspectiveCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.stub'
import { PerspectiveTabActionsStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/PerspectiveTabActions/PerspectiveTabActions.stub'
import MyPerspectiveTab, {
  type MyPerspectiveTabProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a my perspective tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveTab>>

  const stubs = {
    MyPerspectiveCard: MyPerspectiveCardStub,
    FeedbackInfoCard: FeedbackInfoCardStub,
    PerspectiveTabActions: PerspectiveTabActionsStub,
  }

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

    BddTest().then('it should render the main container', () => {
      expect(wrapper.find('[data-testid="my-perspective-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render the perspective card', () => {
      expect(wrapper.findComponent(MyPerspectiveCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the feedback info card', () => {
      expect(wrapper.findComponent(FeedbackInfoCardStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to FeedbackInfoCard', () => {
      const feedbackInfoCard = wrapper.findComponent(FeedbackInfoCardStub)
      expect(feedbackInfoCard.props('activity')).toEqual(mockedDeclaredActivityDetails)
    })

    BddTest().then('it should render PerspectiveTabActions', () => {
      expect(wrapper.findComponent(PerspectiveTabActionsStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to PerspectiveTabActions', () => {
      const perspectiveTabActions = wrapper.findComponent(PerspectiveTabActionsStub)
      expect(perspectiveTabActions.props('declaredActivityDetails')).toEqual(mockedDeclaredActivityDetails)
    })
  })

  BddTest().when('the activity has 0 feedback iterations allowed', () => {
    const props: MyPerspectiveTabProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: 0 },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(MyPerspectiveTab, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should not render the feedback info card', () => {
      expect(wrapper.findComponent(FeedbackInfoCardStub).exists()).toBe(false)
    })
  })
})
