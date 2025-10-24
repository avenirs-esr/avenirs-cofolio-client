import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import StudentAdditionalSkillAssociations
  from '@/features/student/views/StudentAdditionalSkillView/components/StudentAdditionalSkillAssociations/StudentAdditionalSkillAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student additional skill associations component', () => {
  let wrapper: VueWrapper
  const traces = mockedTraceOverview
  const stubs = {
    StudentTraceCard: {
      name: 'StudentTraceCard',
      props: ['trace'],
      template: '<div class="student-trace-card" />'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('rendered with a list of traces', () => {
    beforeEach(() => {
      wrapper = mount(StudentAdditionalSkillAssociations, {
        props: { traceAssociations: traces },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should display the localized associated traces count', () => {
      const label = wrapper.find('.associated-trace-count')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Mes traces associées (3)')
    })

    BddTest().then('it should render one StudentTraceCard per trace', () => {
      const cards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(cards.length).toBe(3)
    })

    BddTest().then('it should pass the correct trace prop to each StudentTraceCard', () => {
      const cards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(cards[0].props('trace')).toEqual(traces[0])
      expect(cards[1].props('trace')).toEqual(traces[1])
      expect(cards[2].props('trace')).toEqual(traces[2])
    })
  })

  BddTest().when('rendered with an empty list', () => {
    beforeEach(() => {
      wrapper = mount(StudentAdditionalSkillAssociations, {
        props: { traceAssociations: [] },
        global: {
          stubs
        },
      })
    })

    BddTest().then('it should display a count of 0 and no StudentTraceCard', () => {
      const label = wrapper.find('.associated-trace-count')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Mes traces associées (0)')

      const cards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(cards.length).toBe(0)
    })
  })
})
