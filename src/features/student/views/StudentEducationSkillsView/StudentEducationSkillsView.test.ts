import type { BaseApiException } from '@/common/exceptions'
import type { ProgramProgressViewDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { mockedPrograms, useProgramProgressViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentEducationSkillsView from './StudentEducationSkillsView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

vi.mock(import('@/features/student/queries'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useProgramProgressViewQuery: vi.fn()
  }
})

const mockedUseProgramProgressViewQuery = vi.mocked(useProgramProgressViewQuery)

function mockUseProgramProgressViewQuery (payload: ProgramProgressViewDTO[]) {
  const mockData: Ref<ProgramProgressViewDTO[]> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<ProgramProgressViewDTO[], BaseApiException>
  mockedUseProgramProgressViewQuery.mockReturnValue(queryMockedData)
}

describe('studentEducationSkillsView', () => {
  const stubs = {
    StudentEducationSkillsViewContainer: {
      name: 'StudentEducationSkillsViewContainer',
      template: `<div class="student-education-skills-view-container"/>`,
      props: ['course'],
    }
  }
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProgramProgressViewQuery(mockedPrograms)
  })
  const title = 'Mes compétences visées par ma formation'
  const title_plural = 'Mes compétences visées par mes formations'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes compétences' }

  it('should render PageTitle with base title', () => {
    vi.clearAllMocks()
    mockUseProgramProgressViewQuery([mockedPrograms[0]])
    const wrapper = mount(StudentEducationSkillsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })

  it('should render PageTitle with plural title', () => {
    const wrapper = mount(StudentEducationSkillsView)
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title_plural)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })

  it('should not render StudentEducationSkillsViewContainer with no course', () => {
    vi.clearAllMocks()
    mockUseProgramProgressViewQuery([])
    const wrapper = mount(StudentEducationSkillsView, {
      global: {
        stubs
      }
    })
    const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })

    expect(containers).toHaveLength(0)
  })

  it('should render 1 StudentEducationSkillsViewContainer with 1 course', () => {
    vi.clearAllMocks()
    mockUseProgramProgressViewQuery([mockedPrograms[0]])
    const wrapper = mount(StudentEducationSkillsView, {
      global: {
        stubs
      }
    })
    const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })

    expect(containers).toHaveLength(1)
  })

  it('should render 2 StudentEducationSkillsViewContainer with 2 course', () => {
    const wrapper = mount(StudentEducationSkillsView, {
      global: {
        stubs
      }
    })
    const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })

    expect(containers).toHaveLength(2)
  })
})
