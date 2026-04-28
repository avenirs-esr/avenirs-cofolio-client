import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { AvTagStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    MDI_ICONS: {
      ATTACH_FILE: 'mdi-attach-file',
      STAR_SHOOTING_OUTLINE: 'mdi-star-shooting',
      TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
      SWAP_VERTICAL_VARIANT: 'mdi-swap-vertical-variant',
    },
    RI_ICONS: {
      DICE_4_LINE: 'ri-dice-4-line',
    },
  }
})

BddTest().given('a student trace card', () => {
  let wrapper: VueWrapper

  const baseProps = {
    trace: mockedTraceOverview[0],
  } as const

  const stubs = {
    AvTag: AvTagStub,
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

    BddTest().then('it should render the trace name, skill counts', () => {
      expect(wrapper.text()).toContain('Prévenir la pollution à la source')
    })

    BddTest().then('it should render the program name', () => {
      expect(wrapper.text()).toContain('Master Chimie Verte et Éco-innovations')
    })

    BddTest().then('it should render the AvTag with label "Individuel"', () => {
      const tag = wrapper.findComponent({ name: 'AvTag' })
      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('Individuel')
    })
  })
})
