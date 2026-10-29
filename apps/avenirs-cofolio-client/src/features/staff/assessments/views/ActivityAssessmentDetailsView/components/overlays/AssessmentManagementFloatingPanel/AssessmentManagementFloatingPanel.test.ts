import type { VueWrapper } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import type { AssessmentManagementFloatingPanelProps } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/overlays/AssessmentManagementFloatingPanel/AssessmentManagementFloatingPanel.vue'
import { MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvButtonStub, AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import {
  mockedAssessmentDetailsCommentOnly,
  mockedAssessmentDetailsSent,
  mockedAssessmentDetailsWithAssociations,
  mockedAssessmentDetailsWithoutAssociations
} from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { FloatingPanelStub } from '@/common/components/overlay/FloatingPanel/FloatingPanel.stub'
import { ICONS } from '@/common/constants'
import { ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX } from '@/features/staff/assessments/config'
import { AssessmentCommentFormFieldStub } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentCommentFormField/AssessmentCommentFormField.stub'
import { AssessmentGradeFormFieldStub } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentGradeFormField/AssessmentGradeFormField.stub'
import { AssessmentValidationFormFieldStub } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentValidationFormField/AssessmentValidationFormField.stub'
import AssessmentManagementFloatingPanel from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/overlays/AssessmentManagementFloatingPanel/AssessmentManagementFloatingPanel.vue'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile }),
  }
})

const { addErrorMessageMock, addSuccessMessageMock } = vi.hoisted(() => ({
  addErrorMessageMock: vi.fn(),
  addSuccessMessageMock: vi.fn()
}))

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: addErrorMessageMock,
      addSuccessMessage: addSuccessMessageMock
    }))
  }
})

const PANEL_TITLE = 'Appréciation de l\'activité'
const SEND_LABEL = 'Envoyer'
const INCOMPLETE_TOOLTIP = 'Tous les champs de l\'appréciation doivent être renseignés avant de pouvoir l\'envoyer'
const UPDATE_LABEL = 'Modifier'
const CANCEL_LABEL = 'Annuler'
const DRAFT_SAVED_LABEL = 'Brouillon enregistré sur ce navigateur'
const DRAFT_NOT_SAVED_LABEL = 'Brouillon non enregistré\u00A0: le stockage du navigateur est indisponible'
const SEND_SUCCESS_MESSAGE = 'L\'appréciation a été envoyée avec succès'
const UPDATE_SUCCESS_MESSAGE = 'L\'appréciation a été modifiée avec succès'
const ACTIVITY_TITLE = 'Test Activity'

const gradedAssessment = mockedAssessmentDetailsWithAssociations
const validatedAssessment = mockedAssessmentDetailsWithoutAssociations

function getStorageKey (assessment: DeclaredActivityAssessmentDetailsDTO) {
  return `${ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX}-${assessment.declaredActivityId}`
}

function storeDraft (assessment: DeclaredActivityAssessmentDetailsDTO, draft: WriteAssessmentFormData) {
  return localStorage.setItem(getStorageKey(assessment), JSON.stringify(draft))
}

