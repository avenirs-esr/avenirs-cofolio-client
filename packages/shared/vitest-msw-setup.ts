import { configureSharedFetch } from '#shared/api'
import { FetchInterceptorManager } from '#shared/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { setupMswLifecycle } from '#shared/test-utils/unit/setup/msw'
import { afterAll, afterEach, beforeAll } from 'vitest'

configureSharedFetch({ baseUrl: 'http://localhost' }, new FetchInterceptorManager())
setupMswLifecycle({ beforeAll, afterEach, afterAll }, () => import('./src/__mocks__/msw/server'))
