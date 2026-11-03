import { AvSharedMessages } from '#shared/i18n'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'

const unmounts: (() => void)[] = []
const useTestI18n = () => useI18n()

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

BddTest().given('the private shared composable mounting helper', () => {
  BddTest().when('i18n is enabled', () => {
    let i18n: ReturnType<typeof useTestI18n>

    beforeEach(() => {
      const mounted = mountComposable(useTestI18n, { useI18n: true })
      i18n = mounted.result
      unmounts.push(mounted.unmount)
    })

    BddTest().then('it registers the shared translations with French and an English fallback', () => {
      expect(i18n.locale.value).toBe('fr')
      expect(i18n.fallbackLocale.value).toBe('en')
      expect(i18n.t('global.breadcrumb.ariaLabel')).toBe('Fil d\'Ariane')
      expect(i18n.t('global.error.api.USER_NOT_FOUND')).toBe('Utilisateur introuvable')
    })

    BddTest().and('the locale switches to English', () => {
      beforeEach(() => {
        i18n.locale.value = 'en'
      })

      BddTest().then('it uses the shared English translations', () => {
        expect(i18n.t('global.breadcrumb.ariaLabel')).toBe('Breadcrumb')
      })
    })

    BddTest().and('a mounted composable changes its locale and messages', () => {
      let second: ReturnType<typeof useTestI18n>

      beforeEach(() => {
        i18n.locale.value = 'en'
        i18n.mergeLocaleMessage('fr', { global: { breadcrumb: { ariaLabel: 'Changed' } } })
        const mounted = mountComposable(useTestI18n, { useI18n: true })
        second = mounted.result
        unmounts.push(mounted.unmount)
      })

      BddTest().then('it isolates later mounts and the original shared messages', () => {
        expect(second).not.toBe(i18n)
        expect(second.locale.value).toBe('fr')
        expect(second.t('global.breadcrumb.ariaLabel')).toBe('Fil d\'Ariane')
        expect(AvSharedMessages.fr.global.breadcrumb.ariaLabel).toBe('Fil d\'Ariane')
      })
    })
  })

  BddTest().when('i18n is not enabled', () => {
    let translation: unknown

    beforeEach(() => {
      const mounted = mountComposable(() => getCurrentInstance()?.appContext.config.globalProperties.$t, {})
      translation = mounted.result
      unmounts.push(mounted.unmount)
    })

    BddTest().then('it preserves the optional plugin contract', () => {
      expect(translation).toBeUndefined()
    })
  })
})
