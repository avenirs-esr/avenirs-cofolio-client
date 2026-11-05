import type { Component } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { defineComponent, h } from 'vue'

export interface CreateFormFieldTestWrapperOptions<
  TFormData,
  TFieldName extends keyof TFormData,
> {
  formFieldComponent: Component
  fieldName: TFieldName
  defaultValue: TFormData[TFieldName]
  useValidator?: () => (value: TFormData[TFieldName]) => string | undefined
  extraProps?: Record<string, unknown>
}

export function createFormFieldTestWrapper<
  TFormData,
  TFieldName extends keyof TFormData,
> ({
  formFieldComponent,
  fieldName,
  defaultValue,
  useValidator,
  extraProps
}: CreateFormFieldTestWrapperOptions<TFormData, TFieldName>) {
  type FieldFormData = Pick<TFormData, TFieldName>

  return defineComponent({
    setup () {
      const validate = useValidator?.() ?? (() => undefined)

      const form = useForm({
        defaultValues: {
          [fieldName]: defaultValue
        } as FieldFormData,
        validators: {
          onSubmit ({ value }: { value: FieldFormData }) {
            return {
              fields: {
                [fieldName]: validate(value[fieldName])
              }
            }
          }
        }
      })

      const handleSubmit = (e: Event) => {
        e.preventDefault()
        ;(form as { handleSubmit: () => void }).handleSubmit()
      }

      return {
        form,
        handleSubmit,
        extraProps: extraProps ?? {}
      }
    },

    render () {
      return h('form', { onSubmit: this.handleSubmit }, [
        h(formFieldComponent, {
          form: this.form,
          ...this.extraProps
        })
      ])
    }
  })
}
