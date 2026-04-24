import type { AssociationSearchResultDeclaredSkillIDTO } from '@/api/avenir-esr'
import { EExternalSkillType } from '@/api/avenir-esr'
import { useDeclaredSkillAssociation } from '@/features/student/declaredSkills/composables/use-declared-skill-association/use-declared-skill-association'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the useDeclaredSkillAssociation composable', () => {
  let composable: ReturnType<typeof useDeclaredSkillAssociation>

  beforeEach(() => {
    const { result } = mountComposable(() => useDeclaredSkillAssociation(), {
      useI18n: true
    })
    composable = result
  })

  BddTest().when('declaredSkillToAssociation is called with type ROME4', () => {
    let declaredSkill: AssociationSearchResultDeclaredSkillIDTO

    beforeEach(() => {
      declaredSkill = {
        id: 'skill-1',
        title: 'Compétence Rome',
        type: EExternalSkillType.ROME4,
        disabled: false
      }
    })

    BddTest().then('it should map id correctly', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).id).toBe('skill-1')
    })

    BddTest().then('it should map title correctly', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).title).toBe('Compétence Rome')
    })

    BddTest().then('it should map disabled correctly', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).disabled).toBe(false)
    })

    BddTest().then('it should map description to translated type', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).description).toBe('Rome 4.0')
    })
  })

  BddTest().when('declaredSkillToAssociation is called with type CASOC', () => {
    let declaredSkill: AssociationSearchResultDeclaredSkillIDTO

    beforeEach(() => {
      declaredSkill = {
        id: 'skill-2',
        title: 'Compétence Casoc',
        type: EExternalSkillType.CASOC,
        disabled: false
      }
    })

    BddTest().then('it should map description to translated type', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).description).toBe('Casoc onisep')
    })
  })

  BddTest().when('declaredSkillToAssociation is called with type CASOL', () => {
    let declaredSkill: AssociationSearchResultDeclaredSkillIDTO

    beforeEach(() => {
      declaredSkill = {
        id: 'skill-3',
        title: 'Compétence Casol',
        type: EExternalSkillType.CASOL,
        disabled: false
      }
    })

    BddTest().then('it should map description to translated type', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).description).toBe('Casol onisep')
    })
  })

  BddTest().when('declaredSkillToAssociation is called with disabled true', () => {
    let declaredSkill: AssociationSearchResultDeclaredSkillIDTO

    beforeEach(() => {
      declaredSkill = {
        id: 'skill-4',
        title: 'Compétence désactivée',
        type: EExternalSkillType.XXI,
        disabled: true
      }
    })

    BddTest().then('it should map disabled to true', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill).disabled).toBe(true)
    })
  })

  BddTest().when('declaredSkillToAssociation is called without type', () => {
    let declaredSkill: Omit<AssociationSearchResultDeclaredSkillIDTO, 'type'>

    beforeEach(() => {
      declaredSkill = {
        id: 'skill-5',
        title: 'Compétence sans type',
        disabled: false
      }
    })

    BddTest().then('it should map description to undefined', () => {
      expect(composable.declaredSkillToAssociation(declaredSkill as AssociationSearchResultDeclaredSkillIDTO).description).toBeUndefined()
    })
  })
})
