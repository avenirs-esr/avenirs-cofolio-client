import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

export function resolveCguRedirect (
  to: RouteLocationNormalized,
  hasAcceptedLatestCgu: boolean
): RouteLocationRaw | undefined {
  const { cguRouteName } = to.meta

  if (cguRouteName === undefined || hasAcceptedLatestCgu || to.name === cguRouteName) {
    return
  }

  return { name: cguRouteName, query: { redirect: to.fullPath } }
}
