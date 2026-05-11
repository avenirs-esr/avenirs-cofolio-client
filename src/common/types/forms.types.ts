import type { FormApi } from '@tanstack/vue-form'

export type AnyFormApi<TFormData extends object> = FormApi<TFormData, any, any, any, any, any, any, any, any, any>
export type TopLevelFieldKey<TFormData extends object> = TFormData extends unknown ? Extract<keyof TFormData, string> : never
