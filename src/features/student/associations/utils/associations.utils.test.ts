import {
  createMockedDeclaredActivityAssociations,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredProgramAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedEmptyAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { type AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import {
  canAssociateContextType,
  countAssociations,
  countElementAssociations,
  getAssociableContextTypes,
  getContextTypeSlug,
  getElementAssociations,
  isAssociable,
  isAssociationLimited,
  isAssociationLimitReached
} from '@/features/student/associations/utils/associations.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, expect, vi } from 'vitest'

const associations: AssociationsDTO = {
  traceAssociations: createMockedTraceAssociations(2),
  declaredActivityAssociations: createMockedDeclaredActivityAssociations(1),
  declaredSkillAssociations: createMockedDeclaredSkillAssociations(3),
  declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(4),
  declaredProgramAssociations: createMockedDeclaredProgramAssociations(2)
}

BddTest().given('isAssociable', () => {
  BddTest().then('it should allow the pairs supported by the API, both ways', () => {
    expect(isAssociable(EAssociationContextType.DECLARED_ACTIVITY, EAssociationContextType.TRACE)).toBe(true)
    expect(isAssociable(EAssociationContextType.TRACE, EAssociationContextType.DECLARED_ACTIVITY)).toBe(true)
    expect(isAssociable(EAssociationContextType.DECLARED_EXPERIENCE, EAssociationContextType.DECLARED_SKILL)).toBe(true)
  })

  BddTest().then('it should reject the pairs not supported by the API', () => {
    expect(isAssociable(EAssociationContextType.DECLARED_ACTIVITY, EAssociationContextType.DECLARED_EXPERIENCE)).toBe(false)
    expect(isAssociable(EAssociationContextType.TRACE, EAssociationContextType.TRACE)).toBe(false)
  })
})

BddTest().given('getAssociableContextTypes', () => {
  BddTest().then('it should return the associable context types in the enum order', () => {
    expect(getAssociableContextTypes(EAssociationContextType.TRACE)).toEqual([
      EAssociationContextType.DECLARED_ACTIVITY,
      EAssociationContextType.DECLARED_SKILL,
      EAssociationContextType.DECLARED_EXPERIENCE
    ])
    expect(getAssociableContextTypes(EAssociationContextType.DECLARED_ACTIVITY)).toEqual([
      EAssociationContextType.TRACE,
      EAssociationContextType.DECLARED_SKILL
    ])
    expect(getAssociableContextTypes(EAssociationContextType.DECLARED_SKILL)).toEqual([
      EAssociationContextType.TRACE,
      EAssociationContextType.DECLARED_ACTIVITY,
      EAssociationContextType.DECLARED_EXPERIENCE
    ])
    expect(getAssociableContextTypes(EAssociationContextType.DECLARED_EXPERIENCE)).toEqual([
      EAssociationContextType.TRACE,
      EAssociationContextType.DECLARED_SKILL
    ])
  })
})

BddTest().given('canAssociateContextType', () => {
  afterEach(() => {
    vi.stubGlobal('__DEMO_MODE__', false)
  })

  BddTest().when('the demo mode is disabled', () => {
    BddTest().then('it should allow every context type', () => {
      expect(Object.values(EAssociationContextType).every(canAssociateContextType)).toBe(true)
    })
  })

  BddTest().when('the demo mode is enabled', () => {
    BddTest().then('it should not allow the declared experiences', () => {
      vi.stubGlobal('__DEMO_MODE__', true)

      expect(canAssociateContextType(EAssociationContextType.DECLARED_EXPERIENCE)).toBe(false)
      expect(canAssociateContextType(EAssociationContextType.TRACE)).toBe(true)
    })
  })
})

BddTest().given('getElementAssociations', () => {
  BddTest().then('it should return the associations to the elements of the given context type', () => {
    expect(getElementAssociations(associations, EAssociationContextType.TRACE)).toEqual(
      associations.traceAssociations.map(({ associationId, trace }) => ({ associationId, id: trace.id, title: trace.title }))
    )
    expect(getElementAssociations(associations, EAssociationContextType.DECLARED_EXPERIENCE)).toEqual(
      associations.declaredExperienceAssociations.map(({ associationId, declaredExperience }) => ({
        associationId,
        id: declaredExperience.id,
        title: declaredExperience.title
      }))
    )
    expect(getElementAssociations(associations, EAssociationContextType.DECLARED_PROGRAM)).toEqual(
      associations.declaredProgramAssociations.map(({ associationId, declaredProgram }) => ({
        associationId,
        id: declaredProgram.id,
        title: declaredProgram.title
      }))
    )
  })

  BddTest().then('it should return an empty list when the associations are not loaded', () => {
    expect(getElementAssociations(undefined, EAssociationContextType.DECLARED_SKILL)).toEqual([])
  })
})

BddTest().given('countAssociations', () => {
  BddTest().then('it should count every association by default', () => {
    expect(countAssociations(associations)).toBe(12)
  })

  BddTest().then('it should only count the associations to the given context types', () => {
    expect(countAssociations(associations, [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL])).toBe(5)
  })

  BddTest().then('it should return 0 when the associations are not loaded', () => {
    expect(countAssociations(undefined)).toBe(0)
    expect(countAssociations(mockedEmptyAssociations)).toBe(0)
  })
})

BddTest().given('countElementAssociations', () => {
  BddTest().then('it should only count the associations to the context types associable with the element', () => {
    expect(countElementAssociations(EAssociationContextType.DECLARED_ACTIVITY, associations)).toBe(5)
    expect(countElementAssociations(EAssociationContextType.DECLARED_EXPERIENCE, associations)).toBe(5)
  })
})

BddTest().given('isAssociationLimited', () => {
  BddTest().then('it should consider positive or zero limits as limited', () => {
    expect(isAssociationLimited(0)).toBe(true)
    expect(isAssociationLimited(3)).toBe(true)
  })

  BddTest().then('it should consider missing or negative limits as unlimited', () => {
    expect(isAssociationLimited(undefined)).toBe(false)
    expect(isAssociationLimited(-1)).toBe(false)
  })
})

BddTest().given('isAssociationLimitReached', () => {
  const limits = { [EAssociationContextType.TRACE]: 2 }

  BddTest().then('it should be reached when the count is equal or greater than the limit', () => {
    expect(isAssociationLimitReached(limits, EAssociationContextType.TRACE, 2)).toBe(true)
    expect(isAssociationLimitReached(limits, EAssociationContextType.TRACE, 3)).toBe(true)
  })

  BddTest().then('it should not be reached below the limit or without limit', () => {
    expect(isAssociationLimitReached(limits, EAssociationContextType.TRACE, 1)).toBe(false)
    expect(isAssociationLimitReached(limits, EAssociationContextType.DECLARED_SKILL, 10)).toBe(false)
    expect(isAssociationLimitReached(undefined, EAssociationContextType.TRACE, 10)).toBe(false)
  })
})

BddTest().given('getContextTypeSlug', () => {
  BddTest().then('it should return the kebab case slug of the context type', () => {
    expect(getContextTypeSlug(EAssociationContextType.TRACE)).toBe('trace')
    expect(getContextTypeSlug(EAssociationContextType.DECLARED_SKILL)).toBe('declared-skill')
  })

  BddTest().then('it should return the plural kebab case slug of the context type', () => {
    expect(getContextTypeSlug(EAssociationContextType.TRACE, true)).toBe('traces')
    expect(getContextTypeSlug(EAssociationContextType.DECLARED_ACTIVITY, true)).toBe('declared-activities')
    expect(getContextTypeSlug(EAssociationContextType.DECLARED_EXPERIENCE, true)).toBe('declared-experiences')
    expect(getContextTypeSlug(EAssociationContextType.DECLARED_PROGRAM, true)).toBe('declared-programs')
  })
})
