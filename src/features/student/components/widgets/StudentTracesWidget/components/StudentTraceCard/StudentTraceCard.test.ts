import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import StudentTraceCard from '@/features/student/components/widgets/StudentTracesWidget/components/StudentTraceCard/StudentTraceCard.vue'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest, mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'

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

vi.doMock('@avenirs-esr/avenirs-dsav', () => ({
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

BddTest().given('a student trace card', () => {
  let wrapper: VueWrapper

  const baseProps = {
    trace: mockedTraceOverview[0],
  } as const

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

  BddTest().when('the component is mounted with base props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentTraceCard, {
        props: baseProps,
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the trace name, skill and activity counts', () => {
      expect(wrapper.text()).toContain('Prévenir la pollution à la source')
      expect(wrapper.text()).toContain('1 compétence')
      const amsIconText = wrapper.findComponent({ name: 'StudentCountAmsIconText' })
      expect(amsIconText.exists()).toBe(true)
      expect(amsIconText.props()).toMatchObject({ countAms: baseProps.trace.AMSCount })
    })

    BddTest().then('it should render the program name', () => {
      expect(wrapper.text()).toContain('Master Chimie Verte et Éco-innovations')
    })

    BddTest().then('it should render the DsfrTag with label "Individuel"', () => {
      const tag = wrapper.find('.fr-tag')
      expect(tag.exists()).toBe(true)
      expect(tag.text()).toBe('Individuel')
    })
  })

  BddTest().when('the component is mounted with a skillCount greaten than 3', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentTraceCard, {
        props: {
          trace: {
            ...baseProps.trace,
            skillCount: 5,
          },
        },
      })
    })

    BddTest().then('it should render up to 3 skill icons', () => {
      const icons = wrapper.findAll('.student-trace-card__lineicon')
      expect(icons).toHaveLength(3)
    })
  })
})
