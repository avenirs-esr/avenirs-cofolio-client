import { TrackType } from '@/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import StudentTrackCard from './StudentTrackCard.vue'

vi.doMock('@gouvminint/vue-dsfr', () => ({
  DsfrTag: {
    name: 'DsfrTag',
    props: ['label', 'icon'],
    template: `<div class="fr-tag">{{ label }}</div>`,
  },
  VIcon: defineComponent({
    name: 'VIcon',
    props: ['name'],
    template: '<i class="mock-v-icon" />',
  }),
}))

vi.doMock('@/ui/tokens', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    STAR_SHOOTING: 'mdi-star-shooting',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
    SWAP_VERTICAL_VARIANT: 'mdi-swap-vertical-variant',
  },
  RI_ICONS: {
    DICE_4: 'ri-dice-4-line',
  },
}))

describe('studentTrackCard.vue', () => {
  const baseProps = {
    track: {
      id: 'track1',
      name: 'Parcours scientifique',
      skillCount: 3,
      activityCount: 5,
      filedAt: '2025-02-07T23:08:51',
      type: TrackType.GROUP
    },
  } as const

  it('renders the track name, skill and activity counts', () => {
    const wrapper = mount(StudentTrackCard, {
      props: baseProps,
    })

    expect(wrapper.text()).toContain('Parcours scientifique')
    expect(wrapper.text()).toContain('3 compétences')
    expect(wrapper.text()).toContain('5 mises en situation')
  })

  it('renders the fixed label "Projet de vie"', () => {
    const wrapper = mount(StudentTrackCard, {
      props: baseProps,
    })

    expect(wrapper.text()).toContain('Projet de vie')
  })

  it('renders the DsfrTag with label "Groupe"', () => {
    const wrapper = mount(StudentTrackCard, {
      props: baseProps,
    })

    const tag = wrapper.find('.fr-tag')
    expect(tag.exists()).toBe(true)
    expect(tag.text()).toBe('Groupe')
  })

  it('renders up to 3 skill icons based on skillCount', () => {
    const wrapper = mount(StudentTrackCard, {
      props: {
        track: {
          ...baseProps.track,
          skillCount: 5,
        },
      },
    })

    const icons = wrapper.findAll('.student-track-card__lineicon')
    expect(icons).toHaveLength(3)
  })
})
