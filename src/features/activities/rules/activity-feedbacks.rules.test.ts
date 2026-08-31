import type { DeclaredActivityDetailsDTO, FeedbackOverviewDTO, UserInfoDTO } from '@/api/avenir-esr'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EFeedbackStatus } from '@/api/avenir-esr'
import {
  canCreateFeedbackRequest,
  computeRemainingFeedbacks,
  isActivityFeedbackRequestsDisabled,
  isActivityFeedbackRequestsLimited,
  isActivityFeedbackRequestsUnlimited,
} from '@/common/activities/rules/activity-feedbacks.rules'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

const baseUser: UserInfoDTO = {
  id: 'user-1',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com'
}

function buildFeedback (status: EFeedbackStatus, id = 'feedback-1'): FeedbackOverviewDTO {
  return {
    id,
    staff: baseUser,
    student: baseUser,
    status,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}

function buildDeclaredActivityDetails (
  feedbackAllowedIterations: number,
  feedbacks?: FeedbackOverviewDTO[]
): DeclaredActivityDetailsDTO {
  return {
    ...mockedDeclaredActivityDetails,
    activity: {
      ...mockedDeclaredActivityDetails.activity,
      feedbackAllowedIterations
    },
    feedbacks
  }
}

BddTest().given('computeRemainingFeedbacks', () => {
  BddTest().when('the activity has no feedbacks yet', () => {
    BddTest().and('the feedbacks list is undefined', () => {
      BddTest().then('it should return the full allowed iterations count', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, undefined)
        expect(computeRemainingFeedbacks(declaredActivityDetails)).toBe(3)
      })
    })

    BddTest().and('the feedbacks list is empty', () => {
      BddTest().then('it should return the full allowed iterations count', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [])
        expect(computeRemainingFeedbacks(declaredActivityDetails)).toBe(3)
      })
    })
  })

  BddTest().when('the activity has some feedbacks', () => {
    BddTest().then('it should subtract the number of feedbacks from the allowed iterations', () => {
      const declaredActivityDetails = buildDeclaredActivityDetails(3, [
        buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-1'),
        buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-2')
      ])
      expect(computeRemainingFeedbacks(declaredActivityDetails)).toBe(1)
    })

    BddTest().and('all allowed iterations have been used', () => {
      BddTest().then('it should return zero', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(2, [
          buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-1'),
          buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-2')
        ])
        expect(computeRemainingFeedbacks(declaredActivityDetails)).toBe(0)
      })
    })

    BddTest().and('more feedbacks exist than the allowed iterations', () => {
      BddTest().then('it should return a negative number', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(1, [
          buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-1'),
          buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-2')
        ])
        expect(computeRemainingFeedbacks(declaredActivityDetails)).toBe(-1)
      })
    })
  })
})

BddTest().given('canCreateFeedbackRequest', () => {
  BddTest().when('there are no remaining feedbacks', () => {
    BddTest().then('it should return false regardless of the last feedback status', () => {
      const declaredActivityDetails = buildDeclaredActivityDetails(1, [
        buildFeedback(EFeedbackStatus.SUBMITTED)
      ])
      expect(canCreateFeedbackRequest(declaredActivityDetails, 0)).toBe(false)
    })
  })

  BddTest().when('there are remaining feedbacks', () => {
    BddTest().and('there is no existing feedback', () => {
      BddTest().then('it should return true when the feedbacks list is empty', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [])
        expect(canCreateFeedbackRequest(declaredActivityDetails, 3)).toBe(true)
      })

      BddTest().then('it should return true when the feedbacks list is undefined', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, undefined)
        expect(canCreateFeedbackRequest(declaredActivityDetails, 3)).toBe(true)
      })
    })

    BddTest().and('the last feedback is being processed', () => {
      BddTest().then('it should return false', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [
          buildFeedback(EFeedbackStatus.IN_PROCESS)
        ])
        expect(canCreateFeedbackRequest(declaredActivityDetails, 2)).toBe(false)
      })
    })

    BddTest().and('the last feedback is submitted', () => {
      BddTest().then('it should return true', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [
          buildFeedback(EFeedbackStatus.SUBMITTED)
        ])
        expect(canCreateFeedbackRequest(declaredActivityDetails, 2)).toBe(true)
      })
    })

    BddTest().and('the last feedback is new', () => {
      BddTest().then('it should return true', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [
          buildFeedback(EFeedbackStatus.NEW)
        ])
        expect(canCreateFeedbackRequest(declaredActivityDetails, 2)).toBe(true)
      })
    })

    BddTest().and('the most recent feedback is first in the list and being processed', () => {
      BddTest().then('it should consider only the first feedback and return false', () => {
        const declaredActivityDetails = buildDeclaredActivityDetails(3, [
          buildFeedback(EFeedbackStatus.IN_PROCESS, 'feedback-recent'),
          buildFeedback(EFeedbackStatus.SUBMITTED, 'feedback-old')
        ])
        expect(canCreateFeedbackRequest(declaredActivityDetails, 1)).toBe(false)
      })
    })
  })
})

BddTest().given('feedback request rules', () => {
  BddTest().when('feedback requests are unlimited', () => {
    BddTest().then('it should detect unlimited and not limited or disabled', () => {
      const activityContent = { feedbackAllowedIterations: -1 }
      expect(isActivityFeedbackRequestsUnlimited(activityContent)).toBe(true)
      expect(isActivityFeedbackRequestsLimited(activityContent)).toBe(false)
      expect(isActivityFeedbackRequestsDisabled(activityContent)).toBe(false)
    })
  })

  BddTest().when('feedback requests are disabled', () => {
    BddTest().then('it should detect disabled and not limited or unlimited', () => {
      const activityContent = { feedbackAllowedIterations: 0 }
      expect(isActivityFeedbackRequestsDisabled(activityContent)).toBe(true)
      expect(isActivityFeedbackRequestsLimited(activityContent)).toBe(false)
      expect(isActivityFeedbackRequestsUnlimited(activityContent)).toBe(false)
    })
  })

  BddTest().when('feedback requests are limited', () => {
    BddTest().then('it should detect limited and not disabled or unlimited', () => {
      const activityContent = { feedbackAllowedIterations: 3 }
      expect(isActivityFeedbackRequestsLimited(activityContent)).toBe(true)
      expect(isActivityFeedbackRequestsDisabled(activityContent)).toBe(false)
      expect(isActivityFeedbackRequestsUnlimited(activityContent)).toBe(false)
    })
  })
})
