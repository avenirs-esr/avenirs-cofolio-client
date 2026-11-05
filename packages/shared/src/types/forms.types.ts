import type { DeepKeys, DeepValue, FieldApi, FormApi, VueFormApi } from '@tanstack/vue-form'

export type AnyFormApi<TFormData extends object> = FormApi<TFormData, any, any, any, any, any, any, any, any, any>
export type AnyVueFormApi<TFormData extends object> = AnyFormApi<TFormData> & VueFormApi<TFormData, any, any, any, any, any, any, any, any, any>
export type AnyFieldApi<TFormData extends object, TFieldName extends DeepKeys<TFormData>> = FieldApi<TFormData, TFieldName, DeepValue<TFormData, TFieldName>, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
export type TopLevelFieldKey<TFormData extends object> = TFormData extends unknown ? Extract<keyof TFormData, string> : never
