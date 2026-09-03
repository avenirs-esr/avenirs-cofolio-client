import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { AvIconTextStub, AvTagStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'

BddTest().given('a student trace card', () => {
  let wrapper: VueWrapper

  const baseProps = {
    trace: mockedTraceOverview[0],
  } as const

  const stubs = {
    AvTag: AvTagStub,
    AvIconText: AvIconTextStub,
    RouterLink: RouterLinkStub,
    FloatingIconCard: FloatingIconCardStub,
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

    BddTest().then('it should render the trace name', () => {
      expect(wrapper.text()).toContain('Prévenir la pollution à la source')
    })

    BddTest().then('it should render the life project category', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toContain('Projet de vie')
    })

    BddTest().then('it should render the AvTag with label "Individuel"', () => {
      const tag = wrapper.findComponent({ name: 'AvTag' })
      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('Individuel')
    })
  })
})
