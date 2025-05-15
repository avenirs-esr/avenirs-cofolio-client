import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const messages = {
  fr: {
    ui: {
      AvSkillCard: {
        trackCount: '1 trace | {count} traces'
      }
    }
  }
}

export function mountWithI18n (component: any, options = {}) {
  const i18n = createI18n({ legacy: false, locale: 'fr', messages })
  return mount(component, {
    global: { plugins: [i18n] },
    ...options,
  })
}
