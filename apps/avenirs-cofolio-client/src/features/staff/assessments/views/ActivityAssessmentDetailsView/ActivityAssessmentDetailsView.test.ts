import type { VueWrapper } from '@vue/test-utils'
import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { HttpStatusCode } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { beforeEach, expect } from 'vitest'
import { mockedAssessmentDetailsWithAssociations, mockedAssessmentDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { server } from '@/__mocks__/msw/server'
import { getGetAssessmentDetailsUrl } from '@/api/avenir-esr'
import { ActivityDetailsDrawerStub } from '@/common/activities/components/ActivityDetailsDrawer/ActivityDetailsDrawer.stub'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants/route-names'
import ActivityAssessmentDetailsView from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/ActivityAssessmentDetailsView.vue'
import {
  AssessmentAssociatedElementSummaryCardStub
} from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/cards/AssessmentAssociatedElementSummaryCard/AssessmentAssociatedElementSummaryCard.stub'
import {
  ActivityAssessmentStudentInformationStub
} from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/dataDisplay/ActivityAssessmentStudentInformation/ActivityAssessmentStudentInformation.stub'
import {
  AssessmentManagementFloatingPanelStub
} from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/overlays/AssessmentManagementFloatingPanel/AssessmentManagementFloatingPanel.stub'
import { StudentPerspectiveCardStub } from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.stub'

const route = reactive<{ name: string, path: string, params: { declaredActivityId: string } }>({
  name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
  path: ROUTES.STAFF.ACTIVITY_ASSESSMENT.path,
  params: { declaredActivityId: mockedAssessmentDetailsWithAssociations.declaredActivityId },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

BddTest().given('an activity assessment details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityAssessmentDetailsView>>

  const stubs = {
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityDetailsDrawer: ActivityDetailsDrawerStub,
    ActivityAssessmentStudentInformation: ActivityAssessmentStudentInformationStub,
    StudentPerspectiveCard: StudentPerspectiveCardStub,
    AssessmentAssociatedElementSummaryCard: AssessmentAssociatedElementSummaryCardStub,
    AssessmentManagementFloatingPanel: AssessmentManagementFloatingPanelStub,
  }

  const mountWith = async (declaredActivityId: string) => {
    route.path = ROUTES.STAFF.ACTIVITY_ASSESSMENT.path.replace(':declaredActivityId', declaredActivityId)
    route.params = { declaredActivityId }

    wrapper = mountComponent(ActivityAssessmentDetailsView, {
      props: { declaredActivityId },
      global: { stubs },
    })

    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a submission having a perspective and associations', () => {
    beforeEach(async () => {
      await mountWith(mockedAssessmentDetailsWithAssociations.declaredActivityId)
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render the page sub title with the activity title', () => {
      const pageSubTitle = wrapper.findAllComponents(AvIconTextStub).find(component => component.attributes('data-testid') === 'page-sub-title')

      expect(pageSubTitle?.props('text')).toContain(mockedAssessmentDetailsWithAssociations.activity.title)
    })

    BddTest().then('it should render the see activity button', () => {
      expect(wrapper.find('[data-testid="see-activity"]').exists()).toBe(true)
    })

    BddTest().then('it should render the learner information of the submission', () => {
      const studentInformation = wrapper.findComponent(ActivityAssessmentStudentInformationStub)

      expect(studentInformation.props('student')).toEqual(mockedAssessmentDetailsWithAssociations.student)
      expect(studentInformation.props('submittedAt')).toBe(mockedAssessmentDetailsWithAssociations.submittedAt)
      expect(studentInformation.props('status')).toBe(mockedAssessmentDetailsWithAssociations.status)
    })

    BddTest().then('it should render the learner perspective card with the learner perspective', () => {
      const studentPerspectiveCard = wrapper.findComponent(StudentPerspectiveCardStub)

      expect(studentPerspectiveCard.exists()).toBe(true)
      expect(studentPerspectiveCard.props('perspective')).toBe(mockedAssessmentDetailsWithAssociations.reflexion)
    })

    BddTest().then('it should render the associated element summary card with the associations', () => {
      const associatedElementSummaryCard = wrapper.findComponent(AssessmentAssociatedElementSummaryCardStub)

      expect(associatedElementSummaryCard.exists()).toBe(true)
      expect(associatedElementSummaryCard.props('associations')).toEqual(mockedAssessmentDetailsWithAssociations.associations)
    })

    BddTest().then('it should render the assessment management floating panel', () => {
      const floatingPanel = wrapper.findComponent(AssessmentManagementFloatingPanelStub)

      expect(floatingPanel.props('assessment')).toEqual(mockedAssessmentDetailsWithAssociations)
      expect(floatingPanel.props('activityTitle')).toBe(mockedAssessmentDetailsWithAssociations.activity.title)
    })

    BddTest().then('it should not show the activity details drawer by default', () => {
      expect(wrapper.findComponent(ActivityDetailsDrawerStub).props('show')).toBe(false)
    })

    BddTest().and('the see activity button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('[data-testid="see-activity"]').trigger('click')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should show the activity details drawer', () => {
        expect(wrapper.findComponent(ActivityDetailsDrawerStub).props('show')).toBe(true)
      })

      BddTest().and('the drawer emits close', () => {
        beforeEach(async () => {
          await wrapper.findComponent(ActivityDetailsDrawerStub).vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should hide the activity details drawer', () => {
          expect(wrapper.findComponent(ActivityDetailsDrawerStub).props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with a submission without perspective nor associations', () => {
    beforeEach(async () => {
      await mountWith(mockedAssessmentDetailsWithoutAssociations.declaredActivityId)
    })

    BddTest().then('it should render the learner information of the submission', () => {
      expect(wrapper.findComponent(ActivityAssessmentStudentInformationStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the learner perspective card', () => {
      expect(wrapper.findComponent(StudentPerspectiveCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the associated element summary card', () => {
      expect(wrapper.findComponent(AssessmentAssociatedElementSummaryCardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the activity of the submission does not expect any assessment', () => {
    const assessmentWithoutSetup: DeclaredActivityAssessmentDetailsDTO = {
      ...mockedAssessmentDetailsWithAssociations,
      activity: { ...mockedAssessmentDetailsWithAssociations.activity, assessment: undefined }
    }

    beforeEach(async () => {
      server.use(
        http.get(`*${getGetAssessmentDetailsUrl(':declaredActivityId')}`, () =>
          HttpResponse.json<DeclaredActivityAssessmentDetailsDTO>(assessmentWithoutSetup, { status: HttpStatusCode.OK }))
      )
      await mountWith(mockedAssessmentDetailsWithAssociations.declaredActivityId)
    })

    BddTest().then('it should not render the assessment management floating panel', () => {
      expect(wrapper.findComponent(AssessmentManagementFloatingPanelStub).exists()).toBe(false)
    })
  })

  BddTest().when('the submission cannot be found', () => {
    beforeEach(async () => {
      await mountWith('INVALID_DECLARED_ACTIVITY_ID')
    })

    BddTest().then('it should pass the error to the query suspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).not.toBeNull()
    })

    BddTest().then('it should not render the learner information', () => {
      expect(wrapper.findComponent(ActivityAssessmentStudentInformationStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the activity details drawer', () => {
      expect(wrapper.findComponent(ActivityDetailsDrawerStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the assessment management floating panel', () => {
      expect(wrapper.findComponent(AssessmentManagementFloatingPanelStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted without a declared activity id', () => {
    beforeEach(async () => {
      await mountWith('')
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the learner information', () => {
      expect(wrapper.findComponent(ActivityAssessmentStudentInformationStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the learner perspective card', () => {
      expect(wrapper.findComponent(StudentPerspectiveCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the associated element summary card', () => {
      expect(wrapper.findComponent(AssessmentAssociatedElementSummaryCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the activity details drawer', () => {
      expect(wrapper.findComponent(ActivityDetailsDrawerStub).exists()).toBe(false)
    })
  })
})