BddTest().given('an AssessmentManagementFloatingPanel', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentManagementFloatingPanel>>

  const stubs = {
    AvBadge: AvBadgeStub,
    AvButton: AvButtonStub,
    AvMessage: AvMessageStub,
    FloatingPanel: FloatingPanelStub,
    AssessmentGradeFormField: AssessmentGradeFormFieldStub,
    AssessmentValidationFormField: AssessmentValidationFormFieldStub,
    AssessmentCommentFormField: AssessmentCommentFormFieldStub,
  }

  const mountWith = async (props: Partial<AssessmentManagementFloatingPanelProps> = {}) => {
    wrapper = mountComponent(AssessmentManagementFloatingPanel, {
      props: {
        assessment: gradedAssessment,
        activityTitle: ACTIVITY_TITLE,
        ...props,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getPanel = () => wrapper.findComponent(FloatingPanelStub)
  const getGradeField = () => wrapper.findComponent(AssessmentGradeFormFieldStub)
  const getValidationField = () => wrapper.findComponent(AssessmentValidationFormFieldStub)
  const getCommentField = () => wrapper.findComponent(AssessmentCommentFormFieldStub)
  const getButton = (testId: string) => wrapper.findAllComponents(AvButtonStub).find(button => button.attributes('data-testid') === testId)
  const getSendButton = () => getButton('send-assessment-button')!
  const getUpdateButton = () => getButton('update-assessment-button')
  const getCancelButton = () => getButton('cancel-assessment-update-button')
  const getDraftBadge = () => wrapper.find('[data-testid="assessment-draft-badge"]')
  const getSentMessage = () => wrapper.findComponent(AvMessageStub)

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockIsMobile.value = false
  })

  afterEach(() => {
    localStorage.clear()
  })

  BddTest().when('the activity expects a grade and a comment', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the floating panel with the correct props', () => {
      const panel = getPanel()
      expect(panel.props('title')).toBe(PANEL_TITLE)
      expect(panel.props('subtitle')).toBe(ACTIVITY_TITLE)
      expect(panel.props('icon')).toBe(ICONS.ASSESSMENT)
    })

    BddTest().then('it should render the grade field with the grading scale and the comment field', () => {
      expect(getGradeField().props('maxGrade')).toBe(gradedAssessment.activity.assessment?.grade)
      expect(getGradeField().props('readonly')).toBe(false)
      expect(getCommentField().props('readonly')).toBe(false)
    })

    BddTest().then('it should make the comment optional', () => {
      expect(getCommentField().props('required')).toBe(false)
    })

    BddTest().then('it should not render the validation field', () => {
      expect(getValidationField().exists()).toBe(false)
    })

    BddTest().then('it should disable the send button until the assessment is complete', () => {
      const sendButton = getSendButton()
      expect(sendButton.props('label')).toBe(SEND_LABEL)
      expect(sendButton.props('icon')).toBe(MS_ICONS.SEND_OUTLINE_ROUNDED)
      expect(sendButton.props('disabled')).toBe(true)
      expect(sendButton.props('disabledTooltip')).toBe(INCOMPLETE_TOOLTIP)
    })

    BddTest().then('it should not render the draft badge nor the sent message', () => {
      expect(getDraftBadge().exists()).toBe(false)
      expect(getSentMessage().exists()).toBe(false)
    })
  })

  BddTest().when('the activity expects a validation and a comment', () => {
    beforeEach(async () => {
      await mountWith({ assessment: validatedAssessment })
    })

    BddTest().then('it should render the validation and comment fields only', () => {
      expect(getValidationField().exists()).toBe(true)
      expect(getCommentField().exists()).toBe(true)
      expect(getGradeField().exists()).toBe(false)
    })

    BddTest().then('it should make the comment optional', () => {
      expect(getCommentField().props('required')).toBe(false)
    })
  })

  BddTest().when('the comment is the only option expected by the activity', () => {
    beforeEach(async () => {
      await mountWith({ assessment: mockedAssessmentDetailsCommentOnly })
    })

    BddTest().then('it should render the comment field only, as required', () => {
      expect(getCommentField().props('required')).toBe(true)
      expect(getGradeField().exists()).toBe(false)
      expect(getValidationField().exists()).toBe(false)
    })
  })

  BddTest().when('a complete draft was saved in the browser', () => {
    beforeEach(async () => {
      storeDraft(gradedAssessment, { grade: 15, validation: null, comment: 'Bon travail' })
      await mountWith()
    })

    BddTest().then('it should show that the draft is saved in the browser', () => {
      expect(getDraftBadge().exists()).toBe(true)
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe(DRAFT_SAVED_LABEL)
    })

    BddTest().then('it should enable the send button', () => {
      expect(getSendButton().props('disabled')).toBe(false)
    })

    BddTest().and('the send button is clicked', () => {
      beforeEach(async () => {
        await getSendButton().vm.$emit('click')
        await flushPromises()
      })

      BddTest().then('it should send the assessment and clear the draft', () => {
        expect(addSuccessMessageMock).toHaveBeenCalledWith(SEND_SUCCESS_MESSAGE)
        expect(localStorage.getItem(getStorageKey(gradedAssessment))).toBeNull()
      })

      BddTest().then('it should toggle the panel', () => {
        expect(getPanel().attributes('data-collapsed')).toBe('false')
      })
    })
  })

  BddTest().when('the browser storage is unavailable and a grade is written', () => {
    let setItemSpy: MockInstance<Storage['setItem']>

    beforeEach(async () => {
      setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable')
      })
      await mountWith()
      getGradeField().props('form').setFieldValue('grade', 15)
      await flushPromises()
    })

    afterEach(() => {
      setItemSpy.mockRestore()
    })

    BddTest().then('it should show that the draft could not be saved', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('label')).toBe(DRAFT_NOT_SAVED_LABEL)
      expect(badge.props('icon')).toBe(MDI_ICONS.ALERT_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the assessment has already been sent', () => {
    beforeEach(async () => {
      await mountWith({ assessment: mockedAssessmentDetailsSent })
    })

    BddTest().then('it should show when the assessment was sent', () => {
      expect(getSentMessage().props('message')).toContain('Appréciation envoyée le')
    })

    BddTest().then('it should render the fields as readonly', () => {
      expect(getGradeField().props('readonly')).toBe(true)
      expect(getCommentField().props('readonly')).toBe(true)
    })

    BddTest().then('it should propose to modify it instead of sending it', () => {
      expect(getUpdateButton()?.props('label')).toBe(UPDATE_LABEL)
      expect(getUpdateButton()?.props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(getButton('send-assessment-button')).toBeUndefined()
      expect(getCancelButton()).toBeUndefined()
    })

    BddTest().and('the update button is clicked', () => {
      beforeEach(async () => {
        await getUpdateButton()?.vm.$emit('click')
        await flushPromises()
      })

      BddTest().then('it should make the fields editable again', () => {
        expect(getGradeField().props('readonly')).toBe(false)
        expect(getCommentField().props('readonly')).toBe(false)
      })

      BddTest().then('it should still show when the assessment was sent', () => {
        expect(getSentMessage().props('message')).toContain('Appréciation envoyée le')
      })

      BddTest().then('it should propose to cancel or to send the modified assessment', () => {
        expect(getUpdateButton()).toBeUndefined()
        expect(getCancelButton()?.props('label')).toBe(CANCEL_LABEL)
        expect(getSendButton().props('label')).toBe(SEND_LABEL)
        expect(getSendButton().props('disabled')).toBe(false)
      })

      BddTest().and('the modification is cancelled', () => {
        beforeEach(async () => {
          getGradeField().props('form').setFieldValue('grade', 4)
          await getCancelButton()?.vm.$emit('click')
          await flushPromises()
        })

        BddTest().then('it should render the fields as readonly with the sent values', () => {
          expect(getGradeField().props('readonly')).toBe(true)
          expect(getGradeField().props('form').state.values.grade).toBe(mockedAssessmentDetailsSent.assessment?.grade)
        })

        BddTest().then('it should propose to modify it again', () => {
          expect(getUpdateButton()?.exists()).toBe(true)
          expect(getButton('send-assessment-button')).toBeUndefined()
        })
      })

      BddTest().and('the modified assessment is sent', () => {
        beforeEach(async () => {
          getGradeField().props('form').setFieldValue('grade', 12)
          await flushPromises()
          await getSendButton().vm.$emit('click')
          await flushPromises()
        })

        BddTest().then('it should show that the assessment has been modified', () => {
          expect(addSuccessMessageMock).toHaveBeenCalledWith(UPDATE_SUCCESS_MESSAGE)
        })

        BddTest().then('it should toggle the panel', () => {
          expect(getPanel().attributes('data-collapsed')).toBe('false')
        })

        BddTest().then('it should render the fields as readonly again', () => {
          expect(getGradeField().props('readonly')).toBe(true)
          expect(getUpdateButton()?.exists()).toBe(true)
        })
      })
    })
  })

  BddTest().when('the viewport is mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountWith()
    })

    BddTest().then('it should not pass the activity title as panel subtitle', () => {
      expect(getPanel().props('subtitle')).toBeUndefined()
    })

    BddTest().then('it should render the activity title inside the panel content', () => {
      expect(wrapper.find('.title--mobile').text()).toBe(ACTIVITY_TITLE)
    })
  })
})
