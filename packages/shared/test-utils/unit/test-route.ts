import type { AvRoute } from '#shared/types/router.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

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
