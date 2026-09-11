import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import {
  isActivityAssociationToTraceDisabled,
  isActivityAssociationToTraceLimited,
  isActivityAssociationToTraceUnlimited,
  isActivitySubscribed,
  isDeclaredActivityUnsubscribed,
  isDeletableDeclaredActivityAssociation,
  isPerspectiveEditingDisabled
} from '@/common/activities/rules/activities.rules'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

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

BddTest().given('trace association rules', () => {
  BddTest().when('trace associations are unlimited', () => {
    BddTest().then('it should detect unlimited and not limited or disabled', () => {
      const activityContent = { traceAllowedAssociations: -1 }
      expect(isActivityAssociationToTraceUnlimited(activityContent)).toBe(true)
      expect(isActivityAssociationToTraceLimited(activityContent)).toBe(false)
      expect(isActivityAssociationToTraceDisabled(activityContent)).toBe(false)
    })
  })

  BddTest().when('trace associations are disabled', () => {
    BddTest().then('it should detect disabled and not limited or unlimited', () => {
      const activityContent = { traceAllowedAssociations: 0 }
      expect(isActivityAssociationToTraceDisabled(activityContent)).toBe(true)
      expect(isActivityAssociationToTraceLimited(activityContent)).toBe(false)
      expect(isActivityAssociationToTraceUnlimited(activityContent)).toBe(false)
    })
  })

  BddTest().when('trace associations are limited', () => {
    BddTest().then('it should detect limited and not disabled or unlimited', () => {
      const activityContent = { traceAllowedAssociations: 3 }
      expect(isActivityAssociationToTraceLimited(activityContent)).toBe(true)
      expect(isActivityAssociationToTraceDisabled(activityContent)).toBe(false)
      expect(isActivityAssociationToTraceUnlimited(activityContent)).toBe(false)
    })
  })
})

BddTest().given('isActivitySubscribed', () => {
  BddTest().when('the activity has no declared activity', () => {
    BddTest().then('it should return false', () => {
      const activity = { subscribedDeclaredActivity: undefined, subscribedDeclaredActivityStatus: undefined }
      expect(isActivitySubscribed(activity)).toBe(false)
    })
  })

  BddTest().when('the declared activity is subscribed', () => {
    BddTest().then('it should return true', () => {
      const activity = { subscribedDeclaredActivity: 'declared-activity-1', subscribedDeclaredActivityStatus: EDeclaredActivityStatus.SUBSCRIBED }
      expect(isActivitySubscribed(activity)).toBe(true)
    })
  })

  BddTest().when('the declared activity is in progress', () => {
    BddTest().then('it should return true', () => {
      const activity = { subscribedDeclaredActivity: 'declared-activity-1', subscribedDeclaredActivityStatus: EDeclaredActivityStatus.IN_PROGRESS }
      expect(isActivitySubscribed(activity)).toBe(true)
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    BddTest().then('it should return false', () => {
      const activity = { subscribedDeclaredActivity: 'declared-activity-1', subscribedDeclaredActivityStatus: EDeclaredActivityStatus.UNSUBSCRIBED }
      expect(isActivitySubscribed(activity)).toBe(false)
    })
  })
})

BddTest().given('isPerspectiveEditingDisabled', () => {
  BddTest().when('the declared activity is completed', () => {
    BddTest().then('it should return true', () => {
      expect(isPerspectiveEditingDisabled(EDeclaredActivityStatus.COMPLETED)).toBe(true)
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    BddTest().then('it should return true', () => {
      expect(isPerspectiveEditingDisabled(EDeclaredActivityStatus.UNSUBSCRIBED)).toBe(true)
    })
  })

  BddTest().when('the declared activity is in progress', () => {
    BddTest().then('it should return false', () => {
      expect(isPerspectiveEditingDisabled(EDeclaredActivityStatus.IN_PROGRESS)).toBe(false)
    })
  })

  BddTest().when('the declared activity status is undefined', () => {
    BddTest().then('it should return false', () => {
      expect(isPerspectiveEditingDisabled(undefined)).toBe(false)
    })
  })
})

BddTest().given('isDeclaredActivityUnsubscribed', () => {
  BddTest().when('the declared activity is unsubscribed', () => {
    BddTest().then('it should return true', () => {
      expect(isDeclaredActivityUnsubscribed(EDeclaredActivityStatus.UNSUBSCRIBED)).toBe(true)
    })
  })

  BddTest().when('the declared activity is in progress', () => {
    BddTest().then('it should return false', () => {
      expect(isDeclaredActivityUnsubscribed(EDeclaredActivityStatus.IN_PROGRESS)).toBe(false)
    })
  })

  BddTest().when('the declared activity status is undefined', () => {
    BddTest().then('it should return false', () => {
      expect(isDeclaredActivityUnsubscribed(undefined)).toBe(false)
    })
  })
})
