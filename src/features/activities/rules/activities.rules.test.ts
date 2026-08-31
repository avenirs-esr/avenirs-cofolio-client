import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import {
  isActivityAssociationToTraceDisabled,
  isActivityAssociationToTraceLimited,
  isActivityAssociationToTraceUnlimited,
  isDeletableDeclaredActivityAssociation
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
