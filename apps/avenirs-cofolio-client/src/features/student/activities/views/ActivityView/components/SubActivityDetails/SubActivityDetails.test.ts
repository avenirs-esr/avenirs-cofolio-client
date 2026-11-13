import type { VueWrapper } from '@vue/test-utils'
import type { SubActivityDetailsProps } from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ErrorCodes, LoaderStub } from '@avenirs-esr/shared'
import { EErrorCode } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import {
  createMockedDeclaredActivityDetails,
  createMockedSubActivityContent,
  mockedSubActivities,
} from '@/__mocks__/fixtures/student/activities.fixtures'
import { subActivityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { ActivityErrorMessageStub } from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.stub'
import { ActivityDetailsStub } from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.stub'
import SubActivityDetails from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'

BddTest().given('a sub-activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubActivityDetails>>

  const declaredActivityId = 'declared-activity-4'
  const declaredActivityDetails = createMockedDeclaredActivityDetails(declaredActivityId)
  const subActivity = mockedSubActivities[0]!

  const stubs = {
    Loader: LoaderStub,
    ActivityDetails: ActivityDetailsStub,
    ActivityErrorMessage: ActivityErrorMessageStub,
  }

  function mountSubActivityDetails (props: SubActivityDetailsProps) {
    wrapper = mountComponent(SubActivityDetails, {
      props,
      global: { stubs },
    })
  }

  BddTest().when('the sub-activity content is loaded', () => {
    beforeEach(async () => {
      mountSubActivityDetails({ declaredActivityDetails, subActivity })

      await vi.waitFor(() => expect(wrapper.findComponent(ActivityDetailsStub).exists()).toBe(true))
    })

    BddTest().then('it should render the main container', () => {
      expect(wrapper.find('[data-testid="sub-activity-details"]').exists()).toBe(true)
    })

    BddTest().then('it should render the activity details with the sub-activity content in place of the main activity', () => {
      expect(wrapper.findComponent(ActivityDetailsStub).props('declaredActivityDetails')).toEqual({
        ...declaredActivityDetails,
        activity: createMockedSubActivityContent(declaredActivityId, subActivity.id),
      })
    })

    BddTest().then('it should not render an error message', () => {
      expect(wrapper.findComponent(ActivityErrorMessageStub).props('error')).toBeNull()
    })
  })

  BddTest().when('the sub-activity does not belong to the declared activity', () => {
    beforeEach(async () => {
      mountSubActivityDetails({
        declaredActivityDetails,
        subActivity: { id: 'unknown-sub-activity', title: 'Sous-activité inconnue' },
      })

      await vi.waitFor(() => expect(wrapper.findComponent(ActivityErrorMessageStub).props('error')).not.toBeNull())
    })

    BddTest().then('it should not render the activity details', () => {
      expect(wrapper.findComponent(ActivityDetailsStub).exists()).toBe(false)
    })

    BddTest().then('it should pass the not found error to the error message', () => {
      expect(wrapper.findComponent(ActivityErrorMessageStub).props('error')).toMatchObject({ code: EErrorCode.ACTIVITY_NOT_FOUND })
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(async () => {
      server.use(subActivityDetailsErrorHandler)

      mountSubActivityDetails({ declaredActivityDetails, subActivity })

      await vi.waitFor(() => expect(wrapper.findComponent(ActivityErrorMessageStub).props('error')).not.toBeNull())
    })

    BddTest().then('it should not render the activity details', () => {
      expect(wrapper.findComponent(ActivityDetailsStub).exists()).toBe(false)
    })

    BddTest().then('it should pass the server error to the error message', () => {
      expect(wrapper.findComponent(ActivityErrorMessageStub).props('error')).toMatchObject({ code: ErrorCodes.SERVER })
    })
  })
})
