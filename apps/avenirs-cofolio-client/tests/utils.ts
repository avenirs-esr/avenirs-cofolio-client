import type { QueryClientConfig } from '@tanstack/vue-query'
import type { VueWrapper } from '@vue/test-utils'
import type { Component, ComponentInternalInstance } from 'vue'
import type { AvRoute } from '@/common/types'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createMountComposable } from '@avenirs-esr/shared/test-utils/unit'
import { useForm } from '@tanstack/vue-form'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { expect } from 'vitest'
import { h } from 'vue'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'

export function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  BddTest().given(`the route ${route.name}`, () => {
    BddTest().when('the route is built', () => {
      BddTest().then('it should have correct route config', () => {
        expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
      })

      BddTest().then('it should dynamically import the component and match it', async () => {
        const componentLoader = route.component as () => Promise<{ default: unknown }>
        const componentModule = await componentLoader()
        expect(componentModule).toBeDefined()
        expect(componentModule.default).toBe(expectedComponent)
      })
    })
  })
}

export const mountComposable = createMountComposable({
  i18n,
  createTestPinia: () => createPinia().use(piniaPluginPersistedstate),
})

/**
 * Mounts a Vue composable configured to use TanStack Query in tests.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {QueryClientConfig} [queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {T} The result returned by the mounted composable.
 */
export function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  const { result } = mountComposable(fn, { useTanstack: true, queryClientConfig })
  return result
}

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

/**
 * Creates a test wrapper component for form field testing with TanStack Form.
 *
 * @template TFormData - The form data type (e.g., DeclaredExperienceFormData)
 * @template TFieldName - The field name key from TFormData
 * @param {CreateFormFieldTestWrapperOptions} options - Configuration options for the wrapper
 * @param {Component} options.formFieldComponent - The form field component to test
 * @param {TFieldName} options.fieldName - The name of the field in the form
 * @param {TFormData[TFieldName]} options.defaultValue - The default value for the field
 * @param {() => (value: TFormData[TFieldName]) => string | undefined} options.useValidator - A factory function that returns the validator (called inside setup to support composables using useI18n)
 * @param {Record<string, unknown>} options.extraProps - Extra props forwarded to the tested component
 * @returns {Component} A test wrapper component with form handling
 *
 * @example
 * const TestWrapper = createFormFieldTestWrapper<DeclaredExperienceFormData, 'location'>({
 *   formFieldComponent: DeclaredExperienceLocationFormField,
 *   fieldName: 'location',
 *   defaultValue: '',
 *   useValidator: () => useDeclaredExperienceFormValidators().validateLocation
 * })
 *
 * // Then in tests:
 * const wrapper = mount(TestWrapper, { global: { stubs } })
 * await wrapper.find('form').trigger('submit')
 */
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

export interface ExposedComponentInstance {
  $: ComponentInternalInstance & {
    provides: Record<string | symbol, unknown>
  }
}

export function findAvButtonByTestId (wrapper: VueWrapper, testId: string) {
  return wrapper.findAllComponents(AvButtonStub).find(button => button.vm.$attrs['data-testid'] === testId)
}

export function getAvButtonByTestId (wrapper: VueWrapper, testId: string) {
  const button = findAvButtonByTestId(wrapper, testId)

  if (!button) {
    throw new Error(`Button with test id ${testId} not found`)
  }

  return button
}
