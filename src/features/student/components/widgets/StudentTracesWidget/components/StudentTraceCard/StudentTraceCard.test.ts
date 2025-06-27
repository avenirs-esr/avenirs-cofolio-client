import StudentTraceCard from '@/features/student/components/widgets/StudentTracesWidget/components/StudentTraceCard/StudentTraceCard.vue'
import { TraceType } from '@/types'
import { RouterLinkStub } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it, vi } from 'vitest'

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
    STAR_SHOOTING_OUTLINE: 'mdi-star-shooting',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
    SWAP_VERTICAL_VARIANT: 'mdi-swap-vertical-variant',
  },
  RI_ICONS: {
    DICE_4_LINE: 'ri-dice-4-line',
  },
}))

describe('studentTraceCard.vue', () => {
  const stubs = {
    StudentCountAmsIconText: {
      name: 'StudentCountAmsIconText',
      template: `<div class="student-count-ams-icon-text" />`,
      props: ['countAms']
    },
    RouterLink: RouterLinkStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const baseProps = {
    trace: {
      id: 'trace1',
      name: 'Parcours scientifique',
      skillCount: 3,
      activityCount: 5,
      filedAt: '2025-02-07T23:08:51',
      type: TraceType.GROUP
    },
  } as const

  it('renders the trace name, skill and activity counts', async () => {
    const wrapper = await mountWithRouter(StudentTraceCard, {
      props: baseProps,
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain('Parcours scientifique')
    expect(wrapper.text()).toContain('3 compétences')
    const amsIconText = wrapper.findComponent({ name: 'StudentCountAmsIconText' })
    expect(amsIconText.exists()).toBe(true)
    expect(amsIconText.props()).toMatchObject({ countAms: baseProps.trace.activityCount })
  })

  it('renders the fixed label "Projet de vie"', async () => {
    const wrapper = await mountWithRouter(StudentTraceCard, {
      props: baseProps,
    })

    expect(wrapper.text()).toContain('Projet de vie')
  })

  it('renders the DsfrTag with label "Groupe"', async () => {
    const wrapper = await mountWithRouter(StudentTraceCard, {
      props: baseProps,
    })

    const tag = wrapper.find('.fr-tag')
    expect(tag.exists()).toBe(true)
    expect(tag.text()).toBe('Groupe')
  })

  it('renders up to 3 skill icons based on skillCount', async () => {
    const wrapper = await mountWithRouter(StudentTraceCard, {
      props: {
        trace: {
          ...baseProps.trace,
          skillCount: 5,
        },
      },
    })

    const icons = wrapper.findAll('.student-trace-card__lineicon')
    expect(icons).toHaveLength(3)
  })
})
