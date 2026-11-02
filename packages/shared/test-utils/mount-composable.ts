import type { MountComposableOptions } from '#shared/test-utils/unit/mount-composable'
import { AvSharedMessages } from '#shared/i18n'
import { createMountComposable } from '#shared/test-utils/unit/mount-composable'
import { createI18n } from 'vue-i18n'

export function mountComposable<T> (fn: () => T, options: MountComposableOptions) {
  return createMountComposable({
    i18n: createI18n({
      legacy: false,
      locale: 'fr',
      fallbackLocale: 'en',
      messages: structuredClone(AvSharedMessages),
    }),
  })(fn, options)
}
