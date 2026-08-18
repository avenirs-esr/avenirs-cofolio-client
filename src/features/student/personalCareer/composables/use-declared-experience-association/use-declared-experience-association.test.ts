import type { AssociationSearchResultDeclaredExperienceDTO } from '@/api/avenir-esr'
import { EExperienceType } from '@/api/avenir-esr'
import { useDeclaredExperienceAssociation } from '@/features/student/personalCareer/composables/use-declared-experience-association/use-declared-experience-association'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the useDeclaredExperienceAssociation composable', () => {
  let composable: ReturnType<typeof useDeclaredExperienceAssociation>

  beforeEach(() => {
    const { result } = mountComposable(() => useDeclaredExperienceAssociation(), {
      useI18n: true
    })
    composable = result
  })

  BddTest().when('declaredExperienceToAssociation is called with experience type PERSONAL', () => {
    let declaredExperience: AssociationSearchResultDeclaredExperienceDTO

    beforeEach(() => {
      declaredExperience = {
        id: 'experience-1',
        title: 'Mon expérience',
        experienceType: EExperienceType.PERSONAL,
        disabled: false
      }
    })

    BddTest().then('it should map id correctly', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).id).toBe('experience-1')
    })

    BddTest().then('it should map title correctly', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).title).toBe('Mon expérience')
    })

    BddTest().then('it should map disabled correctly', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).disabled).toBe(false)
    })

    BddTest().then('it should map description to translated experience type', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).description).toBe('Expérience personnelle')
    })
  })

  BddTest().when('declaredExperienceToAssociation is called with experience type PROFESSIONAL', () => {
    let declaredExperience: AssociationSearchResultDeclaredExperienceDTO

    beforeEach(() => {
      declaredExperience = {
        id: 'experience-2',
        title: 'Stage en entreprise',
        experienceType: EExperienceType.PROFESSIONAL,
        disabled: false
      }
    })

    BddTest().then('it should map description to translated experience type', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).description).toBe('Expérience professionnelle')
    })
  })

  BddTest().when('declaredExperienceToAssociation is called with disabled true', () => {
    let declaredExperience: AssociationSearchResultDeclaredExperienceDTO

    beforeEach(() => {
      declaredExperience = {
        id: 'experience-3',
        title: 'Expérience désactivée',
        experienceType: EExperienceType.PROFESSIONAL,
        disabled: true
      }
    })

    BddTest().then('it should map disabled to true', () => {
      expect(composable.declaredExperienceToAssociation(declaredExperience).disabled).toBe(true)
    })
  })
})
