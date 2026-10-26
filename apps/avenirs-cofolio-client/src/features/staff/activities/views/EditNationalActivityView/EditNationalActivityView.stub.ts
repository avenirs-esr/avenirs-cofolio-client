import type { Mock } from 'vitest'
import type { SlotsType } from 'vue'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { useForm } from '@tanstack/vue-form'
import { vi } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'

const slots = Object as SlotsType<{ default?: () => unknown }>
const name = 'EditNationalActivityViewFormWrapper'
const template = '<div><slot /></div>'

export const mockHandleSubmit: Mock = vi.fn()
export const mockIsExecutionPeriodEnabled = ref(false)
export const mockIsAssessmentEnabled = ref(false)
export const mockIsAssessmentGradeEnabled = ref(false)
export const mockIsUpdating = ref(false)
export const mockSave: Mock = vi.fn()
export const mockQueueAutoSave: Mock = vi.fn()
export const mockCancel: Mock = vi.fn()

export const EditNationalActivityViewFormWrapper = defineComponent({
  name,
  template,
  slots,
  setup () {
    const defaultValues: EditActivityFormData = {
      title: 'Test activity',
      thematic: EActivityThematic.TRANSVERSAL as EActivityThematic,
      description: '',
      enableReflection: true,
      recommendedCompletionContexts: '',
      feedbackAllowedIterations: undefined,
      summary: '',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      bannerAction: EditActivityFormDataBannerAction.NONE,
      files: [],
      links: [],
      isNational: false,
      assessmentComment: false,
      assessmentGrade: undefined,
      assessmentValidation: false,
      targetInstitutionIds: [],
      targetGroupIds: [],
    }

    const form = useForm({
      defaultValues,
    })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
      isExecutionPeriodEnabled: mockIsExecutionPeriodEnabled,
      isAssessmentEnabled: mockIsAssessmentEnabled,
      isAssessmentGradeEnabled: mockIsAssessmentGradeEnabled,
      save: mockSave,
      queueAutoSave: mockQueueAutoSave,
    })
  },
})

export const EditNationalActivityViewFormWrapperDirty = defineComponent({
  name,
  template,
  slots,
  setup () {
    const defaultValues: EditActivityFormData = {
      title: '',
      thematic: EActivityThematic.TRANSVERSAL as EActivityThematic,
      description: '',
      enableReflection: true,
      recommendedCompletionContexts: '',
      feedbackAllowedIterations: undefined,
      summary: '',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      bannerAction: EditActivityFormDataBannerAction.NONE,
      files: [],
      links: [],
      isNational: false,
      assessmentComment: false,
      assessmentGrade: undefined,
      assessmentValidation: false,
      targetInstitutionIds: [],
      targetGroupIds: [],
    }

    const form = useForm({
      defaultValues,
    })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
      isExecutionPeriodEnabled: mockIsExecutionPeriodEnabled,
      isAssessmentEnabled: mockIsAssessmentEnabled,
      isAssessmentGradeEnabled: mockIsAssessmentGradeEnabled,
      save: mockSave,
      queueAutoSave: mockQueueAutoSave,
    })

    onMounted(() => {
      form.setFieldValue('title', 'Modified title')
    })
  },
})

export const EditNationalActivityViewFormWrapperValid = defineComponent({
  name: 'EditNationalActivityViewFormWrapper',
  template: '<div><slot /></div>',
  setup () {
    const defaultValues: EditActivityFormData = {
      title: 'Test activity',
      thematic: EActivityThematic.TRANSVERSAL as EActivityThematic,
      description: 'Test description',
      enableReflection: true,
      recommendedCompletionContexts: 'Test recommended completion contexts',
      feedbackAllowedIterations: undefined,
      summary: 'Test summary',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      bannerAction: EditActivityFormDataBannerAction.NONE,
      files: [],
      links: [],
      isNational: true,
      assessmentComment: false,
      assessmentGrade: undefined,
      assessmentValidation: false,
      targetInstitutionIds: [],
      targetGroupIds: [],
    }

    const form = useForm({ defaultValues })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
      isExecutionPeriodEnabled: mockIsExecutionPeriodEnabled,
      isAssessmentEnabled: mockIsAssessmentEnabled,
      isAssessmentGradeEnabled: mockIsAssessmentGradeEnabled,
      save: mockSave,
      queueAutoSave: mockQueueAutoSave,
    })
  },
})
