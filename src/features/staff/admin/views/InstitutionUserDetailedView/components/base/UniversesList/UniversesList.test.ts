import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { EUniverse } from '@/api/avenir-esr'
import { UniverseBadgeStub } from '@/common/components/badges/UniverseBadge/UniverseBadge.stub'
import UniversesList from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/UniversesList.vue'

BddTest().given('a universes list', () => {
  let wrapper: VueWrapper<InstanceType<typeof UniversesList>>

  const stubs = { UniverseBadge: UniverseBadgeStub }

  BddTest().when('the list contains multiple universes', () => {
    beforeEach(() => {
      wrapper = mountComponent(UniversesList, {
        props: {
          universes: [EUniverse.STAFF, EUniverse.STUDENT],
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render each universe', () => {
      const items = wrapper.findAll('li')

      expect(items).toHaveLength(2)
      expect(items[0].text()).toBe('STAFF')
      expect(items[1].text()).toBe('STUDENT')
    })
  })

  BddTest().when('the list is empty', () => {
    beforeEach(() => {
      wrapper = mountComponent(UniversesList, {
        props: {
          universes: [],
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render an empty list', () => {
      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.findAll('li')).toHaveLength(0)
    })
  })

  BddTest().when('the list contains a single universe', () => {
    beforeEach(() => {
      wrapper = mountComponent(UniversesList, {
        props: {
          universes: [EUniverse.STUDENT],
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render the universe', () => {
      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(wrapper.find('li').text()).toBe('STUDENT')
    })
  })
})
