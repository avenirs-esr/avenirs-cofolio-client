import type { AvRoute } from '#shared/types/router.types'
import { testRoute } from '#shared/test-utils/unit/index'
import { defineComponent } from 'vue'

const TestView = defineComponent({
  name: 'TestView',
  render: () => null,
})

const route: AvRoute = {
  path: '/test-route',
  name: 'test-route',
  component: () => Promise.resolve({ default: TestView }),
}

testRoute(route, { path: '/test-route', name: 'test-route' }, TestView)
