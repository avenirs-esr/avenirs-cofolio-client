import type { LevelDTO } from '@/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvSkillCard from './AvSkillCard.vue'

vi.doMock('@gouvminint/vue-dsfr', () => ({
  DsfrBadge: {
    name: 'DsfrBadge',
    template: `<div class="dsfr-badge" :class="['fr-badge--' + type]">{{ label }}</div>`,
    props: ['label', 'type', 'small', 'ellipsis'],
  }
}))

vi.doMock('@/ui', () => ({
  VIcon: defineComponent({
    name: 'VIcon',
    props: ['name'],
    template: '<i class="mock-v-icon" />',
  }),
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

describe('avSkillCard.vue', () => {
  const baseProps = {
    skill: {
      id: 'skill1',
      name: 'Résolution de problème',
      trackCount: 4,
      activityCount: 2,
      levels: [
        { id: 'Niv1', name: 'Niveau 1', status: 'VALIDATED' },
        { id: 'Niv2', name: 'Niveau 2', status: 'TO_EVALUATE' },
      ] as LevelDTO[],
    },
    skillColor: '--color-skill',
  } as const

  it('renders skill name, track and activity counts', () => {
    const wrapper = mount(AvSkillCard, {
      props: baseProps,
    })

    expect(wrapper.text()).toContain('Résolution de problème')
    expect(wrapper.text()).toContain('4 traces')
    expect(wrapper.text()).toContain('2 mises en situation')
  })

  it('renders the two expected badges', () => {
    const wrapper = mount(AvSkillCard, {
      props: baseProps,
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(2)
    expect(badges[0].text()).toContain('Niveau 1 validé')
    expect(badges[1].text()).toContain('Niveau 2 à évaluer')
  })

  it('renders only one badge if only one level is present', () => {
    const wrapper = mount(AvSkillCard, {
      props: {
        ...baseProps,
        skill: {
          ...baseProps.skill,
          levels: [{ id: 'Niv1', name: 'Niveau 1', status: 'UNDER_REVIEW' }],
        },
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 en cours d\'évaluation')
  })
})
