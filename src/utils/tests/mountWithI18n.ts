import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const messages = {
  fr: {
    ui: {
      AvSkillCard: {
        activityCount: '0 mise en situation | 1 mise en situation | {count} mises en situation',
        badgeStatus: {
          notValidated: 'non validé',
          toEvaluate: 'à évaluer',
          underReview: 'en cours d\'évaluation',
          validated: 'validé'
        },
        trackCount: '0 trace | 1 trace | {count} traces'
      },
      AvTrackCard: {
        activityCount: '0 mise en situation | 1 mise en situation | {count} mises en situation',
        lifeProject: 'Projet de vie',
        skillCount: '0 compétence | 1 compétence | {count} compétences',
        tagLabel: {
          group: 'Groupe'
        }
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
