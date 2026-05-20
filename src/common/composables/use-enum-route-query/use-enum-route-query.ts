import type { WritableComputedRef } from 'vue'
import { useRouteQuery } from '@vueuse/router'

type EnumLike = Record<string, string | number>
type EnumKeys<TEnum extends EnumLike> = Extract<keyof TEnum, string>
type EnumRouteQueryModelValue<T> = T extends number ? number : string

/**
 * Composable for handling enum values in route query parameters.
 * @param queryName - The name of the query parameter in the URL.
 * @param enumObject - The enum object to use for conversion.
 * @param defaultKey - The default key to use if the query parameter is not present or invalid.
 * @returns A WritableComputedRef representing the enum value.
 *
 * @example
 * enum MyEnum {
 *   OPTION_1 = 'option-1',
 *   OPTION_2 = 'option-2',
 * }
 *
 * const selectedOption = useEnumRouteQuery('option', MyEnum, 'OPTION_1')
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
 * const selectedNumericOption = useEnumRouteQuery('numOption', MyNumericEnum, 'FIRST')
 *
 * // If the URL is /my-route?numOption=SECOND, then selectedNumericOption.value will be MyNumericEnum.SECOND (1)
 * // If the URL is /my-route?numOption=INVALID, then selectedNumericOption.value will be MyNumericEnum.FIRST (0) (default)
 * // If the URL is /my-route (no numOption query), then selectedNumericOption.value will be MyNumericEnum.FIRST (0) (default)
 *
 * @example
 * // === WITH AV_TABS (which are numeric enums with string keys) ===
 * enum AvTabs {
 *   FIRST_TAB = 0,
 *   SECOND_TAB = 1,
 * }
 *
 * const activeTab = useEnumRouteQuery('tab', AvTabs, 'FIRST_TAB')
 *
 * // If the URL is /my-route?tab=SECOND_TAB, then activeTab.value will be AvTabs.SECOND_TAB (1)
 * // If the URL is /my-route?tab=INVALID, then activeTab.value will be AvTabs.FIRST_TAB (0) (default)
 * // If the URL is /my-route (no tab query), then activeTab.value will be AvTabs.FIRST_TAB (0) (default)
 *
 * // In template:
 * // <AvTabs v-model="activeTab">
 */
export function useEnumRouteQuery<
  TEnum extends EnumLike,
  TDefaultKey extends EnumKeys<TEnum>,
> (
  queryName: string,
  enumObject: TEnum,
  defaultKey: TDefaultKey,
): WritableComputedRef<EnumRouteQueryModelValue<TEnum[TDefaultKey]>> {
  const routeQuery = useRouteQuery<string>(queryName, defaultKey)

  const enumKeys = Object.keys(enumObject)
    .filter(key => Number.isNaN(Number(key))) as EnumKeys<TEnum>[]

  return computed<EnumRouteQueryModelValue<TEnum[TDefaultKey]>>({
    get () {
      const key = enumKeys.includes(routeQuery.value as EnumKeys<TEnum>)
        ? routeQuery.value as EnumKeys<TEnum>
        : defaultKey

      return enumObject[key] as unknown as EnumRouteQueryModelValue<TEnum[TDefaultKey]>
    },
    set (enumValue) {
      const key = enumKeys.find(key => enumObject[key] === enumValue) ?? defaultKey
      routeQuery.value = key
    }
  })
}
