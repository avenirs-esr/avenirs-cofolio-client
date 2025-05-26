import type { BaseApiException } from '@/common/exceptions'
import type { EventDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getCalendarDate, getLocalizedAbbrMonth } from '@/common/utils'
import { useStudentEventsSummaryQuery } from '@/features/student/queries'
import { mount } from '@vue/test-utils'
import StudentEventsWidget from './StudentEventsWidget.vue'

const navigateToStudentEvents = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentEvents,
  }),
}))

vi.mock('@/features/student/queries', () => ({
  useStudentEventsSummaryQuery: vi.fn()
}))

const mockedUseStudentEventsSummaryQuery = vi.mocked(useStudentEventsSummaryQuery)

function mockUseStudentEventsSummaryQuery (payload: EventDTO[]) {
  const mockData: Ref<EventDTO[]> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<EventDTO[], BaseApiException>
  mockedUseStudentEventsSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentEventsWidget', () => {
  const events = [
    {
      id: 'event1',
      name: 'Forum de l’écologie et la chimie',
      startDate: '2025-05-19T08:00',
      endDate: '2025-05-19T18:00',
      location: 'Paris'
    },
    {
      id: 'event2',
      name: 'Super forum de la mécanique quantique',
      startDate: '2125-06-25T08:30',
      endDate: '2125-06-25T17:30',
      location: 'Toulouse'
    },
    {
      id: 'event3',
      name: 'Le café des associations',
      startDate: '2125-07-03T09:00',
      endDate: '2125-07-03T17:00',
      location: 'Bordeaux'
    },
    {
      id: 'event4',
      name: 'Assemblée générale ESUP',
      startDate: '2125-08-08T09:30',
      endDate: '2125-08-08T12:15',
      location: 'Brest'
    },
    {
      id: 'event5',
      name: 'Nouvel an 2225',
      startDate: '2225-01-01T09:30',
      endDate: '2225-01-01T12:15',
      location: 'Brest'
    },
  ] as Array<EventDTO>

  beforeEach(() => {
    mockUseStudentEventsSummaryQuery(events)
  })

  it('should only display up to 3 future events sorted by date', () => {
    const wrapper = mount(StudentEventsWidget)
    const richButtons = wrapper.findAll('.av-rich-button')

    expect(richButtons).toHaveLength(3)
    expect(richButtons[0].text()).toContain(getCalendarDate(events[1].startDate))
    expect(richButtons[0].text()).toContain(getLocalizedAbbrMonth(events[1].startDate, 'fr').toUpperCase())
    expect(richButtons[0].text()).toContain(events[1].location)
    expect(richButtons[1].text()).toContain(getCalendarDate(events[2].startDate))
    expect(richButtons[1].text()).toContain(getLocalizedAbbrMonth(events[2].startDate, 'fr').toUpperCase())
    expect(richButtons[1].text()).toContain(events[2].location)
    expect(richButtons[2].text()).toContain(getCalendarDate(events[3].startDate))
    expect(richButtons[2].text()).toContain(getLocalizedAbbrMonth(events[3].startDate, 'fr').toUpperCase())
    expect(richButtons[2].text()).toContain(events[3].location)
  })

  it('should call navigation on button click', async () => {
    const wrapper = mount(StudentEventsWidget)
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentEvents).toHaveBeenCalled()
  })
})
