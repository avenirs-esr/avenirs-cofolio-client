import type { AssociationSearchResultDeclaredActivityDTO } from '@/api/avenir-esr'
import { EActivityThematic } from '@/api/avenir-esr'
import { useDeclaredActivityAssociation } from '@/features/student/buildProject/composables/activities/use-declared-activity-association/use-declared-activity-association'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the useDeclaredActivityAssociation composable', () => {
  let composable: ReturnType<typeof useDeclaredActivityAssociation>

  beforeEach(() => {
    const { result } = mountComposable(() => useDeclaredActivityAssociation(), {
      useI18n: true
    })
    composable = result
  })

  BddTest().when('declaredActivityToAssociation is called with a thematic', () => {
    let declaredActivity: AssociationSearchResultDeclaredActivityDTO

    beforeEach(() => {
      declaredActivity = {
        id: 'activity-1',
        title: 'Mon activité',
        thematic: EActivityThematic.PROGRAMS,
        disabled: false
      }
    })

    BddTest().then('it should map id correctly', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).id).toBe('activity-1')
    })

    BddTest().then('it should map title correctly', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).title).toBe('Mon activité')
    })

    BddTest().then('it should map disabled correctly', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).disabled).toBe(false)
    })

    BddTest().then('it should map description to translated thematic', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).description).toBe('Mes formations')
    })
  })

  BddTest().when('declaredActivityToAssociation is called with thematic EXPERIENCES', () => {
    let declaredActivity: AssociationSearchResultDeclaredActivityDTO

    beforeEach(() => {
      declaredActivity = {
        id: 'activity-2',
        title: 'Expérience pro',
        thematic: EActivityThematic.EXPERIENCES,
        disabled: false
      }
    })

    BddTest().then('it should map description to translated thematic', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).description).toBe('Mes expériences')
    })
  })

  BddTest().when('declaredActivityToAssociation is called with thematic SELF_KNOWLEDGE', () => {
    let declaredActivity: AssociationSearchResultDeclaredActivityDTO

    beforeEach(() => {
      declaredActivity = {
        id: 'activity-3',
        title: 'Connaissance de soi',
        thematic: EActivityThematic.SELF_KNOWLEDGE,
        disabled: false
      }
    })

    BddTest().then('it should map description to translated thematic', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).description).toBe('Me connaître')
    })
  })

  BddTest().when('declaredActivityToAssociation is called with disabled true', () => {
    let declaredActivity: AssociationSearchResultDeclaredActivityDTO

    beforeEach(() => {
      declaredActivity = {
        id: 'activity-4',
        title: 'Activité désactivée',
        thematic: EActivityThematic.TRANSVERSAL,
        disabled: true
      }
    })

    BddTest().then('it should map disabled to true', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity).disabled).toBe(true)
    })
  })

  BddTest().when('declaredActivityToAssociation is called without thematic', () => {
    let declaredActivity: Omit<AssociationSearchResultDeclaredActivityDTO, 'thematic'>

    beforeEach(() => {
      declaredActivity = {
        id: 'activity-5',
        title: 'Activité sans thématique',
        disabled: false
      }
    })

    BddTest().then('it should map description to undefined', () => {
      expect(composable.declaredActivityToAssociation(declaredActivity as AssociationSearchResultDeclaredActivityDTO).description).toBeUndefined()
    })
  })
})
