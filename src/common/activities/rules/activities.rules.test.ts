import type { DeclaredActivityAssociationDTO, DeclaredActivityDetailsDTO, FeedbackOverviewDTO, UserInfoDTO } from '@/api/avenir-esr'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EActivityThematic, EDeclaredActivityStatus, EFeedbackStatus } from '@/api/avenir-esr'
import { canCreateFeedbackRequest, computeRemainingFeedbacks, isDeletableDeclaredActivityAssociation } from '@/common/activities/rules/activities.rules'
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

function buildDeclaredActivityAssociation (status: EDeclaredActivityStatus, associationId = 'association-1'): DeclaredActivityAssociationDTO {
  return {
    associationId,
    declaredActivity: {
      id: `activity-${associationId}`,
      activityId: `activity-${associationId}`,
      title: `Activity ${associationId}`,
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      summary: 'summary',
      description: 'description',
      status
    }
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

BddTest().given('isDeletableDeclaredActivityAssociation', () => {
  BddTest().when('the declared activity is subscribed', () => {
    BddTest().then('it should return true', () => {
      const association = buildDeclaredActivityAssociation(EDeclaredActivityStatus.SUBSCRIBED)
      expect(isDeletableDeclaredActivityAssociation(association)).toBe(true)
    })
  })

  BddTest().when('the declared activity is in progress', () => {
    BddTest().then('it should return true', () => {
      const association = buildDeclaredActivityAssociation(EDeclaredActivityStatus.IN_PROGRESS)
      expect(isDeletableDeclaredActivityAssociation(association)).toBe(true)
    })
  })

  BddTest().when('the declared activity is submitted', () => {
    BddTest().then('it should return false', () => {
      const association = buildDeclaredActivityAssociation(EDeclaredActivityStatus.SUBMITTED)
      expect(isDeletableDeclaredActivityAssociation(association)).toBe(false)
    })
  })

  BddTest().when('the declared activity is completed', () => {
    BddTest().then('it should return false', () => {
      const association = buildDeclaredActivityAssociation(EDeclaredActivityStatus.COMPLETED)
      expect(isDeletableDeclaredActivityAssociation(association)).toBe(false)
    })
  })
})
