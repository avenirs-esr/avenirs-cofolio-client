import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { isDeletableDeclaredActivityAssociation } from '@/features/declaredSkills/rules/declared-activity-association.rules'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

function createAssociation (status: EDeclaredActivityStatus): DeclaredActivityAssociationDTO {
  return {
    associationId: 'assoc-1',
    declaredActivity: {
      id: 'activity-1',
      activityId: 'act-1',
      title: 'Activité 1',
      thematic: EActivityThematic.PROGRAMS,
      status,
      summary: 'Summary 1',
      description: '<p>Description 1</p>',
    }
  }
}

BddTest().given('the isDeletableDeclaredActivityAssociation rule', () => {
  const testCases: { status: EDeclaredActivityStatus, expected: boolean }[] = [
    { status: EDeclaredActivityStatus.SUBSCRIBED, expected: true },
    { status: EDeclaredActivityStatus.IN_PROGRESS, expected: true },
    { status: EDeclaredActivityStatus.SUBMITTED, expected: false },
    { status: EDeclaredActivityStatus.COMPLETED, expected: false },
  ]

  testCases.forEach(({ status, expected }) => {
    BddTest().when(`the association declared activity has status: ${status}`, () => {
      let result: boolean

      beforeEach(() => {
        result = isDeletableDeclaredActivityAssociation(createAssociation(status))
      })

      BddTest().then(`it should return ${expected}`, () => {
        expect(result).toBe(expected)
      })
    })
  })
})
