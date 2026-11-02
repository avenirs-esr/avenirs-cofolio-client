import type { AvLocale } from '#shared/index'
import { AvAvailableLocales, AvIsoLocaleMap, AvSharedMessages } from '#shared/index'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, expect, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared runtime constants', () => {
  BddTest().when('the locale public entry point is imported', () => {
    BddTest().then('it preserves locale order and the exact ISO mapping', () => {
      const locales: readonly AvLocale[] = AvAvailableLocales
      const mapping: Record<AvLocale, string> = AvIsoLocaleMap
      expect(locales).toEqual(['en', 'fr'])
      expect(Object.keys(mapping)).toEqual(['en', 'fr'])
      expect(mapping).toEqual({ en: 'en-US', fr: 'fr-FR' })
    })
  })

  for (const locale of AvAvailableLocales) {
    BddTest().when(`the ${locale} shared messages are imported`, () => {
      BddTest().then('they contain the query container and API error translations', () => {
        expect(AvSharedMessages[locale]).toMatchObject({
          global: {
            components: {
              QuerySuspense: {
                defaultEmptyStateMessage: locale === 'fr' ? 'Aucune donnée à afficher' : 'No data to display',
                defaultErrorTitle: locale === 'fr'
                  ? 'Une erreur est survenue lors du chargement des données'
                  : 'An error occurred while loading data',
              },
            },
            error: {
              api: {
                ACTIVITY_NOT_FOUND: locale === 'fr' ? 'Activité introuvable' : 'Activity not found',
                BAD_REQUEST: locale === 'fr' ? 'Requête invalide' : 'Bad request',
                SELF_KNOWLEDGE_CATEGORY_NOT_FOUND: locale === 'fr' ? 'Catégorie de connaissance de soi introuvable' : 'Self knowledge category not found',
                USER_NOT_FOUND: locale === 'fr' ? 'Utilisateur introuvable' : 'User not found',
                WRONG_CLASS_TYPE: locale === 'fr' ? 'Le type de classe doit être différent' : 'The class type should be different',
              },
              generic: locale === 'fr'
                ? 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
                : 'An error has occurred. Please try again later.',
            },
          },
        })
      })
    })
  }
})
