import type { ROUTES } from '@/common/constants'
import type { RouteOf, RouteParamsOf } from '@/common/types/route-restrictions.types'

type OptionalTail<TItems extends readonly unknown[]> = TItems extends readonly [...infer THead, infer TLast]
  ? undefined extends TLast
    ? [...OptionalTail<THead>, TLast?]
    : TItems
  : TItems

/**
 * The params `canAccessRoute()` takes for the route named `TName`: those of its path, in
 * order, as in {@link RouteParamsOf}, where the optional params ending the path can be left
 * out.
 */
export type RouteAccessParams<TName> = OptionalTail<RouteParamsOf<Extract<RouteOf<typeof ROUTES>, { readonly name: TName }>>>
