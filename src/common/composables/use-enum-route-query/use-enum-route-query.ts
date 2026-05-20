import type { WritableComputedRef } from 'vue'
import { useRouteQuery } from '@vueuse/router'

type EnumLike = Record<string, string | number>
type EnumKeys<TEnum extends EnumLike> = Extract<keyof TEnum, string>

/**
 * Composable for handling enum values in route query parameters.
 * @param queryName - The name of the query parameter in the URL.
 * @param enumObject - The enum object to use for conversion.
 * @param defaultValue - The default enum value to use if the query parameter is not present or invalid.
 * @returns A WritableComputedRef representing the enum value.
 *
 * @example
 * enum MyEnum {
 *   OPTION_1 = 'option-1',
 *   OPTION_2 = 'option-2',
 * }
 *
 * const selectedOption = useEnumRouteQuery('option', MyEnum, MyEnum.OPTION_1)
 *
 * // If the URL is /my-route?option=OPTION_2, then selectedOption.value will be MyEnum.OPTION_2
 * // If the URL is /my-route?option=INVALID, then selectedOption.value will be MyEnum.OPTION_1 (default)
 * // If the URL is /my-route (no option query), then selectedOption.value will be MyEnum.OPTION_1 (default)
 *
 * @example
 * // === WITH NUMERIC ENUMS ===
 * enum MyNumericEnum {
 *   FIRST = 0,
 *   SECOND = 1,
 * }
 *
 * const selectedNumericOption = useEnumRouteQuery('numOption', MyNumericEnum, MyNumericEnum.FIRST)
 *
 * // If the URL is /my-route?numOption=SECOND, then selectedNumericOption.value will be MyNumericEnum.SECOND (1)
 * // If the URL is /my-route?numOption=INVALID, then selectedNumericOption.value will be MyNumericEnum.FIRST (0) (default)
 * // If the URL is /my-route (no numOption query), then selectedNumericOption.value will be MyNumericEnum.FIRST (0) (default)
 *
 * @example
 * // === WITH AvTabs (which are numeric enums with string keys) ===
 * enum TabIndex {
 *   FIRST_TAB = 0,
 *   SECOND_TAB = 1,
 * }
 *
 * const activeTab = useEnumRouteQuery('tab', TabIndex, TabIndex.FIRST_TAB)
 *
 * // If the URL is /my-route?tab=SECOND_TAB, then activeTab.value will be TabIndex.SECOND_TAB (1)
 * // If the URL is /my-route?tab=INVALID, then activeTab.value will be TabIndex.FIRST_TAB (0) (default)
 * // If the URL is /my-route (no tab query), then activeTab.value will be TabIndex.FIRST_TAB (0) (default)
 *
 * // In template:
 * // <AvTabs v-model="activeTab">
 */
export function useEnumRouteQuery<
  TEnum extends EnumLike,
  TDefaultValue extends TEnum[EnumKeys<TEnum>],
> (
  queryName: string,
  enumObject: TEnum,
  defaultValue: TDefaultValue,
): WritableComputedRef<TDefaultValue> {
  const enumKeys = Object.keys(enumObject)
    .filter(key => Number.isNaN(Number(key))) as EnumKeys<TEnum>[]

  const defaultKey = enumKeys.find(key => enumObject[key] === defaultValue) || enumKeys[0]

  const routeQuery = useRouteQuery<string>(queryName, defaultKey)

  return computed<TDefaultValue>({
    get () {
      const key = enumKeys.includes(routeQuery.value as EnumKeys<TEnum>)
        ? routeQuery.value as EnumKeys<TEnum>
        : defaultKey

      return enumObject[key] as unknown as TDefaultValue
    },
    set (enumValue) {
      const key = enumKeys.find(key => enumObject[key] === enumValue) || defaultKey
      routeQuery.value = key
    }
  })
}
