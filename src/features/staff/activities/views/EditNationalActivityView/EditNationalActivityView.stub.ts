import type { SlotsType } from 'vue'
import { EActivityThematic } from '@/api/avenir-esr'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { type EditActivityFormData, EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useForm } from '@tanstack/vue-form'
import { vi } from 'vitest'

const slots = Object as SlotsType<{ default?: () => unknown }>
const name = 'EditNationalActivityViewFormWrapper'
const template = '<div><slot /></div>'

export const mockHandleSubmit = vi.fn()
export const mockIsUpdating = ref(false)
export const mockSave = vi.fn()
export const mockQueueAutoSave = vi.fn()
export const mockCancel = vi.fn()

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
    }

    const form = useForm({
      defaultValues,
    })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
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
    }

    const form = useForm({
      defaultValues,
    })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
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
    }

    const form = useForm({ defaultValues })
    form.handleSubmit = mockHandleSubmit

    provideEditNationalActivityViewContext({
      form,
      isUpdating: mockIsUpdating,
      save: mockSave,
      queueAutoSave: mockQueueAutoSave,
    })
  },
})
