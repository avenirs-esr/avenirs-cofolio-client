import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { SlotsType } from 'vue'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useForm } from '@tanstack/vue-form'
import { vi } from 'vitest'

const slots = Object as SlotsType<{ default?: () => unknown }>
const name = 'EditNationalActivityViewFormWrapper'
const template = '<div><slot /></div>'

export const mockSave = vi.fn()
export const mockCancel = vi.fn()

export const EditNationalActivityViewFormWrapper = defineComponent({
  name,
  template,
  slots,
  setup () {
    const defaultValues: EditActivityFormData = {
      title: 'Test activity',
      description: '',
      executionPeriodInfo: '',
      feedbackAllowedIterations: undefined,
      summary: '',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    }

    const form = useForm({
      defaultValues,
    })

    provideEditNationalActivityViewContext({ form, save: mockSave, cancel: mockCancel })
  },
})

export const EditNationalActivityViewFormWrapperDirty = defineComponent({
  name,
  template,
  slots,
  setup () {
    const defaultValues: EditActivityFormData = {
      title: '',
      description: '',
      executionPeriodInfo: '',
      feedbackAllowedIterations: undefined,
      summary: '',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    }

    const form = useForm({
      defaultValues,
    })

    provideEditNationalActivityViewContext({ form, save: mockSave, cancel: mockCancel })

    onMounted(() => {
      form.setFieldValue('title', 'Modified title')
    })
  },
})
