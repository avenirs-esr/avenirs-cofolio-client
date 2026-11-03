import type { MetaBreadcrumb } from '#shared/composables/use-breadcrumb/types'

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: MetaBreadcrumb
  }
}
