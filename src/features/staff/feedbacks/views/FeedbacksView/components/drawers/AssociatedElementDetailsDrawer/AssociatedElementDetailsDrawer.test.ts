import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { declaredExperienceViewDTOFixture } from '@/__mocks__/fixtures/student'
import { createMockedDeclaredSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { DrawerStub } from '@/common/components/Drawer/Drawer.stub'
import AssociatedElementDetailsDrawer, { type AssociatedElementDetailsDrawerProps } from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.vue'
import { DeclaredSkillDetailsStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.stub'
import { DeclaredExperienceDetailsStub } from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.stub'
import { StudentTraceDetailsStub } from '@/features/student/traces/components/StudentTraceDetails/StudentTraceDetails.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const TRACE_TITLE = 'Détails de la trace\u00A0: {title}'
const SKILL_TITLE = 'Détails de la compétence\u00A0: {title}'
const EXPERIENCE_TITLE = 'Détails de l\'expérience\u00A0: {title}'

const mockedFeedbackTrace: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithFile,
}

const mockedFeedbackDeclaredSkill: FeedbackAssociatedElement = {
  type: EAssociationContextType.DECLARED_SKILL,
  data: createMockedDeclaredSkillProgressDetailsDTO('declared-skill-drawer'),
}

const mockedFeedbackDeclaredExperience: FeedbackAssociatedElement = {
  type: EAssociationContextType.DECLARED_EXPERIENCE,
  data: declaredExperienceViewDTOFixture,
}

BddTest().given('an AssociatedElementDetailsDrawer component', () => {
  let wrapper: ReturnType<typeof mountComponent>

  const stubs = {
    Drawer: DrawerStub,
    DeclaredExperienceDetails: DeclaredExperienceDetailsStub,
    DeclaredSkillDetails: DeclaredSkillDetailsStub,
    StudentTraceDetails: StudentTraceDetailsStub,
  }

  const mountWith = (props: Partial<AssociatedElementDetailsDrawerProps> = {}) => {
    wrapper = mountComponent(AssociatedElementDetailsDrawer, {
      props: {
        feedbackAssociatedElement: mockedFeedbackTrace,
        ...props
      },
      global: { stubs },
    })
  }

  const getDrawer = () => wrapper.findComponent(DrawerStub)
  const getExperienceDetails = () => wrapper.findComponent(DeclaredExperienceDetailsStub)
  const getSkillDetails = () => wrapper.findComponent(DeclaredSkillDetailsStub)
  const getTraceDetails = () => wrapper.findComponent(StudentTraceDetailsStub)

  const expectDrawerVisible = () => {
    const drawer = getDrawer()
    expect(drawer.exists()).toBe(true)
    expect(drawer.props('show')).toBe(true)
  }

  const expectTitle = (base: string, entityTitle: string) => {
    const expectedTitle = base.replace('{title}', entityTitle)
    expect(wrapper.text()).toContain(expectedTitle)
  }

  const expectCloseWhenEscape = async () => {
    await getDrawer().vm.$emit('close')
    expect(wrapper.emitted('close')).toHaveLength(1)
  }

  const expectOneDrawerShown = (stub: typeof StudentTraceDetailsStub | typeof DeclaredSkillDetailsStub | typeof DeclaredExperienceDetailsStub) => {
    expect(getTraceDetails().exists()).toBe(stub === StudentTraceDetailsStub)
    expect(getSkillDetails().exists()).toBe(stub === DeclaredSkillDetailsStub)
    expect(getExperienceDetails().exists()).toBe(stub === DeclaredExperienceDetailsStub)
  }

  BddTest().when('a trace is selected', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the drawer', () => {
      expectDrawerVisible()
    })

    BddTest().then('it should display the trace title', () => {
      expectTitle(TRACE_TITLE, mockedFeedbackTrace.data.title)
    })

    BddTest().then('it should render StudentTraceDetails with drawer-specific props', () => {
      const details = getTraceDetails()
      expect(details.exists()).toBe(true)
      expect(details.props('trace')).toEqual(mockedFeedbackTrace.data)
      expect(details.props('hideValorizedBadge')).toBe(true)
      expect(details.props('disableRowLayout')).toBe(true)
    })

    BddTest().then('it should emit close when escape is pressed', async () => {
      await expectCloseWhenEscape()
    })

    BddTest().then('it should pass the exit label to the drawer footer', () => {
      expect(getDrawer().props('confirmCancelProps')).toEqual({ cancelLabel: 'Quitter' })
    })

    BddTest().then('it should enable close on click outside', () => {
      expect(getDrawer().props('closeOnClickOutside')).toBe(true)
    })

    BddTest().then('it should not render more than one drawer', () => {
      expectOneDrawerShown(StudentTraceDetailsStub)
    })
  })

  BddTest().when('a declared skill is selected', () => {
    beforeEach(() => {
      mountWith({ feedbackAssociatedElement: mockedFeedbackDeclaredSkill })
    })

    BddTest().then('it should display the drawer', () => {
      expectDrawerVisible()
    })

    BddTest().then('it should display the declared skill title', () => {
      expectTitle(SKILL_TITLE, mockedFeedbackDeclaredSkill.data.title)
    })

    BddTest().then('it should render DeclaredSkillDetails with the declared skill details', () => {
      const details = getSkillDetails()
      expect(details.exists()).toBe(true)
      expect(details.props('declaredSkillProgressDetails')).toEqual(mockedFeedbackDeclaredSkill.data)
      expect(details.props('hideValorizedBadge')).toBe(true)
      expect(details.props('disableRowLayout')).toBe(true)
    })

    BddTest().then('it should not render more than one drawer', () => {
      expectOneDrawerShown(DeclaredSkillDetailsStub)
    })
  })

  BddTest().when('a declared experience is selected', () => {
    beforeEach(() => {
      mountWith({ feedbackAssociatedElement: mockedFeedbackDeclaredExperience })
    })

    BddTest().then('it should display the drawer', () => {
      expectDrawerVisible()
    })

    BddTest().then('it should display the declared experience title', () => {
      expectTitle(EXPERIENCE_TITLE, mockedFeedbackDeclaredExperience.data.title)
    })

    BddTest().then('it should render DeclaredExperienceDetails with the declared experience details', () => {
      const details = getExperienceDetails()
      expect(details.exists()).toBe(true)
      expect(details.props('declaredExperienceDetails')).toEqual(mockedFeedbackDeclaredExperience.data)
      expect(details.props('hideValorizedBadge')).toBe(true)
      expect(details.props('disableRowLayout')).toBe(true)
    })

    BddTest().then('it should not render more than one drawer', () => {
      expectOneDrawerShown(DeclaredExperienceDetailsStub)
    })
  })
})
