import type { AssociationsDTO, EAssociationContextType as ContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect } from 'vitest'
import {
  createMockedDeclaredActivityAssociations,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredProgramAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedEmptyAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { useDissociationState } from '@/features/student/associations/composables/use-dissociation-state/use-dissociation-state'

BddTest().given('the useDissociationState composable', () => {
  let composable: ReturnType<typeof useDissociationState>
  let unmount: () => void

  const cases: Array<[ContextType, string, Partial<AssociationsDTO>]> = [
    [EAssociationContextType.TRACE, 'trace', { traceAssociations: createMockedTraceAssociations(1) }],
    [EAssociationContextType.DECLARED_ACTIVITY, 'activité', { declaredActivityAssociations: createMockedDeclaredActivityAssociations(1) }],
    [EAssociationContextType.DECLARED_SKILL, 'compétence', { skillProgressAssociations: createMockedDeclaredSkillAssociations(1) }],
    [EAssociationContextType.DECLARED_EXPERIENCE, 'expérience', { declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(1) }],
    [EAssociationContextType.DECLARED_PROGRAM, 'formation', { declaredProgramAssociations: createMockedDeclaredProgramAssociations(1) }]
  ]

  beforeEach(() => {
    const mounted = mountComposable(useDissociationState, { useI18n: true })
    composable = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => unmount())

  cases.forEach(([type, name, association]) => {
    BddTest().when(`there are no ${type} associations`, () => {
      BddTest().then('it should disable dissociation with the translated reason, whether associations are unloaded or empty', () => {
        const expected = { disabled: true, disabledTooltip: `Aucune ${name} à dissocier` }
        expect(composable.getDissociationState(type, undefined)).toEqual(expected)
        expect(composable.getDissociationState(type, mockedEmptyAssociations)).toEqual(expected)
      })
    })

    BddTest().when(`there is a ${type} association`, () => {
      const associations = { ...mockedEmptyAssociations, ...association }

      BddTest().then('it should enable dissociation of this type without a tooltip', () => {
        expect(composable.getDissociationState(type, associations)).toEqual({
          disabled: false,
          disabledTooltip: undefined
        })
      })

      BddTest().then('it should keep dissociation of another type disabled', () => {
        const otherType = cases.find(([candidate]) => candidate !== type)![0]
        expect(composable.getDissociationState(otherType, associations).disabled).toBe(true)
      })
    })
  })
})
