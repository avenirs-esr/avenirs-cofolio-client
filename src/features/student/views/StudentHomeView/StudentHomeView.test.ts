import { mount } from '@vue/test-utils'
import StudentHomeView from './StudentHomeView.vue'

vi.mock('@/features/student/components', () => ({
  StudentDeliverablesWidget: { name: 'StudentDeliverablesWidget', template: '<div />' },
  StudentEventsWidget: { name: 'StudentEventsWidget', template: '<div />' },
  StudentOverviewWidget: { name: 'StudentOverviewWidget', template: '<div />' },
  StudentPagesWidget: { name: 'StudentPagesWidget', template: '<div />' },
  StudentResumesWidget: { name: 'StudentResumesWidget', template: '<div />' },
  StudentSkillsWidget: { name: 'StudentSkillsWidget', template: '<div />' },
  StudentTracksWidget: { name: 'StudentTracksWidget', template: '<div />' },
}))

describe('studentHomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all expected widgets in the correct layout', () => {
    const wrapper = mount(StudentHomeView)

    const leftContainer = wrapper.find('.student-home-left-container')
    const rightContainer = wrapper.find('.student-home-right-container')

    expect(leftContainer.exists()).toBe(true)
    expect(leftContainer.findComponent({ name: 'StudentOverviewWidget' }).exists()).toBe(true)
    expect(leftContainer.findComponent({ name: 'StudentEventsWidget' }).exists()).toBe(true)
    expect(leftContainer.findComponent({ name: 'StudentResumesWidget' }).exists()).toBe(true)
    expect(leftContainer.findComponent({ name: 'StudentPagesWidget' }).exists()).toBe(true)

    expect(rightContainer.exists()).toBe(true)
    expect(rightContainer.findComponent({ name: 'StudentSkillsWidget' }).exists()).toBe(true)
    expect(rightContainer.findComponent({ name: 'StudentDeliverablesWidget' }).exists()).toBe(true)
    expect(rightContainer.findComponent({ name: 'StudentTracksWidget' }).exists()).toBe(true)
  })
})
