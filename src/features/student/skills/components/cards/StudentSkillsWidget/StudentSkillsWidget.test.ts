import { mockedProgramsProgressOverview } from '@/__mocks__/fixtures/student'
import { createStudentProgressOverviewHandler } from '@/__mocks__/msw/handlers/student/program-progress.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.stub'
import StudentSkillsWidget from '@/features/student/skills/components/cards/StudentSkillsWidget/StudentSkillsWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentSkills = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSkills,
    }),
  }
})

BddTest().given('a student skills widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillsWidget>>

  const stubs = { HomeWidget: HomeWidgetStub, RouterLink: RouterLinkStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted and no courses are available', () => {
    beforeEach(async () => {
      const handler = createStudentProgressOverviewHandler([])
      server.use(handler)

      wrapper = mountComponent(StudentSkillsWidget, { global: { stubs } })
    })

    BddTest().then('it should not display the home main widget', () => {
      const widget = wrapper.find('.home-main-widget')
      expect(widget.exists()).toBe(false)
    })
  })

  BddTest().when('1 course is available', () => {
    beforeEach(async () => {
      const handler = createStudentProgressOverviewHandler(mockedProgramsProgressOverview.slice().slice(0, 1))
      server.use(handler)

      wrapper = mountComponent(StudentSkillsWidget, { global: { stubs } })

      await vi.waitFor(() => {
        expect(wrapper.find('.home-main-widget').exists()).toBe(true)
      })
    })

    BddTest().then('it should display the home main widget', () => {
      const widget = wrapper.find('.home-main-widget')
      expect(widget.exists()).toBe(true)
    })

    BddTest().then('it should display 1 course and up to 6 skills', () => {
      const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
      expect(studentSkillsWidgetContainers).toHaveLength(1)
      expect(studentSkillsWidgetContainers[0].props('maxSkillsDisplayed')).toBe(6)
    })

    BddTest().and('clicking on navigation button', () => {
      beforeEach(async () => {
        const btn = wrapper.find('.see-all-button')
        await btn.trigger('click')
      })

      BddTest().then('it should call navigation', async () => {
        expect(navigateToStudentSkills).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('2 courses are available', () => {
    beforeEach(async () => {
      const handler = createStudentProgressOverviewHandler(mockedProgramsProgressOverview.slice().slice(0, 2))
      server.use(handler)

      wrapper = mountComponent(StudentSkillsWidget, { global: { stubs } })

      await vi.waitFor(() => {
        expect(wrapper.find('.home-main-widget').exists()).toBe(true)
      })
    })

    BddTest().then('it should display the home main widget', () => {
      const widget = wrapper.find('.home-main-widget')
      expect(widget.exists()).toBe(true)
    })

    BddTest().then('it should display 2 courses and up to 3 skills by course', () => {
      const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
      expect(studentSkillsWidgetContainers).toHaveLength(2)
      studentSkillsWidgetContainers.forEach((container) => {
        expect(container.props('maxSkillsDisplayed')).toBe(3)
      })
    })
  })
})
