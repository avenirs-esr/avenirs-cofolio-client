import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { SlotsType } from 'vue'
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
    const form = useForm({
      defaultValues: { title: 'Test activity', description: '' } satisfies EditActivityFormData,
    })

    provideEditNationalActivityViewContext({ form, save: mockSave, cancel: mockCancel })
  },
})

export const EditNationalActivityViewFormWrapperDirty = defineComponent({
  name,
  template,
  slots,
  setup () {
    const form = useForm({
      defaultValues: { title: '', description: '' } satisfies EditActivityFormData,
    })

    provideEditNationalActivityViewContext({ form, save: mockSave, cancel: mockCancel })

    onMounted(() => {
      form.setFieldValue('title', 'Modified title')
    })
  },
})
