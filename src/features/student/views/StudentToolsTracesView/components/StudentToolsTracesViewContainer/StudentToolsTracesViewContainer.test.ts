import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { TracePaginationSizePicker } from '@/common/components'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StudentDetailedTraceCard from '../StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewContainer from './StudentToolsTracesViewContainer.vue'

describe('studentToolsTracesViewContainer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i < 17; i++) {
    const dayNumber = i < 10 ? `0${i}` : i
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      status: TraceStatus.UNASSOCIATED,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      deletionDate: `2025-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  it('should render TracePaginationSizePicker', () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      props: {
        traces: mockedTraces,
      },
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.findComponent(TracePaginationSizePicker).exists()).toBe(true)
  })

  it('should render one StudentDetailedTraceCard per trace', () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      props: {
        traces: mockedTraces,
      },
      global: {
        plugins: [createPinia()]
      }
    })

    const cards = wrapper.findAllComponents(StudentDetailedTraceCard)
    expect(cards).toHaveLength(mockedTraces.length)

    cards.forEach((cardWrapper, index) => {
      expect(cardWrapper.props('trace')).toEqual(mockedTraces[index])
    })
  })
})
