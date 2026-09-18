import type { AssociationSearchResultDTO } from '@/api/avenir-esr'
import { EActivityThematic, EAssociationContextType, EExperienceType, EExternalSkillType } from '@/api/avenir-esr'
import { useAssociationSearchResults } from '@/features/student/global/composables/use-association-search-results/use-association-search-results'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the useAssociationSearchResults composable', () => {
  let composable: ReturnType<typeof useAssociationSearchResults>

  beforeEach(() => {
    const { result } = mountComposable(() => useAssociationSearchResults(), {
      useI18n: true
    })
    composable = result
  })

  BddTest().when('a declared activity search result is mapped', () => {
    let searchResult: AssociationSearchResultDTO

    beforeEach(() => {
      searchResult = {
        id: 'activity-1',
        title: 'Mon activité',
        category: EActivityThematic.PROGRAMS,
        disabled: false
      }
    })

    BddTest().then('it should map the id, the title and the disabled flag', () => {
      const association = composable.toAssociation(searchResult, EAssociationContextType.DECLARED_ACTIVITY)

      expect(association.id).toBe('activity-1')
      expect(association.title).toBe('Mon activité')
      expect(association.disabled).toBe(false)
    })

    BddTest().then('it should map the category to the translated thematic', () => {
      expect(composable.toAssociation(searchResult, EAssociationContextType.DECLARED_ACTIVITY).description).toBe('Mes formations')
    })
  })

  BddTest().when('a declared skill search result is mapped', () => {
    BddTest().then('it should map the category to the translated declared skill type', () => {
      const association = composable.toAssociation({
        id: 'skill-1',
        title: 'Compétence Rome',
        category: EExternalSkillType.ROME4,
        disabled: false
      }, EAssociationContextType.DECLARED_SKILL)

      expect(association.description).toBe('Rome 4.0')
    })
  })

  BddTest().when('a declared experience search result is mapped', () => {
    BddTest().then('it should map the category to the translated experience type', () => {
      const association = composable.toAssociation({
        id: 'experience-1',
        title: 'Mon expérience',
        category: EExperienceType.PERSONAL,
        disabled: false
      }, EAssociationContextType.DECLARED_EXPERIENCE)

      expect(association.description).toBe('Expérience personnelle')
    })
  })

  BddTest().when('a trace search result is mapped', () => {
    BddTest().then('it should not set any description since traces have no category', () => {
      const association = composable.toAssociation({
        id: 'trace-1',
        title: 'Ma trace',
        disabled: true
      }, EAssociationContextType.TRACE)

      expect(association.description).toBeUndefined()
      expect(association.disabled).toBe(true)
    })
  })

  BddTest().when('a search result without category is mapped', () => {
    BddTest().then('it should not set any description', () => {
      const association = composable.toAssociation({
        id: 'activity-5',
        title: 'Activité sans thématique',
        disabled: false
      }, EAssociationContextType.DECLARED_ACTIVITY)

      expect(association.description).toBeUndefined()
    })
  })

  BddTest().when('several search results are mapped at once', () => {
    BddTest().then('it should map every search result', () => {
      const associations = composable.toAssociations([
        { id: 'skill-1', title: 'Compétence Rome', category: EExternalSkillType.ROME4, disabled: false },
        { id: 'skill-2', title: 'Compétence Casoc', category: EExternalSkillType.CASOC, disabled: true }
      ], EAssociationContextType.DECLARED_SKILL)

      expect(associations).toEqual([
        { id: 'skill-1', title: 'Compétence Rome', description: 'Rome 4.0', disabled: false },
        { id: 'skill-2', title: 'Compétence Casoc', description: 'Casoc onisep', disabled: true }
      ])
    })
  })
})
