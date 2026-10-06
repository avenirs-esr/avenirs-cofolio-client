import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivitiesOverview } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedActivityItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedActivityItem/ValorizedActivityItem.vue'
import { ValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

const BASE_DECLARED_ACTIVITY: DeclaredActivityViewDTO = mockedDeclaredActivitiesOverview[0]

const stubs = {
  ValorizedItem: ValorizedItemStub,
  ActivityThematicBadge: ActivityThematicBadgeStub
}

function mountValorizedActivityItem (activity: DeclaredActivityViewDTO) {
  return mountComponent(ValorizedActivityItem, {
    props: { activity },
    global: { stubs }
  })
}

BddTest().given('a valorized activity item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedActivityItem>>

  const getValorizedItem = () => wrapper.findComponent(ValorizedItemStub)
  const getThematicBadge = () => wrapper.findComponent(ActivityThematicBadgeStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountValorizedActivityItem(BASE_DECLARED_ACTIVITY)
    })

    BddTest().then('it should render the ValorizedItem with the activity information', () => {
      const valorizedItem = getValorizedItem()

      expect(valorizedItem.exists()).toBe(true)
      expect(valorizedItem.props('title')).toBe(BASE_DECLARED_ACTIVITY.title)
      expect(valorizedItem.props('itemId')).toBe(BASE_DECLARED_ACTIVITY.id)
      expect(valorizedItem.props('type')).toBe(ValorizedItemType.DECLARED_ACTIVITY)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      expect(getThematicBadge().props('thematic')).toBe(BASE_DECLARED_ACTIVITY.thematic)
    })
  })
})
